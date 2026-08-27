const form = document.querySelector('#auth-form');
const emailInput = document.querySelector('#email');
const passwordInput = document.querySelector('#password');
const rememberInput = document.querySelector('input[name="remember"]');
const message = document.querySelector('#form-message');
const switchMode = document.querySelector('#switch-mode');
const switchModeText = document.querySelector('#switch-mode-text');
const forgotPassword = document.querySelector('#forgot-password');
const formModeLabel = document.querySelector('#form-mode-label');
const formIntro = document.querySelector('#form-intro');
const loginTitle = document.querySelector('#login-title');
const submitLabel = document.querySelector('#submit-label');
const rememberLabel = document.querySelector('#remember-label');
const loginPanel = document.querySelector('.login-panel');
const sessionPanel = document.querySelector('#session-panel');
const sessionEmail = document.querySelector('#session-email');
const logoutButton = document.querySelector('#logout-button');

let isRegisterMode = false;
const databaseName = 'jogo-database';
const databaseVersion = 1;

function openDatabase() {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open(databaseName, databaseVersion);

        request.onupgradeneeded = () => {
            const database = request.result;
            if (!database.objectStoreNames.contains('users')) {
                database.createObjectStore('users', { keyPath: 'email' });
            }
            if (!database.objectStoreNames.contains('sessions')) {
                database.createObjectStore('sessions', { keyPath: 'email' });
            }
        };

        request.onsuccess = () => resolve(request.result);
        request.onerror = () => reject(request.error);
    });
}

async function findUser(email) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction('users', 'readonly')
            .objectStore('users')
            .get(email);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function saveUser(user) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction('users', 'readwrite')
            .objectStore('users')
            .add(user);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function saveSession(session) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction('sessions', 'readwrite')
            .objectStore('sessions')
            .put(session);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

async function findSession(email) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction('sessions', 'readonly')
            .objectStore('sessions')
            .get(email);
        request.onsuccess = () => resolve(request.result || null);
        request.onerror = () => reject(request.error);
    });
}

async function removeSession(email) {
    const database = await openDatabase();
    return new Promise((resolve, reject) => {
        const request = database.transaction('sessions', 'readwrite')
            .objectStore('sessions')
            .delete(email);
        request.onsuccess = () => resolve();
        request.onerror = () => reject(request.error);
    });
}

function showSession(session) {
    loginPanel.hidden = true;
    sessionPanel.hidden = false;
    sessionPanel.dataset.email = session.email;
    sessionEmail.textContent = `Você está conectado como ${session.email}.`;
}

function showLogin() {
    loginPanel.hidden = false;
    sessionPanel.hidden = true;
}

function showMessage(text, isSuccess = false) {
    message.textContent = text;
    message.classList.toggle('success', isSuccess);
}

function setRegisterMode(registering) {
    isRegisterMode = registering;
    const mode = registering ? 'Cadastro' : 'Acesso ao jogo';

    formModeLabel.textContent = mode;
    loginTitle.textContent = registering ? 'Crie sua conta.' : 'Bem-vindo de volta.';
    formIntro.textContent = registering ? 'Guarde seu progresso e comece a jogar.' : 'Entre para continuar sua aventura.';
    submitLabel.textContent = registering ? 'Cadastrar' : 'Entrar';
    forgotPassword.hidden = registering;
    rememberLabel.hidden = registering;
    switchModeText.innerHTML = registering
        ? 'Já tem uma conta? <a href="#" id="switch-mode">Entrar</a>'
        : 'Ainda não tem uma conta? <a href="#" id="switch-mode">Criar conta</a>';
    switchModeText.querySelector('a').addEventListener('click', toggleMode);
    showMessage('');
}

function toggleMode(event) {
    event.preventDefault();
    setRegisterMode(!isRegisterMode);
    emailInput.focus();
}

form.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = emailInput.value.trim().toLowerCase();
    const password = passwordInput.value;

    if (!emailInput.validity.valid) {
        showMessage('Digite um e-mail válido.');
        emailInput.focus();
        return;
    }
    if (password.length < 6) {
        showMessage('A senha deve ter pelo menos 6 caracteres.');
        passwordInput.focus();
        return;
    }

    try {
        const storedUser = await findUser(email);
        if (isRegisterMode) {
            if (storedUser) {
                showMessage('Já existe uma conta com este e-mail.');
                return;
            }
            await saveUser({ email, password, createdAt: Date.now() });
            setRegisterMode(false);
            emailInput.value = email;
            passwordInput.value = '';
            showMessage('Conta criada. Você já pode entrar.', true);
            return;
        }

        if (!storedUser || storedUser.password !== password) {
            showMessage('E-mail ou senha incorretos.');
            return;
        }

        const session = { email, loggedInAt: Date.now() };
        if (rememberInput.checked) {
            await saveSession(session);
            localStorage.setItem('jogo-remembered-email', email);
        } else {
            sessionStorage.setItem('jogo-session', JSON.stringify(session));
            localStorage.removeItem('jogo-remembered-email');
        }
        showSession(session);
    } catch (error) {
        console.error('Erro ao acessar o banco de dados:', error);
        showMessage('Não foi possível acessar o banco de dados.');
    }
});

switchMode.addEventListener('click', toggleMode);

forgotPassword.addEventListener('click', (event) => {
    event.preventDefault();
    showMessage('Para redefinir a senha, crie uma nova conta com outro e-mail.');
});

logoutButton.addEventListener('click', async () => {
    const activeSession = JSON.parse(sessionStorage.getItem('jogo-session') || 'null');
    const activeEmail = activeSession?.email || sessionPanel.dataset.email;
    try {
        if (activeEmail) await removeSession(activeEmail);
        sessionStorage.removeItem('jogo-session');
        localStorage.removeItem('jogo-remembered-email');
        showLogin();
        showMessage('Você saiu da conta.', true);
    } catch (error) {
        console.error('Erro ao encerrar a sessão:', error);
        showMessage('Não foi possível encerrar a sessão.');
    }
});

async function restoreSession() {
    const temporarySession = JSON.parse(sessionStorage.getItem('jogo-session') || 'null');
    if (temporarySession) {
        showSession(temporarySession);
        return;
    }

    const rememberedEmail = localStorage.getItem('jogo-remembered-email');
    if (!rememberedEmail) return;

    const rememberedSession = await findSession(rememberedEmail);
    if (rememberedSession) showSession(rememberedSession);
}

restoreSession().catch((error) => {
    console.error('Erro ao restaurar a sessão:', error);
});
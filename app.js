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

let isRegisterMode = false;

function showMessage(text, isSuccess = false) {
    message.textContent = text;
    message.classList.toggle('success', isSuccess);
}

function getStoredUser() {
    return JSON.parse(localStorage.getItem('jogo-user') || 'null');
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

form.addEventListener('submit', (event) => {
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

    const storedUser = getStoredUser();
    if (isRegisterMode) {
        if (storedUser && storedUser.email === email) {
            showMessage('Já existe uma conta com este e-mail.');
            return;
        }
        localStorage.setItem('jogo-user', JSON.stringify({ email, password }));
        setRegisterMode(false);
        emailInput.value = email;
        passwordInput.value = '';
        showMessage('Conta criada. Você já pode entrar.', true);
        return;
    }

    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
        showMessage('E-mail ou senha incorretos.');
        return;
    }

    const storage = rememberInput.checked ? localStorage : sessionStorage;
    storage.setItem('jogo-session', JSON.stringify({ email, loggedInAt: Date.now() }));
    showMessage(`Login realizado. Boa aventura, ${email}!`, true);
});

switchMode.addEventListener('click', toggleMode);

forgotPassword.addEventListener('click', (event) => {
    event.preventDefault();
    showMessage('Para redefinir a senha, crie uma nova conta com outro e-mail.');
});
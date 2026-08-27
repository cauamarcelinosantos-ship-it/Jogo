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
const submitButton = document.querySelector('#submit-button');
const submitLabel = document.querySelector('#submit-label');
const rememberLabel = document.querySelector('#remember-label');
const loginPanel = document.querySelector('#login-panel');
const gamePanel = document.querySelector('#game-panel');
const gamePlayer = document.querySelector('#game-player');
const logoutButton = document.querySelector('#logout-button');
const passwordToggle = document.querySelector('#password-toggle');
const mapElement = document.querySelector('#map');
const gameMessage = document.querySelector('#game-message');
const energyValue = document.querySelector('#energy-value');
const fragmentValue = document.querySelector('#fragment-value');
const movementButtons = document.querySelectorAll('[data-move]');

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
    gamePanel.hidden = false;
    gamePanel.dataset.email = session.email;
    gamePlayer.textContent = session.email;
    startGame(session.email);
}

function showLogin() {
    loginPanel.hidden = false;
    gamePanel.hidden = true;
}

const mapCells = [
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '✦', type: 'fragment' },
    { icon: '⌁', type: 'water' }, { icon: '●', type: 'start' }, { icon: '🪨', type: 'rock' },
    { icon: '✦', type: 'fragment' }, { icon: '🌲', type: 'forest' }, { icon: '◉', type: 'portal' }
];
let gameState = null;

function getGameState(email) {
    try {
        const saved = JSON.parse(localStorage.getItem(`jogo-progress-${email}`) || 'null');
        if (saved && Number.isInteger(saved.position) && Number.isInteger(saved.energy) && Array.isArray(saved.fragments)) {
            return saved;
        }
    } catch (error) {
        console.warn('Progresso inválido; uma nova aventura será iniciada.', error);
    }
    return { position: 4, energy: 12, fragments: [] };
}

function saveGameState() {
    localStorage.setItem(`jogo-progress-${gameState.email}`, JSON.stringify(gameState));
}

function renderGame() {
    mapElement.innerHTML = '';
    mapCells.forEach((cell, index) => {
        const tile = document.createElement('div');
        tile.className = `map-tile ${cell.type}`;
        const isPlayer = gameState.position === index;
        if (isPlayer) tile.classList.add('player');
        if (cell.type === 'fragment' && gameState.fragments.includes(index)) tile.classList.add('collected');
        if (isPlayer) {
            tile.innerHTML = '<span class="character" aria-hidden="true"><span class="character-hair"></span><span class="character-face">•</span><span class="character-body"></span></span>';
        } else {
            tile.innerHTML = `<span class="scene-object" aria-hidden="true">${cell.type === 'fragment' && gameState.fragments.includes(index) ? '·' : cell.icon}</span>`;
        }
        tile.setAttribute('aria-label', isPlayer ? 'Seu personagem está aqui' : `Casa ${index + 1}`);
        mapElement.appendChild(tile);
    });
    energyValue.textContent = gameState.energy;
    fragmentValue.textContent = `${gameState.fragments.length}/3`;
}

function startGame(email) {
    gameState = { ...getGameState(email), email };
    renderGame();
}

function movePlayer(direction) {
    if (!gameState || gameState.energy <= 0 || gameState.fragments.length === 3) return;
    const row = Math.floor(gameState.position / 3);
    const column = gameState.position % 3;
    const moves = { up: [-1, 0], down: [1, 0], left: [0, -1], right: [0, 1] };
    if (!moves[direction]) return;
    const [rowChange, columnChange] = moves[direction];
    const nextRow = row + rowChange;
    const nextColumn = column + columnChange;
    if (nextRow < 0 || nextRow > 2 || nextColumn < 0 || nextColumn > 2) {
        gameMessage.textContent = 'A montanha bloqueia esse caminho.';
        return;
    }

    gameState.position = nextRow * 3 + nextColumn;
    gameState.energy -= 1;
    const cell = mapCells[gameState.position];
    if (cell.type === 'fragment' && !gameState.fragments.includes(gameState.position)) {
        gameState.fragments.push(gameState.position);
        gameMessage.textContent = 'Você encontrou um fragmento de Aurora.';
    } else if (cell.type === 'portal' && gameState.fragments.length < 3) {
        gameMessage.textContent = 'O portal está adormecido. Faltam fragmentos.';
    } else if (gameState.fragments.length === 3 && cell.type === 'portal') {
        gameMessage.textContent = 'Portal aberto. Você venceu a aventura!';
    } else if (gameState.energy === 0) {
        gameMessage.textContent = 'Sua energia acabou. Recarregue a aventura para tentar de novo.';
    } else {
        gameMessage.textContent = 'A trilha segue silenciosa. Continue explorando.';
    }
    saveGameState();
    renderGame();
}

function showMessage(text, isSuccess = false) {
    message.textContent = text;
    message.classList.toggle('success', isSuccess);
}

function setRegisterMode(registering) {
    isRegisterMode = registering;
    const mode = registering ? 'Cadastro' : 'Acesso ao jogo';

    formModeLabel.textContent = mode;
    loginTitle.textContent = registering ? 'Crie sua conta.' : 'Entre na sua aventura.';
    formIntro.textContent = registering ? 'Guarde seu progresso e comece a jogar.' : 'Seu progresso espera por você.';
    submitLabel.textContent = registering ? 'Cadastrar' : 'Entrar';
    forgotPassword.hidden = registering;
    rememberLabel.hidden = registering;
    switchModeText.innerHTML = registering
        ? 'Já tem uma conta? <a href="#" id="switch-mode">Entrar</a>'
        : 'Ainda não tem uma conta? <a href="#" id="switch-mode">Criar conta</a>';
    switchModeText.querySelector('a').addEventListener('click', toggleMode);
    showMessage('');
    passwordInput.value = '';
    passwordInput.autocomplete = registering ? 'new-password' : 'current-password';
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
        submitButton.disabled = true;
        submitLabel.textContent = isRegisterMode ? 'Cadastrando...' : 'Entrando...';
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
    } finally {
        submitButton.disabled = false;
        submitLabel.textContent = isRegisterMode ? 'Cadastrar' : 'Entrar';
    }
});

switchMode.addEventListener('click', toggleMode);

forgotPassword.addEventListener('click', (event) => {
    event.preventDefault();
    showMessage('Para redefinir a senha, crie uma nova conta com outro e-mail.');
});

passwordToggle.addEventListener('click', () => {
    const isPasswordVisible = passwordInput.type === 'text';
    passwordInput.type = isPasswordVisible ? 'password' : 'text';
    passwordToggle.textContent = isPasswordVisible ? 'Mostrar' : 'Ocultar';
    passwordToggle.setAttribute('aria-label', isPasswordVisible ? 'Mostrar senha' : 'Ocultar senha');
});

logoutButton.addEventListener('click', async () => {
    let activeSession = null;
    try {
        activeSession = JSON.parse(sessionStorage.getItem('jogo-session') || 'null');
    } catch (error) {
        sessionStorage.removeItem('jogo-session');
    }
    const activeEmail = activeSession?.email || gamePanel.dataset.email;
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

movementButtons.forEach((button) => {
    button.addEventListener('click', () => movePlayer(button.dataset.move));
});

document.addEventListener('keydown', (event) => {
    const directions = { ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right' };
    if (directions[event.key] && !gamePanel.hidden) {
        event.preventDefault();
        movePlayer(directions[event.key]);
    }
});

async function restoreSession() {
    let temporarySession = null;
    try {
        temporarySession = JSON.parse(sessionStorage.getItem('jogo-session') || 'null');
    } catch (error) {
        sessionStorage.removeItem('jogo-session');
        console.warn('Sessão temporária inválida; o login será solicitado novamente.', error);
    }
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
/**
 * 🎮 GERENCIADOR DE INTERFACE - UI Manager
 *
 * Gerencia transições e estados entre as telas:
 * - Tela de Login
 * - Tela de Gameplay
 * - Tela de Resultado de Combate
 */

class UIManager {
    constructor() {
        this.currentScreen = 'login'; // login, game, battle
        this.loginPanel = document.querySelector('#login-panel');
        this.gamePanel = document.querySelector('#game-panel');
        this.battleContainer = document.querySelector('#battle-container');
        this.loginArt = document.querySelector('.login-art');

        this.googleLoginBtn = document.querySelector('#google-login-btn');
        this.anonymousLoginBtn = document.querySelector('#anonymous-login-btn');
        this.logoutButton = document.querySelector('#logout-button');
        this.formMessage = document.querySelector('#form-message');
        this.gamePlayerName = document.querySelector('#game-player');

        this.setupEventListeners();
    }

    /**
     * Configura listeners gerais de UI
     */
    setupEventListeners() {
        // Logout
        if (this.logoutButton) {
            this.logoutButton.addEventListener('click', () => this.handleLogout());
        }
    }

    /**
     * Mostra a tela de login
     */
    showLoginScreen() {
        console.log('🔐 Exibindo tela de login...');

        this.currentScreen = 'login';

        // Mostrar login
        if (this.loginPanel) this.loginPanel.hidden = false;
        if (this.loginArt) this.loginArt.style.display = 'flex';

        // Esconder gameplay
        if (this.gamePanel) this.gamePanel.hidden = true;
        if (this.battleContainer) this.battleContainer.style.display = 'none';

        // Reset de mensagens
        this.showFormMessage('', false);

        // Re-habilitar botões
        this.setLoginButtonsEnabled(true);
    }

    /**
     * Mostra a tela de gameplay
     */
    showGameScreen(playerName = 'Jogador') {
        console.log('🎮 Exibindo tela de gameplay...');

        this.currentScreen = 'game';

        // Esconder login
        if (this.loginPanel) this.loginPanel.hidden = true;
        if (this.loginArt) this.loginArt.style.display = 'none';

        // Mostrar gameplay
        if (this.gamePanel) this.gamePanel.hidden = false;
        if (this.gamePlayerName) this.gamePlayerName.textContent = playerName;

        // Esconder battle inicialmente
        if (this.battleContainer) this.battleContainer.style.display = 'none';
    }

    /**
     * Mostra a tela de combate
     */
    showBattleScreen(battleHTML) {
        console.log('⚔️ Exibindo tela de combate...');

        this.currentScreen = 'battle';

        // Esconder UI do mapa
        if (this.gamePanel) {
            const mapFrame = this.gamePanel.querySelector('.map-frame');
            const journal = this.gamePanel.querySelector('.journal');
            const movement = this.gamePanel.querySelector('.movement');

            if (mapFrame) mapFrame.style.display = 'none';
            if (journal) journal.style.display = 'none';
            if (movement) movement.style.display = 'none';
        }

        // Mostrar container de combate
        if (this.battleContainer) {
            this.battleContainer.style.display = 'block';
            this.battleContainer.innerHTML = battleHTML;
        }
    }

    /**
     * Volta para a tela de jogo (após combate)
     */
    showGameScreenAfterBattle() {
        console.log('🎮 Voltando para gameplay após combate...');

        this.currentScreen = 'game';

        // Mostrar UI do mapa
        if (this.gamePanel) {
            const mapFrame = this.gamePanel.querySelector('.map-frame');
            const journal = this.gamePanel.querySelector('.journal');
            const movement = this.gamePanel.querySelector('.movement');

            if (mapFrame) mapFrame.style.display = 'flex';
            if (journal) journal.style.display = 'block';
            if (movement) movement.style.display = 'grid';
        }

        // Limpar container de combate
        if (this.battleContainer) {
            this.battleContainer.style.display = 'none';
            this.battleContainer.innerHTML = '';
        }
    }

    /**
     * Mostra mensagem no formulário de login
     */
    showFormMessage(message, isSuccess = false) {
        if (this.formMessage) {
            this.formMessage.textContent = message;
            this.formMessage.className = isSuccess ? 'form-message success' : 'form-message error';
            this.formMessage.style.display = message ? 'block' : 'none';
        }
    }

    /**
     * Habilita/desabilita botões de login
     */
    setLoginButtonsEnabled(enabled) {
        if (this.googleLoginBtn) this.googleLoginBtn.disabled = !enabled;
        if (this.anonymousLoginBtn) this.anonymousLoginBtn.disabled = !enabled;
    }

    /**
     * Mostra indicador de carregamento
     */
    showLoading(show = true) {
        if (this.formMessage) {
            if (show) {
                this.formMessage.textContent = '⏳ Carregando...';
                this.formMessage.className = 'form-message';
                this.formMessage.style.display = 'block';
                this.setLoginButtonsEnabled(false);
            } else {
                this.formMessage.style.display = 'none';
                this.setLoginButtonsEnabled(true);
            }
        }
    }

    /**
     * Manipula logout
     */
    handleLogout() {
        console.log('👋 Saindo do jogo...');
        if (typeof signOutFirebase === 'function') {
            signOutFirebase();
        } else {
            // Fallback se Firebase não estiver disponível
            currentUser = null;
            this.showLoginScreen();
        }
    }

    /**
     * Obtém a tela atual
     */
    getCurrentScreen() {
        return this.currentScreen;
    }

    /**
     * Verifica se está em uma tela específica
     */
    isScreen(screenName) {
        return this.currentScreen === screenName;
    }
}

// Instância global
const uiManager = new UIManager();

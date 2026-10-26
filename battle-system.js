const battleContainer = document.getElementById("battle-container");

let jogadorVida = 100;
let jogadorVidaMaxima = 500;
let jogadorAtaque = 10;
let jogadorDefesa = 5;

let inimigoVida = 30;
let inimigoVidaMaxima = 500;
let inimigoAtaque = 20;

function iniciarBatalha(inimigo = "Lobo Sombrio") {
    if (!battleContainer) {
        console.error("battle-container não encontrado!");
        return;
    }

 const dadosSalvos = localStorage.getItem("rpgPlayer");

if (dadosSalvos) {
    const jogador = JSON.parse(dadosSalvos);

    jogadorVidaMaxima = jogador.vidaMaxima;
    jogadorVida = jogador.vidaMaxima;
    jogadorAtaque = jogador.ataque;
    jogadorDefesa = jogador.defesa;
}
    battleContainer.style.display = "block";

    battleContainer.innerHTML = `
        <div class="battle-box">

            <h2>⚔️ BATALHA!</h2>

            <div class="enemy">
                <h3>🐺 ${inimigo}</h3>
                <p>❤️ VIDA: <strong id="enemy-hp">30</strong>/30</p>
            </div>

            <div class="battle-player">
                <h3>🧙 SEU PERSONAGEM</h3>
                <p>❤️ VIDA: <strong id="player-hp">${jogadorVida}</strong>/${jogadorVidaMaxima}</p>
            </div>

            <div class="battle-actions">
                <button id="attack-btn">⚔️ ATACAR</button>
                <button id="run-btn">🏃 FUGIR</button>
            </div>

            <p id="battle-message">🐺 O ${inimigo} apareceu!</p>

        </div>
    `;

    document
        .getElementById("attack-btn")
        .addEventListener("click", atacar);

    document
        .getElementById("run-btn")
        .addEventListener("click", fugir);
}

function atacar() {
    const enemyHp = document.getElementById("enemy-hp");
    const message = document.getElementById("battle-message");

 const dano = jogadorAtaque;

inimigoVida -= dano;

    if (inimigoVida < 0) {
        inimigoVida = 0;
    }

    enemyHp.textContent = inimigoVida;

    if (inimigoVida <= 0) {
        message.textContent = "🎉 Você derrotou o Lobo Sombrio!";
        document.getElementById("attack-btn").disabled = true;
        return;
    }

message.textContent = `💥 Você causou ${dano} de dano!`;

    setTimeout(inimigoAtaca, 700);
}

function inimigoAtaca() {
    const playerHp = document.getElementById("player-hp");
    const message = document.getElementById("battle-message");

    console.log("INIMIGO ATACOU");

const danoRecebido = Math.max(1, inimigoAtaque - jogadorDefesa);

jogadorVida -= danoRecebido;

    if (jogadorVida < 0) {
        jogadorVida = 0;
    }

    playerHp.textContent = jogadorVida;

    if (jogadorVida <= 0) {
        message.textContent = "💀 Você foi derrotado!";
        document.getElementById("attack-btn").disabled = true;
        return;
    }

    message.textContent =
    `🐺 O Lobo Sombrio atacou! Você perdeu ${danoRecebido} de vida.`;
}

function fugir() {
    battleContainer.style.display = "none";
}
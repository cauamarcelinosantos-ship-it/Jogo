document.addEventListener("DOMContentLoaded", () => {
  const anonymousLoginBtn = document.getElementById("anonymous-login-btn");
  const loginPanel = document.getElementById("login-panel");
  const characterCreation = document.getElementById("character-creation");

  if (anonymousLoginBtn) {
    anonymousLoginBtn.addEventListener("click", () => {
      // Esconde a tela de login
      if (loginPanel) {
        loginPanel.hidden = true;
        loginPanel.style.display = "none";
      }

      // Mostra a criação do personagem
      if (characterCreation) {
        characterCreation.hidden = false;
        characterCreation.style.display = "block";
      }
    });
  }
});
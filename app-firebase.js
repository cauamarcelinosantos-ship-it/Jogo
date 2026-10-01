import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { 
  getAuth, 
  signInWithPopup, 
  GoogleAuthProvider, 
  signInAnonymously, 
  onAuthStateChanged 
} from "firebase/auth";


const firebaseConfig = {
  apiKey: "SUA_API_KEY",
  authDomain: "SEU_PROJETO.firebaseapp.com",
  projectId: "SEU_PROJETO_ID",
  storageBucket: "SEU_PROJETO.appspot.com",
  messagingSenderId: "SEU_SENDER_ID",
  appId: "SEU_APP_ID"
};

// 2. Inicialização dos serviços
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
export const auth = getAuth(app);

// 3. Captura dos elementos do HTML
const googleLoginBtn = document.querySelector('#google-login-btn');
const anonymousLoginBtn = document.querySelector('#anonymous-login-btn');
const formMessage = document.querySelector('#form-message');

// 4. Provedor de autenticação do Google
const googleProvider = new GoogleAuthProvider();

// 5. Evento: Login com Google
if (googleLoginBtn) {
  googleLoginBtn.addEventListener('click', async () => {
    try {
      if (formMessage) formMessage.textContent = "Conectando com o Google...";
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Erro no login Google:", error);
      if (formMessage) formMessage.textContent = "Erro ao logar com Google.";
    }
  });
}

// 6. Evento: Login Anônimo
if (anonymousLoginBtn) {
  anonymousLoginBtn.addEventListener('click', async () => {
    try {
      if (formMessage) formMessage.textContent = "Entrando anônimamente...";
      await signInAnonymously(auth);
    } catch (error) {
      console.error("Erro no login anônimo:", error);
      if (formMessage) formMessage.textContent = "Erro ao logar anonimamente.";
    }
  });
}

// 7. Observador de estado do usuário (detecta quando logou/deslogou)
onAuthStateChanged(auth, (user) => {
  if (user) {
    const nomeUsuario = user.displayName || 'Aventureiro Anônimo';
    console.log("Usuário autenticado:", user.uid);
    if (formMessage) {
      formMessage.textContent = `Bem-vindo, ${nomeUsuario}!`;
    }
  } else {
    console.log("Nenhum usuário conectado.");
  }
});
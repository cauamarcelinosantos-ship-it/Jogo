// ===== CONFIGURAÇÃO FIREBASE =====
// INSTRUÇÕES: Substitua com suas credenciais do Firebase
// 1. Acesse https://console.firebase.google.com
// 2. Crie um novo projeto
// 3. Ative Authentication (Google + Anonymous)
// 4. Crie um banco Firestore
// 5. Configure as regras de segurança (veja abaixo)
// 6. Copie as credenciais aqui

export const firebaseConfig = {
    apiKey: "AIzaSyDEMO_DEMO_DEMO_DEMO_DEMO_DEMO_DEMO",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "000000000000",
    appId: "1:000000000000:web:0000000000000000000000"
};

// ===== REGRAS FIRESTORE =====
// Copie e cole no console Firebase (Firestore > Regras):
/*
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read: if request.auth.uid == userId;
      allow write: if request.auth.uid == userId;
    }
    match /scores/{document=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
*/

# Jogo com Firebase

Jogo de exploração com backend Firebase integrado. Autenticação, pontuações em tempo real e sincronização multiplayer.

## 🚀 Configuração Firebase

### 1. Criar Projeto Firebase

1. Acesse [Firebase Console](https://console.firebase.google.com)
2. Clique em "Criar projeto"
3. Escolha um nome (ex: "jogo-aurora")
4. Desabilite Google Analytics (opcional)
5. Clique em "Criar projeto"

### 2. Configurar Autenticação

1. No menu esquerdo, vá em **Authentication** > **Get Started**
2. Clique em **Google**
   - Ative o provedor
   - Configure um e-mail de suporte
   - Salve

3. Clique em **Anonymous**
   - Ative para permitir jogar sem login

### 3. Configurar Firestore

1. No menu, vá em **Firestore Database** > **Create Database**
2. Escolha a região padrão
3. Escolha **Start in test mode** (depois configure segurança)
4. Clique em **Create**

### 4. Regras de Segurança (Firestore)

1. Vá em **Firestore Database** > **Rules**
2. Substitua o conteúdo por:

```
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
```

3. Clique em **Publish**

### 5. Copiar Credenciais

1. Vá em **Project Settings** (engrenagem no canto superior esquerdo)
2. Vá em **Your apps** > **Aplicativos da Web**
3. Se não existir, clique em `</>` para criar um novo
4. Copie a configuração JavaScript:

```javascript
const firebaseConfig = {
    apiKey: "AIzaSy...",
    authDomain: "seu-projeto.firebaseapp.com",
    projectId: "seu-projeto",
    storageBucket: "seu-projeto.appspot.com",
    messagingSenderId: "123456789",
    appId: "1:123456789:web:abcdefghijk"
};
```

### 6. Atualizar app-firebase.js

1. Abra `app-firebase.js`
2. Procure por `firebaseConfig` (linha ~50)
3. Substitua os valores de exemplo pelos valores reais copiados acima
4. Salve o arquivo

## 🎮 Como Jogar

1. Abra `http://localhost:8000` no navegador
2. Clique em "Entrar com Google" OU "Jogar Anonimamente"
3. Escolha dificuldade (Normal ou Difícil)
4. Use setas do teclado para se mover
5. Colete 3-5 fragmentos (dependendo da dificuldade)
6. Chegue ao portal para vencer!

## 🏆 Funcionalidades

- ✅ **Autenticação Google**: Login com conta Google
- ✅ **Login Anônimo**: Jogue sem criar conta
- ✅ **Firestore Database**: Salva pontuações na nuvem
- ✅ **Inimigos Dinâmicos**: Inimigos que se movem aleatoriamente
- ✅ **Modo Difícil**: Mais fragmentos, menos energia, mais inimigos
- ✅ **Poder-ups**: Colete escudos para se proteger
- ✅ **Níveis Progressivos**: 3 níveis de dificuldade crescente
- ✅ **Sistema de Pontuação**: Ganhe pontos ao explorar

## 📊 Estrutura Firebase

### Coleção: `scores`
```
{
    userId: string,
    userName: string,
    score: number,
    difficulty: "normal" | "hard",
    level: number,
    timestamp: serverTimestamp()
}
```

### Coleção: `users`
```
{
    uid: string,
    displayName: string,
    email: string,
    photoURL: string
}
```

## 🔒 Segurança

- As credenciais Firebase são públicas (APIKey) - é normal!
- Apenas usuários autenticados podem salvar pontuações
- Regras Firestore garantem que apenas você pode acessar seus dados pessoais

## ⚠️ Troubleshooting

### "Erro ao conectar ao servidor"
- Verifique se a `apiKey` está correta em `app-firebase.js`
- Verifique se o projeto Firebase está ativo
- Certifique-se de que Authentication está habilitado

### "Firestore não definido"
- Verifique se o Firestore Database foi criado no console Firebase
- Aguarde alguns segundos para a criação completar

### Não consegue fazer login com Google
- Verifique se o domínio `localhost:8000` está autorizado em Firebase
- Vá em **Authentication** > **Settings** > **Authorized domains**
- Adicione `localhost` se necessário

## 🚀 Deploy Produção

Para fazer deploy:

1. Compile com Firebase Hosting:
   ```
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

2. Adicione seu domínio em **Authentication** > **Authorized domains**

## 📝 Arquivos

- `app-firebase.js` - Lógica do jogo com Firebase
- `firebase-config.js` - Configurações (será ignorado, edite direto em app-firebase.js)
- `index.html` - Interface do jogo
- `style.css` - Estilos CSS
- `README.md` - Este arquivo

## 🎓 Recursos Úteis

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Web SDK](https://firebase.google.com/docs/web/setup)
- [Firestore Security Rules](https://firebase.google.com/docs/firestore/security/start)

---

Divirta-se! 🎮✨

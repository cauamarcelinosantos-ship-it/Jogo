# Jogo

Jogo de exploração com cadastro e login persistidos em um banco IndexedDB local.

Depois de entrar, explore o mapa do Vale de Aurora, encontre os 3 fragmentos e
chegue ao portal. Cada movimento consome 1 ponto de energia e o progresso fica
salvo no navegador por usuário.

## Como executar

Abra `index.html` em um navegador ou sirva a pasta com um servidor local. Depois:

1. Clique em `Criar conta` e cadastre um e-mail e uma senha.
2. Entre com os dados cadastrados.
3. Marque `Lembrar de mim` para salvar a sessão no banco; desmarque para usar uma sessão temporária.
4. Use as setas do teclado ou os botões direcionais para explorar o mapa.

O banco `jogo-database` possui as tabelas `users` e `sessions` e fica armazenado no navegador do usuário.

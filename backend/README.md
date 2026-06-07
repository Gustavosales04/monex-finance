# Backend

API em Node.js/Express para cadastro, login e controle de despesas por usuario. O projeto usa SQL Server como banco de dados, JWT para autenticar rotas privadas e bcrypt para armazenar senhas com hash.

## Tecnologias

- Node.js com ES Modules
- Express
- SQL Server via `mssql`
- JWT
- bcrypt
- dotenv
- cors
- nodemon para desenvolvimento

## Estrutura

```text
.
|-- app.js
|-- package.json
|-- package-lock.json
|-- .env
|-- middlewares/
|   `-- auth.js
`-- routes/
    |-- connection.js
    |-- private.js
    `-- public.js
```

## Requisitos

- Node.js instalado
- SQL Server acessivel
- Banco de dados com as tabelas usadas pela API:
  - `Usuario`
  - `Categoria`
  - `Despesa`

## Configuracao

Crie um arquivo `.env` na raiz do backend com as variaveis abaixo:

```env
DB_USER=seu_usuario
DB_PASSWORD=sua_senha
DB_SERVER=seu_servidor
DB_DATABASE=seu_banco
DB_PORT=1433
JWT_SECRET=sua_chave_secreta
```

## Instalacao

```bash
npm install
```

Observacao: o codigo importa `jsonwebtoken`. Caso o projeto seja instalado em um ambiente novo e esse pacote nao esteja disponivel, instale-o com:

```bash
npm install jsonwebtoken
```

## Como executar

Modo desenvolvimento:

```bash
npm run dev
```

Modo normal:

```bash
npm start
```

Por padrao, o servidor sobe em:

```text
http://localhost:3000
```

## Rotas publicas

### `POST /cadastro`

Cadastra um novo usuario.

Corpo da requisicao:

```json
{
  "name": "Nome do Usuario",
  "email": "usuario@email.com",
  "password": "Senha@123"
}
```

Regras aplicadas:

- `name`, `email` e `password` sao obrigatorios.
- O e-mail precisa ter formato valido.
- O e-mail nao pode estar cadastrado.
- A senha precisa ter pelo menos 8 caracteres, letra minuscula, letra maiuscula, numero e caractere especial.
- A senha e salva com hash usando bcrypt.

### `POST /login`

Autentica um usuario e retorna um token JWT.

Corpo da requisicao:

```json
{
  "email": "usuario@email.com",
  "password": "Senha@123"
}
```

Resposta de sucesso:

```json
"token_jwt"
```

## Autenticacao

As rotas privadas usam o middleware `auth.js`. Envie o token JWT no header `Authorization`:

```http
Authorization: Bearer token_jwt
```

O token e validado com `JWT_SECRET`. Quando valido, o middleware adiciona o id do usuario em `req.userId`.

## Rotas privadas

Todas as rotas abaixo exigem autenticacao.

### `POST /criar-despesa`

Cria uma despesa para o usuario autenticado.

Corpo da requisicao:

```json
{
  "valor": 50.9,
  "data": "2026-03-18",
  "descricao": "Mercado",
  "categoriaid": 1
}
```

### `GET /listar-despesa`

Lista as despesas do usuario autenticado, juntando os dados da categoria.

Resposta esperada:

```json
[
  {
    "id": 1,
    "descricao": "Mercado",
    "categoria": "Alimentacao",
    "valor": 50.9,
    "data": "2026-03-18T00:00:00.000Z"
  }
]
```

### `POST /criar-categoria`

Cria uma categoria para o usuario autenticado.

Corpo da requisicao:

```json
{
  "name": "Alimentacao"
}
```

### `GET /listar-categoria`

Lista as categorias do usuario autenticado.

Resposta esperada:

```json
[
  {
    "id": 1,
    "Categoria": "Alimentacao"
  }
]
```

## Banco de dados

A conexao com o SQL Server fica em `routes/connection.js` e usa as variaveis `DB_USER`, `DB_PASSWORD`, `DB_SERVER`, `DB_DATABASE` e `DB_PORT`.

O codigo espera, pelo menos, os seguintes campos:

- `Usuario`: `Id`, `Nome`, `Email`, `Senha`
- `Categoria`: `Id`, `Nome`, `UsuarioId`
- `Despesa`: `Id`, `Valor`, `Data`, `Descricao`, `CategoriaId`, `UsuarioId`

## Scripts

```bash
npm start
```

Executa `node app.js`.

```bash
npm run dev
```

Executa `nodemon app.js`.

## Observacoes

- O endpoint raiz `/` nao possui resposta propria; ele apenas recebe as rotas configuradas.
- O projeto habilita CORS para permitir chamadas do frontend.
- As rotas de despesas e categorias sempre usam o usuario identificado pelo token.
- Nao ha script de testes configurado no `package.json`.

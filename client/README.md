# Lista de Convidados

## Tecnologias

- JavaScript
- React
- .NET
- PostgreSQL

## Configuracao local

### Frontend

Copie `client/.env.example` para `client/.env` e ajuste a URL da API se necessario.

```bash
cd client
npm install
npm run dev
```

### Backend

Copie `api/appsettings.Development.example.json` para `api/appsettings.Development.json` e ajuste a string de conexao do PostgreSQL.

```bash
cd api
dotnet restore
dotnet run
```

## GitHub

Arquivos de build, dependencias e configuracoes locais com segredos ficam fora do repositorio pelo `.gitignore`.

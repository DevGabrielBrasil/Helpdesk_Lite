# Helpdesk Lite

Projeto simples para cadastro e gerenciamento de tickets (Full-Stack).

## Tecnologias
- Backend: Node.js, NestJS, TypeScript, TypeORM
- Frontend: React + TypeScript (Vite)
- Estilização: TailwindCSS
- Banco: Postgres (ou sqlite para testes)
- Infra: Docker / Docker Compose

## Executando localmente (sem Docker)
### Backend
```bash
cd backend
npm install
# Crie um .env baseado em .env.example (opcional)
npm run start:dev
```
A API roda em `http://localhost:3000`.

### Frontend
```bash
cd frontend
npm install
npm run dev
```
A aplicação front roda em `http://localhost:5173` por padrão.

## Executando com Docker
```bash
docker-compose up --build
```
- Postgres: `localhost:5432`
- Backend: `http://localhost:3000`
- Frontend: `http://localhost:5173`

O backend possui uma variável `SEED_ADMIN` que, quando `true`, cria um usuário admin com as credenciais definidas em `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.

## Testes
No backend:
```bash
cd backend
npm install
npm run test        # unitários
npm run test:e2e    # e2e
```

Os testes E2E usam um banco sqlite em memória.

## Observações e decisões técnicas
- JWT secret e credenciais do banco são lidos de variáveis de ambiente.
- Para desenvolvimento rápido `synchronize: true` está ativado via `TYPEORM_SYNC`. Em produção, recomenda-se desativar e usar migrations.
- Optei por adicionar um `SEED_ADMIN` simples para facilitar validação manual. Para produção, remova ou proteja essa funcionalidade.

## Próximos passos recomendados
- Adicionar migrations TypeORM e scripts de deploy.
- Configurar CI para rodar testes e builds.
- Melhorar tratamento de erros centralizado (filters/interceptors).


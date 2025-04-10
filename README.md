<p align="center">
  <img src="effort_log/public/logo.png" alt="Effort Log Logo" width="150" />
</p>

# Effort Log

**O Intuito do Effort Log** é registrar seus treinos e marcar sua consistência, com os registros será possível ver sua evolução na progressão de cargas, revisitar treinos anteriores, ter realmente um logbook completo, e com o contador de streak terá a recompensa visual de sua consistência nos treinos, definindo sua meta semanal e a cumprindo.

## 📊 Tecnologias Utilizadas

### Backend (NestJS - `effort_log_api/`)

- **NestJS** + **Prisma ORM**
- Banco de dados **PostgreSQL**
- Autenticação com **JWT**
- Documentação de API com **Swagger**
- Gerenciamento de migrations com `prisma migrate`
- Docker para build e deploy

### Frontend (Next.js - `effort_log/`)

- **Next.js App Router**
- Autenticação com Context API
- Design responsivo e moderno
- Gerenciamento de estado com hooks
- Toast de feedbacks com **react-toastify**
- Componentização com modais interativos e animações

## 📆 Principais Funcionalidades

- Criação de treinos com nome, início e fim
- Adição de exercícios com tipo e séries
- Modais para editar, duplicar e excluir séries ou exercícios
- Cronômetro de duração de treino em tempo real
- Modal para finalização com cálculo de calorias queimadas
- Controle de **streak** semanal com objetivo personalizado
- UI com feedback visual, botões flutuantes e favicon customizado

---

## 🚀 Como Rodar Localmente

### Requisitos

- Node.js 20+
- Docker e Docker Compose
- Yarn (ou npm)

### 1. Clone o projeto

```bash
git clone https://github.com/seu-usuario/effort-log.git
cd effort-log
```

### 2. Configure os arquivos `.env`

#### Backend (`effort_log_api/.env`):

Copie a partir do `.env.example` e preencha:

```env
PORT=3366
JWT_SECRET=sua_chave
JWT_EXPIRES_IN=2h
DATABASE_URL=postgresql://postgres:sua_senha@db:5432/effort_log?schema=public
DOCKER_WAIT=true
```

#### Frontend (`effort_log/.env`):

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:3366
```

---

## 🏠 Rodando com Docker Compose

### Build e execução:

```bash
docker-compose up --build -d
```

### Acesso:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend (Swagger): [http://localhost:3366/api](http://localhost:3366/api)

---

## 🌐 Estrutura do Projeto

```bash
.
├── effort_log/               # Frontend Next.js
│   ├── Dockerfile
│   ├── .env
│   └── public/
│       ├── logo.png
│       └── favicon.ico
│   └── ...
├── effort_log_api/          # Backend NestJS
│   ├── Dockerfile
│   ├── prisma/
│   └── .env
├── docker-compose.yml
└── .env                   # variáveis do docker-compose (Postgres)
```

---

## ⚠️ Observações de Produção

- Certifique-se de usar variáveis `.env` seguras
- Substitua `NEXT_PUBLIC_API_BASE_URL` por seu domínio real
- Ative HTTPS e headers de segurança no servidor
- Use volumes persistentes para o banco de dados

---

## 🚫 Não comitar:

- Arquivos `.env`
- `node_modules`, `dist`, `.next`

Esses arquivos já estão listados no `.gitignore`

---

## 📚 Licença

Este projeto está sob a licença MIT. Veja o arquivo `LICENSE` para mais detalhes.

---

Feito com muito ☕️ para ajudar você a manter a consistência nos treinos!

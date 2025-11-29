# 🏛️ Thoth AI - SaaS de Treinamento e Chat com LLMs

![Status](https://img.shields.io/badge/Status-Concluído-success)
![Stack](https://img.shields.io/badge/Stack-Fullstack-blue)

Thoth AI é uma plataforma completa que permite usuários criarem, treinarem e conversarem com modelos de Inteligência Artificial personalizados usando seus próprios dados (RAG e Fine-Tuning). O sistema conta com arquitetura de microsserviços, pagamentos via Stripe e interface moderna.

## 📸 Funcionalidades Principais

### 🧠 Inteligência Artificial
- **RAG (Retrieval-Augmented Generation):** Chat inteligente que lê PDFs/TXTs do usuário e responde com base neles.
- **Fine-Tuning Assíncrono:** Módulo Python dedicado para processar treinamentos pesados em background sem travar a interface.
- **Gestão de Modelos:** Versionamento de modelos, ajuste de hiperparâmetros (Epochs, Learning Rate) e exportação (.GGUF).

### 💼 Negócio & SaaS
- **Sistema de Assinatura:** Integração completa com **Stripe** (Checkout).
- **Limites de Uso:** Controle de mensagens para usuários gratuitos vs. Pro.
- **Licenciamento:** Sistema de resgate de Keys (Chaves de Ativação) para planos manuais.
- **Dashboard:** Métricas de uso em tempo real.

### 🛡️ Segurança & UX
- **Autenticação:** JWT (JSON Web Tokens) com Middleware de proteção de rotas.
- **Feedback Visual:** Notificações elegantes (Toasts) e Loaders de estado.
- **Histórico:** Persistência completa de conversas e mensagens.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído sobre uma arquitetura robusta e escalável:

| Área | Tecnologias |
|------|-------------|
| **Frontend** | Next.js 14 (App Router), TypeScript, TailwindCSS, Axios, Sonner (Toasts), Lucide Icons |
| **Backend API** | Node.js, Express, Multer (File Upload), Stripe SDK |
| **Microserviço AI** | Python 3.10, FastAPI, Pandas, AsyncIO, Requests |
| **Banco de Dados** | PostgreSQL (Neon Tech), Prisma ORM |
| **AI Models** | Integração com Groq (Llama 3, Mistral) e OpenAI API |

---

## 🛠️ Instalação e Execução

Siga os passos abaixo para rodar o projeto localmente.

### Pré-requisitos
- Node.js v18+
- Python 3.10+
- PostgreSQL rodando

### 1. Configuração do Backend (Node)
```bash
cd backend
npm install
# Crie um arquivo .env com suas chaves (DATABASE_URL, JWT_SECRET, GROQ_API_KEY, STRIPE_SECRET_KEY)
npx prisma migrate dev
npm run dev

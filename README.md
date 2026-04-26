<div align="center">

<img src="https://img.shields.io/badge/%F0%9F%92%BB-DEV%20ORGANIZADO-10b981?style=for-the-badge&labelColor=0a0a0b" alt="DevOrganizado" height="45"/>

<br/>
<br/>

**Plataforma completa para devs organizarem suas tarefas, acompanharem progresso por stack e consultarem uma IA especializada em programação.**

<br/>

![Status](https://img.shields.io/badge/status-em%20produ%C3%A7%C3%A3o-10b981?style=flat-square)
![License](https://img.shields.io/badge/license-MIT-blue?style=flat-square)
![Deploy](https://img.shields.io/badge/deploy-Render-46E3B7?style=flat-square&logo=render&logoColor=white)

<br/>

---

### 🛠️ Tech Stack

<br/>

**Back-end**

<img src="https://img.shields.io/badge/Python-3776AB?style=for-the-badge&logo=python&logoColor=white&labelColor=3776AB" alt="Python" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/FastAPI-009688?style=for-the-badge&logo=fastapi&logoColor=white&labelColor=009688" alt="FastAPI" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/SQLAlchemy-D71F00?style=for-the-badge&logo=sqlalchemy&logoColor=white&labelColor=D71F00" alt="SQLAlchemy" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white&labelColor=4169E1" alt="PostgreSQL" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Pydantic-E92063?style=for-the-badge&logo=pydantic&logoColor=white&labelColor=E92063" alt="Pydantic" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Uvicorn-2E303E?style=for-the-badge&logo=gunicorn&logoColor=white&labelColor=2E303E" alt="Uvicorn" style="border-radius:12px"/>

<br/>
<br/>

**Front-end**

<img src="https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white&labelColor=E34F26" alt="HTML5" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white&labelColor=1572B6" alt="CSS3" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black&labelColor=F7DF1E" alt="JavaScript" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Google_Fonts-4285F4?style=for-the-badge&logo=googlefonts&logoColor=white&labelColor=4285F4" alt="Google Fonts" style="border-radius:12px"/>

<br/>
<br/>

**Integrações & Serviços**

<img src="https://img.shields.io/badge/Anthropic_Claude-191919?style=for-the-badge&logo=anthropic&logoColor=white&labelColor=191919" alt="Claude AI" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Mercado_Pago-00B1EA?style=for-the-badge&logo=mercadopago&logoColor=white&labelColor=00B1EA" alt="Mercado Pago" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white&labelColor=000000" alt="JWT" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Bcrypt-003A70?style=for-the-badge&logo=letsencrypt&logoColor=white&labelColor=003A70" alt="Bcrypt" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/SMTP_Email-EA4335?style=for-the-badge&logo=gmail&logoColor=white&labelColor=EA4335" alt="SMTP" style="border-radius:12px"/>

<br/>
<br/>

**Deploy & Infra**

<img src="https://img.shields.io/badge/Render-46E3B7?style=for-the-badge&logo=render&logoColor=white&labelColor=46E3B7" alt="Render" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white&labelColor=F05032" alt="Git" style="border-radius:12px"/>
<img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white&labelColor=181717" alt="GitHub" style="border-radius:12px"/>

---

</div>

<br/>

## Funcionalidades

| Recurso | Descrição |
|---------|-----------|
| **Kanban Board** | Gerencie tarefas com drag & drop em colunas To-Do, Doing e Done |
| **Stacks Tracker** | Selecione suas tecnologias e acompanhe progresso por stack |
| **IA DEV** | Chat com IA especializada em programação (powered by Claude) |
| **Bloco de Notas** | Anotações rápidas com persistência local |
| **Dashboard** | Estatísticas e métricas de produtividade em tempo real |
| **Pagamento PIX** | Integração Mercado Pago para desbloquear a IA DEV |
| **Auth Completo** | Registro, login, recuperação de senha via email |
| **Painel Admin** | Gerenciamento de usuários e pagamentos |
| **Dark/Light Mode** | Alternância de tema com persistência |
| **100% Responsivo** | Design adaptável para mobile, tablet e desktop |

<br/>

## Arquitetura

```
dev-organizado/
├── backend/
│   ├── main.py            # Rotas da API (FastAPI)
│   ├── models.py          # Modelos SQLAlchemy (User, Task, Payment)
│   ├── schemas.py         # Schemas Pydantic (validação)
│   ├── auth.py            # JWT + Bcrypt (autenticação)
│   ├── database.py        # Engine PostgreSQL + Session
│   └── requirements.txt   # Dependências Python
│
└── frontend/
    ├── index.html         # App principal (SPA)
    ├── login.html         # Tela de login/registro
    ├── admin.html         # Painel administrativo
    ├── script.js          # Lógica do app (vanilla JS)
    └── style.css          # Design system completo
```

<br/>

## Quick Start

### Pré-requisitos

- Python 3.11+
- PostgreSQL 15+
- Git

### Backend

```bash
# Clone o repositório
git clone https://github.com/seu-usuario/dev-organizado.git
cd dev-organizado/backend

# Crie o ambiente virtual
python -m venv venv
source venv/bin/activate  # Linux/Mac
# venv\Scripts\activate   # Windows

# Instale as dependências
pip install -r requirements.txt

# Configure as variáveis de ambiente
cat > .env << EOF
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/dev_organizado
SECRET_KEY=sua-chave-secreta-aqui
ANTHROPIC_API_KEY=sk-ant-...
MP_ACCESS_TOKEN=APP_USR-...
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=seu-email@gmail.com
SMTP_PASS=sua-app-password
ALLOWED_ORIGINS=http://localhost:5500,http://127.0.0.1:5500
EOF

# Inicie o servidor
uvicorn main:app --reload --port 8000
```

### Frontend

```bash
# Sirva os arquivos estáticos (qualquer server HTTP)
cd frontend
python -m http.server 5500
# ou use a extensão Live Server do VS Code
```

Acesse `http://localhost:5500` no navegador.

<br/>

## Variáveis de Ambiente

| Variável | Descrição | Obrigatória |
|----------|-----------|:-----------:|
| `DATABASE_URL` | Connection string do PostgreSQL | Sim |
| `SECRET_KEY` | Chave para assinar tokens JWT | Sim |
| `ANTHROPIC_API_KEY` | API key da Anthropic (Claude) | Sim |
| `MP_ACCESS_TOKEN` | Token do Mercado Pago | Sim |
| `SMTP_HOST` | Servidor SMTP | Sim |
| `SMTP_PORT` | Porta SMTP | Sim |
| `SMTP_USER` | Email do remetente | Sim |
| `SMTP_PASS` | Senha/app password do email | Sim |
| `ALLOWED_ORIGINS` | Origens permitidas (CORS) | Não |

<br/>

## API Endpoints

```
POST   /api/register          # Criar conta
POST   /api/login             # Autenticar
POST   /api/forgot-password   # Solicitar reset de senha
POST   /api/reset-password    # Redefinir senha
GET    /api/me                # Dados do usuário logado

GET    /api/tasks             # Listar tarefas
POST   /api/tasks             # Criar tarefa
PUT    /api/tasks/{id}        # Atualizar tarefa
DELETE /api/tasks/{id}        # Deletar tarefa

POST   /api/chat              # Chat com IA DEV
POST   /api/payments/pix      # Gerar pagamento PIX
GET    /api/payments/status/{id}  # Status do pagamento

GET    /api/admin/users       # [Admin] Listar usuários
```

<br/>

<div align="center">

---

Feito com `<code/>` e ☕ por **Matheus**

</div>

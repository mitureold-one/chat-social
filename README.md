# 💬 Chat Social

> Mini rede social com chat ao vivo, grupos e feed de posts.
> Deploy: https://chat-social-two.vercel.app/

---

## 📸 Visão Geral

A aplicação combina funcionalidades de **chat em tempo real** com uma **mini rede social**, permitindo que usuários se comuniquem em grupos, troquem mensagens privadas e publiquem posts em um feed compartilhado.

---

## ✨ Funcionalidades

### 💬 Chat & Grupos
- Criação de grupos **públicos** e **privados** (com senha)
- Listagem de todos os grupos existentes
- Chat em tempo real dentro dos grupos
- Admin pode **excluir** o grupo
- Membros podem **sair** a qualquer momento

### 📩 Mensagens Privadas
- Conversa 1:1 entre usuários em tempo real
- Busca de usuários por nome ou @username

### 📰 Feed (Mini Rede Social)
- Publicação de posts com limite de 280 caracteres
- Curtir e descurtir posts
- Deletar próprio post
- Feed atualizado em tempo real

### 👤 Perfil
- Foto de perfil com upload direto
- Bio editável
- Contagem de posts
- Visualizar perfil de outros usuários (`/users/[id]`)

### 🔐 Autenticação
- Cadastro e login com e-mail e senha
- Perfil criado automaticamente no cadastro
- Sessão persistente via cookies
- **Middleware de autenticação** no servidor — redireciona para login se não houver sessão ativa

---

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| [Next.js 16](https://nextjs.org/) | Framework React com App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização utilitária |
| [Supabase](https://supabase.com/) | Auth, banco de dados, realtime e storage |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional (via Supabase) |

---

## 🧩 Componentes shadcn/ui

O projeto utiliza o [shadcn/ui](https://ui.shadcn.com/) como biblioteca de componentes.

| Componente | Onde é usado |
|---|---|
| `Button` | Ações em geral (enviar, entrar, criar, sair) |
| `Input` | Campos de texto e busca |
| `Card` | Telas de login e cadastro |
| `Avatar` | Foto de perfil em todo o app |
| `Badge` | Indicadores de grupo privado/público |
| `ScrollArea` | Área de mensagens com scroll controlado |
| `Separator` | Divisores visuais nos chats |

---

## 🏗️ Arquitetura — MVVM

O projeto segue o padrão **MVVM (Model-View-ViewModel)** com separação clara de responsabilidades:

| Camada | Onde fica | Responsabilidade |
|---|---|---|
| **View** | `app/_components/` | Renderiza a UI, recebe dados via props |
| **ViewModel** | `app/hooks/` | Estado, lógica e chamadas ao banco |
| **Model** | `app/lib/types.ts` + `app/lib/services/` | Tipos centrais e acesso ao Supabase |

Cada página tem um **hook dedicado** (`useFeedPage`, `useGroupChatPage`, etc.) mantendo os `page.tsx` enxutos. Consulte [`ARCHITECTURE.md`](./ARCHITECTURE.md) para a documentação completa.

---

## 🗄️ Modelagem do Banco de Dados

```
profiles          — extensão do auth.users (username, bio, avatar_url)
posts             — posts do feed (content, user_id)
likes             — curtidas nos posts (post_id, user_id)
groups            — grupos de chat (name, is_private, password_hash)
group_members     — membros de cada grupo
group_messages    — mensagens em tempo real dos grupos
direct_messages   — mensagens privadas 1:1
```

Todas as tabelas utilizam **Row Level Security (RLS)**.

---

## 📁 Estrutura de Pastas

```
chat-social/
├── middleware.ts              # Proteção de rotas no servidor
└── app/
    ├── not-found.tsx          # Página 404 global
    ├── (app)/                 # Rotas protegidas (feed, grupos, mensagens, perfil)
    ├── auth/                  # Rotas públicas (login, registro)
    ├── context/               # AppProvider — supabase, user, profile globais
    ├── hooks/                 # ViewModels — um hook por página
    ├── _components/           # Componentes organizados por domínio
    │   └── ui/skeletons.tsx   # Skeletons de carregamento por tela
    └── lib/
        ├── types.ts           # Tipos centrais de domínio
        ├── supabase/          # Clientes browser e server
        └── services/          # Acesso ao banco de dados
```

---

## 📱 Responsividade

A aplicação é **mobile first**, com dois modos de navegação:

- **Mobile** → barra de navegação fixada na parte inferior da tela
- **Desktop** → sidebar lateral com ícones e labels

---

## 🚀 Como rodar localmente

```bash
# Clone o repositório
git clone git@github.com:ludslvaz/chat-social.git
cd chat-social

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves do Supabase

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

## 🔑 Variáveis de Ambiente

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

> **Nunca versione o `.env.local`.** Use `.env.example` como referência.

---

## 👩‍💻 Desenvolvido por

**Ludmilla Silva Vaz**
Engenharia de Software — 5º Período
Disciplina: Programação para Web

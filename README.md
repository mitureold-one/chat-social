# 💬 Chat Social

> Mini rede social com chat ao vivo, grupos e feed de posts — desenvolvida como projeto final da disciplina de **Programação para Web**.

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
- Edição de nome e bio

### 🔐 Autenticação
- Cadastro e login com e-mail e senha
- Perfil criado automaticamente no cadastro
- Sessão persistente via cookies

---

## 🛠️ Stack Tecnológica

| Tecnologia | Uso |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework React com App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estática |
| [Tailwind CSS](https://tailwindcss.com/) | Estilização utilitária |
| [Supabase](https://supabase.com/) | Auth, banco de dados, realtime e storage |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional (via Supabase) |

---

## 🧩 Componentes shadcn/ui

O projeto utiliza o [shadcn/ui](https://ui.shadcn.com/) como biblioteca de componentes, com o preset **Nova** e paleta **Neutral** — seguindo o design system preto e branco do shadcn.com.

| Componente | Onde é usado |
|---|---|
| `Button` | Ações em geral (enviar, entrar, criar, sair) |
| `Input` | Campos de texto e busca |
| `Card` | Telas de login e cadastro |
| `Avatar` + `AvatarImage` + `AvatarFallback` | Foto de perfil em todo o app |
| `Badge` | Indicadores de grupo privado/público e "Ao vivo" |
| `ScrollArea` | Área de mensagens com scroll controlado |
| `Separator` | Divisores visuais nos chats |

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

Todas as tabelas utilizam **Row Level Security (RLS)** para garantir que cada usuário só acesse o que tem permissão.

---

## ⚡ Tempo Real

O Supabase Realtime é usado em três contextos:

- **Chat dos grupos** — novas mensagens aparecem instantaneamente
- **Mensagens privadas** — conversa 1:1 ao vivo
- **Feed** — novos posts aparecem sem recarregar a página

---

## 📁 Estrutura de Pastas

```
src/
├── app/
│   ├── (auth)/
│   │   ├── login/          → Tela de login
│   │   └── register/       → Tela de cadastro
│   └── (app)/
│       ├── feed/           → Feed de posts
│       ├── groups/         → Lista de grupos
│       │   ├── new/        → Criar grupo
│       │   └── [id]/       → Chat do grupo
│       ├── messages/       → Lista de usuários
│       │   └── [userId]/   → Mensagem privada
│       └── profile/        → Perfil do usuário
├── components/
│   ├── feed/
│   │   └── PostCard.tsx    → Card de post com curtida
│   ├── layout/
│   │   └── Sidebar.tsx     → Navegação lateral/inferior
│   ├── profile/
│   │   └── AvatarUpload.tsx → Upload de foto de perfil
│   └── ui/                 → Componentes shadcn/ui
└── lib/
    └── supabase/
        ├── client.ts       → Cliente browser
        └── server.ts       → Cliente servidor
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
git clone https://github.com/SEU_USUARIO/chat-social.git
cd chat-social

# Instale as dependências
npm install

# Configure as variáveis de ambiente
cp .env.example .env.local
# Preencha com suas chaves do Supabase

# Rode o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

---

## 🔑 Variáveis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## 👩‍💻 Desenvolvido por

**Ludmilla Silva Vaz**  
Engenharia de Software — 5º Período  
Disciplina: Programação para Web
link deploy: https://chat-social-two.vercel.app/
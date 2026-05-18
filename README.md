# ðŸ’¬ Chat Social

> Mini rede social com chat ao vivo, grupos e feed de posts.
> Deploy Link: https://chat-social-main-mitureold-ones-projects.vercel.app
---

## ðŸ“¸ VisÃ£o Geral

A aplicaÃ§Ã£o combina funcionalidades de **chat em tempo real** com uma **mini rede social**, permitindo que usuÃ¡rios se comuniquem em grupos, troquem mensagens privadas e publiquem posts em um feed compartilhado.

---

## âœ¨ Funcionalidades

### ðŸ’¬ Chat & Grupos
- CriaÃ§Ã£o de grupos **pÃºblicos** e **privados** (com senha)
- Listagem de todos os grupos existentes
- Chat em tempo real dentro dos grupos
- Admin pode **excluir** o grupo
- Membros podem **sair** a qualquer momento

### ðŸ“© Mensagens Privadas
- Conversa 1:1 entre usuÃ¡rios em tempo real
- Busca de usuÃ¡rios por nome ou @username

### ðŸ“° Feed (Mini Rede Social)
- PublicaÃ§Ã£o de posts com limite de 280 caracteres
- Curtir e descurtir posts
- Deletar prÃ³prio post
- Feed atualizado em tempo real

### ðŸ‘¤ Perfil
- Foto de perfil com upload direto
- Bio editÃ¡vel
- Contagem de posts
- Visualizar perfil de outros usuÃ¡rios (`/users/[id]`)

### ðŸ” AutenticaÃ§Ã£o
- Cadastro e login com e-mail e senha
- Perfil criado automaticamente no cadastro
- SessÃ£o persistente via cookies
- **Middleware de autenticaÃ§Ã£o** no servidor â€” redireciona para login se nÃ£o houver sessÃ£o ativa

---

## ðŸ› ï¸ Stack TecnolÃ³gica

| Tecnologia | Uso |
|---|---|
| [Next.js 15](https://nextjs.org/) | Framework React com App Router |
| [TypeScript](https://www.typescriptlang.org/) | Tipagem estÃ¡tica |
| [Tailwind CSS](https://tailwindcss.com/) | EstilizaÃ§Ã£o utilitÃ¡ria |
| [Supabase](https://supabase.com/) | Auth, banco de dados, realtime e storage |
| [PostgreSQL](https://www.postgresql.org/) | Banco de dados relacional (via Supabase) |

---

## ðŸ§© Componentes shadcn/ui

O projeto utiliza o [shadcn/ui](https://ui.shadcn.com/) como biblioteca de componentes, com o preset **Nova** e paleta **Neutral** â€” seguindo o design system preto e branco do shadcn.com.

| Componente | Onde Ã© usado |
|---|---|
| `Button` | AÃ§Ãµes em geral (enviar, entrar, criar, sair) |
| `Input` | Campos de texto e busca |
| `Card` | Telas de login e cadastro |
| `Avatar` + `AvatarImage` + `AvatarFallback` | Foto de perfil em todo o app |
| `Badge` | Indicadores de grupo privado/pÃºblico |
| `ScrollArea` | Ãrea de mensagens com scroll controlado |
| `Separator` | Divisores visuais nos chats |

---

## ðŸ—ï¸ Arquitetura â€” MVVM

O projeto segue o padrÃ£o **MVVM (Model-View-ViewModel)** com separaÃ§Ã£o clara de responsabilidades:

| Camada | Onde fica | Responsabilidade |
|---|---|---|
| **View** | `app/_components/` | Renderiza a UI, recebe dados via props |
| **ViewModel** | `app/hooks/` | Estado, lÃ³gica e chamadas ao banco |
| **Model** | `app/lib/types.ts` + `app/lib/services/` | Tipos centrais e acesso ao Supabase |

Cada pÃ¡gina tem um **hook dedicado** (`useFeedPage`, `useGroupChatPage`, etc.) mantendo os `page.tsx` enxutos â€” com cerca de 20 linhas cada, apenas conectando View e ViewModel.

---

## ðŸŒ Contexto Global â€” AppProvider

Um contexto global (`app/context/AppProvider.tsx`) centraliza o cliente Supabase e o usuÃ¡rio logado. Todos os componentes consomem via `useApp()`, evitando mÃºltiplas instÃ¢ncias do cliente espalhadas pelo cÃ³digo.

---

## ðŸ›¡ï¸ Middleware de AutenticaÃ§Ã£o

Um `middleware.ts` na raiz intercepta todas as requisiÃ§Ãµes no servidor antes de qualquer pÃ¡gina carregar. Ele verifica a sessÃ£o via `@supabase/ssr` e redireciona automaticamente para `/auth/login` caso o usuÃ¡rio nÃ£o esteja autenticado â€” garantindo proteÃ§Ã£o real no servidor, nÃ£o apenas no client.

---

## ðŸ—„ï¸ Modelagem do Banco de Dados

```
profiles          â€” extensÃ£o do auth.users (username, bio, avatar_url)
posts             â€” posts do feed (content, user_id)
likes             â€” curtidas nos posts (post_id, user_id)
groups            â€” grupos de chat (name, is_private, password_hash)
group_members     â€” membros de cada grupo
group_messages    â€” mensagens em tempo real dos grupos
direct_messages   â€” mensagens privadas 1:1
```

Todas as tabelas utilizam **Row Level Security (RLS)** â€” as regras de acesso ficam diretamente no banco, substituindo controllers e middlewares manuais.

---

## âš¡ Tempo Real

O Supabase Realtime Ã© usado em trÃªs contextos via padrÃ£o **Observer**:

- **Chat dos grupos** â€” novas mensagens aparecem instantaneamente
- **Mensagens privadas** â€” conversa 1:1 ao vivo
- **Feed** â€” novos posts aparecem sem recarregar a pÃ¡gina

---

## ðŸ“ Estrutura de Pastas

```
app/
â”œâ”€â”€ _components/         â†’ Componentes organizados por domÃ­nio
â”‚   â”œâ”€â”€ feed/            â†’ PostCard e Ã¡rea de criaÃ§Ã£o de post
â”‚   â”œâ”€â”€ groups/          â†’ Componentes de grupos e chat
â”‚   â”œâ”€â”€ messages/        â†’ Componentes de mensagens privadas
â”‚   â””â”€â”€ profile/         â†’ AvatarUpload e card de perfil
â”œâ”€â”€ context/
â”‚   â””â”€â”€ AppProvider.tsx  â†’ Contexto global (Supabase + usuÃ¡rio)
â”œâ”€â”€ hooks/               â†’ ViewModels: useFeedPage, useGroupChatPage...
â”œâ”€â”€ lib/
â”‚   â”œâ”€â”€ types.ts         â†’ Tipos centrais do domÃ­nio
â”‚   â””â”€â”€ services/        â†’ FunÃ§Ãµes de acesso ao Supabase por domÃ­nio
â”œâ”€â”€ auth/
â”‚   â”œâ”€â”€ login/           â†’ Tela de login
â”‚   â””â”€â”€ register/        â†’ Tela de cadastro
â”œâ”€â”€ feed/                â†’ Feed de posts
â”œâ”€â”€ groups/              â†’ Lista de grupos e chat
â”œâ”€â”€ messages/            â†’ Mensagens privadas
â”œâ”€â”€ profile/             â†’ Perfil do usuÃ¡rio logado
â””â”€â”€ users/[id]/          â†’ Perfil pÃºblico de outros usuÃ¡rios
middleware.ts            â†’ ProteÃ§Ã£o de rotas no servidor
```

---

## ðŸ“± Responsividade

A aplicaÃ§Ã£o Ã© **mobile first**, com dois modos de navegaÃ§Ã£o:

- **Mobile** â†’ barra de navegaÃ§Ã£o fixada na parte inferior da tela
- **Desktop** â†’ sidebar lateral com Ã­cones e labels

---

## ðŸš€ Como rodar localmente

```bash
# Clone o repositÃ³rio
git clone https://github.com/ludslvaz/chat-social.git
cd chat-social

# Instale as dependÃªncias
npm install

# Configure as variÃ¡veis de ambiente
# Crie um arquivo .env.local na raiz com as chaves do Supabase
npm run dev
```

Acesse `http://localhost:3000`

---

## ðŸ”‘ VariÃ¡veis de Ambiente

Crie um arquivo `.env.local` na raiz do projeto:

```env
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_anon_key_aqui
```

---

## ðŸ‘©â€ðŸ’» Desenvolvido por

**Ludmilla Silva Vaz**  
Engenharia de Software â€” 5Âº PerÃ­odo  
Disciplina: ProgramaÃ§Ã£o para Web



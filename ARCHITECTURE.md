# Arquitetura — Chat Social

## Visão Geral

Chat Social é uma rede social com feed de posts, mensagens diretas e grupos com chat em tempo real. Construída com **Next.js 16**, **Supabase** e **TypeScript**, seguindo o padrão arquitetural **MVVM (Model-View-ViewModel)** adaptado para React.

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Turbopack) |
| Backend / Banco | Supabase (PostgreSQL + Auth + Storage + Realtime) |
| Linguagem | TypeScript 5 |
| Estilização | Tailwind CSS 4 |
| Componentes UI | shadcn/ui + Radix UI |
| Ícones | Lucide React |

---

## Padrão Arquitetural — MVVM

O projeto separa responsabilidades em três camadas bem definidas:

```
View        →  _components/          (UI pura, sem lógica)
ViewModel   →  hooks/                (estado + lógica de cada página)
Model       →  lib/types.ts          (contratos de dados)
             + lib/services/         (acesso ao Supabase)
             + lib/supabase/         (clientes centralizados)
```

### View (componentes)
Componentes presentacionais que recebem dados e callbacks via props. Não conhecem Supabase, auth ou regras de negócio.

```tsx
// Exemplo: FeedComposer só sabe renderizar e disparar eventos
export function FeedComposer({ content, posting, onPost, ... }: FeedComposerProps) {
  return <div>...</div>
}
```

### ViewModel (hooks)
Um hook por página. Encapsula todo o estado local, efeitos colaterais e handlers. A page faz a cola entre ViewModel e View.

```tsx
// feed/page.tsx — orquestra ViewModel → View
const feed = useFeedPage()
if (feed.pageLoading) return <FeedSkeleton />
return <FeedComposer content={feed.content} onPost={feed.handlePost} ... />
```

### Model (serviços + tipos)
Funções puras que recebem o cliente Supabase e executam uma operação. Centralizadas, reutilizáveis e testáveis independentemente.

```ts
// Exemplo: fetchPosts é agnóstico a qualquer componente ou hook
export async function fetchPosts(supabase: SupabaseClient): Promise<Post[]> { ... }
```

---

## Estrutura de Pastas

```
chat-social/
├── middleware.ts                  # Proteção de rotas (auth via @supabase/ssr)
│
└── app/
    ├── layout.tsx                 # Root layout — monta AppProvider global
    ├── page.tsx                   # Redireciona / → /feed
    ├── not-found.tsx              # Página 404 global
    │
    ├── (app)/                     # Grupo de rotas protegidas
    │   ├── layout.tsx             # Layout com Sidebar
    │   ├── feed/page.tsx
    │   ├── groups/
    │   │   ├── page.tsx
    │   │   ├── new/page.tsx
    │   │   └── [id]/page.tsx
    │   ├── messages/
    │   │   ├── page.tsx
    │   │   └── [userId]/page.tsx
    │   ├── profile/page.tsx
    │   └── users/[id]/page.tsx
    │
    ├── auth/                      # Rotas públicas
    │   ├── login/page.tsx
    │   └── register/page.tsx
    │
    ├── context/
    │   └── AppProvider.tsx        # Contexto global: supabase, user, profile, loading
    │
    ├── hooks/                     # ViewModels — um por página
    │   ├── useAuth.ts
    │   ├── useFeedPage.ts
    │   ├── useProfilePage.ts
    │   ├── useGroupsPage.ts
    │   ├── useGroupChatPage.ts
    │   ├── useNewGroupPage.ts
    │   ├── useMessagesPage.ts
    │   └── useDirectMessagePage.ts
    │
    ├── _components/               # Views — organizadas por domínio
    │   ├── auth/
    │   ├── feed/
    │   ├── groups/
    │   ├── layout/
    │   ├── messages/
    │   ├── profile/
    │   ├── users/
    │   └── ui/
    │       ├── skeletons.tsx      # Skeletons de carregamento por tela
    │       └── ...                # Primitivos shadcn/ui
    │
    └── lib/
        ├── types.ts               # Contratos de dados centrais
        ├── utils.ts
        ├── supabase/
        │   ├── client.ts          # Browser client (@supabase/ssr)
        │   └── server.ts          # Server client (cookies)
        └── services/              # Camada de acesso a dados
            ├── posts.service.ts
            ├── profiles.service.ts
            ├── groups.service.ts
            └── messages.service.ts
```

---

## Fluxo de Dados e Loading

O loading é gerenciado em dois níveis para evitar race conditions:

```
Browser abre a página
  │
  ├── AppProvider inicializa (authLoading = true)
  │     ├── busca usuário logado
  │     ├── busca perfil no banco
  │     └── seta authLoading = false
  │
  ├── Hook da página observa [authLoading, user]
  │     ├── se authLoading = true → para e espera
  │     ├── se user = null → redireciona para /auth/login
  │     └── se user existe → busca dados da página (pageLoading = true)
  │
  ├── Page checa pageLoading
  │     ├── true  → renderiza o Skeleton correspondente
  │     └── false → renderiza o conteúdo real
  │
  └── Dados chegam → pageLoading = false → conteúdo aparece
```

O `pageLoading` exposto pelos hooks é sempre `authLoading || pageLoading` interno, então a page só precisa checar uma única flag.

---

## Autenticação

A autenticação tem dois pontos de controle:

**1. Middleware (servidor)** — `middleware.ts`
Roda antes de qualquer renderização. Usa `createServerClient` do `@supabase/ssr` para ler os cookies da sessão e redirecionar para `/auth/login` se não houver usuário.

**2. AppProvider (cliente)** — `context/AppProvider.tsx`
Mantém `user`, `profile` e `loading` disponíveis globalmente via Context API. Escuta `onAuthStateChange` para reagir a login/logout em tempo real.

```
Requisição
  → middleware.ts         (bloqueia se sem sessão)
  → AppProvider           (disponibiliza user + profile + loading via context)
  → useXxxPage()          (espera loading = false antes de executar)
```

---

## Realtime

O Supabase Realtime é usado em três contextos via `postgres_changes`:

| Canal | Evento | Onde |
|---|---|---|
| `public:posts` | INSERT | `useFeedPage` — atualiza feed automaticamente |
| `group:{id}` | INSERT | `useGroupChatPage` — novas mensagens de grupo |
| `dm:{userA}-{userB}` | INSERT | `useDirectMessagePage` — novas mensagens diretas |

Os canais só são criados após `authLoading = false` e `user` disponível, evitando subscrições com estado inválido.

> **Capacidade estimada:** o plano Free do Supabase suporta ~200 conexões simultâneas. Como cada usuário abre até 3 canais, o limite prático é ~65 usuários simultâneos no plano Free.

---

## Skeletons

Cada tela tem um skeleton dedicado em `app/_components/ui/skeletons.tsx` que replica o layout visual da tela real usando `div`s animadas com `animate-pulse` do Tailwind.

| Skeleton | Usado em |
|---|---|
| `FeedSkeleton` | `/feed` |
| `GroupListSkeleton` | `/groups` |
| `ChatSkeleton` | `/groups/[id]` e `/messages/[userId]` |
| `MessageListSkeleton` | `/messages` |
| `ProfileSkeleton` | `/profile` |
| `PostCardSkeleton` | Reutilizável dentro de `FeedSkeleton` e `ProfileSkeleton` |

---

## Serviços

Cada arquivo de serviço agrupa operações de um domínio. Todos recebem `SupabaseClient` como primeiro argumento (injeção de dependência) e retornam dados tipados ou lançam erro.

| Arquivo | Responsabilidades |
|---|---|
| `posts.service.ts` | `fetchPosts`, `fetchUserPosts`, `createPost`, `deletePost`, `addLike`, `removeLike` |
| `profiles.service.ts` | `fetchProfile`, `fetchAllProfiles`, `updateProfile` |
| `groups.service.ts` | `fetchGroups`, `fetchGroup`, `createGroup`, `deleteGroup`, `checkMembership`, `joinGroup`, `leaveGroup`, `fetchGroupMessages`, `sendGroupMessage` |
| `messages.service.ts` | `fetchDirectMessages`, `sendDirectMessage`, `fetchUsers` |

---

## Tipos Centrais

Todos os tipos de domínio vivem em `lib/types.ts`. Nenhum componente ou hook deve redefinir tipos localmente.

```ts
Profile        // usuário do sistema
Post           // post do feed (inclui profiles? e likes?)
Group          // grupo de chat
GroupMessage   // mensagem em grupo
DirectMessage  // mensagem direta
```

---

## Variáveis de Ambiente

Crie um `.env.local` na raiz do projeto (nunca versionar):

```bash
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
```

Um `.env.example` com as chaves sem valores deve ser versionado para referência.

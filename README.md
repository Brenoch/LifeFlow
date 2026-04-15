# LifeFlow

LifeFlow é um app mobile-first para acompanhar rotina, estudos e treinos, feito com Next.js, React, Tailwind CSS e uma camada de dados pronta para Firebase.

O app funciona imediatamente em modo demo local, com persistência em `localStorage`. Ao adicionar as variáveis de ambiente do Firebase, a autenticação e a persistência passam a usar Firebase Auth e Firestore.

## Funcionalidades

- Login e cadastro com email/senha
- Login com Google opcional quando o Firebase estiver configurado
- Rastreador de rotina diária com estados feito e não feito
- Calendário com dias completos, parciais, perdidos e de descanso
- Sequência, XP, níveis e conquistas
- CRUD de tópicos de estudo com sugestões adaptativas de repetição espaçada
- Timer Pomodoro vinculado aos tópicos de estudo
- Análises semanais de progresso, minutos de estudo e treinos
- Interface dark mobile-first com navegação inferior

## Stack

- Next.js App Router
- React Context para estado
- Tailwind CSS
- Firebase Auth e Firestore
- Persistência local como fallback para demo

## Estrutura de Pastas

```text
src/
  app/
    (main)/
      calendario/
      estudos/
      pomodoro/
      perfil/
      layout.tsx
      page.tsx
    cadastro/
    entrar/
    globals.css
    layout.tsx
  components/
    auth/
    calendar/
    dashboard/
    layout/
    pomodoro/
    profile/
    study/
    ui/
  context/
    lifeflow-provider.tsx
  hooks/
    use-lifeflow.ts
  lib/
    date.ts
    default-data.ts
    firebase.ts
    local-store.ts
    smart-logic.ts
    types.ts
```

## Configuração

Instale as dependências:

```bash
npm install
```

Rode o servidor de desenvolvimento na porta `3001`, para evitar conflito com outros projetos usando `3000`:

```bash
npm run dev:3001
```

Abra:

```text
http://localhost:3001
```

Build de produção:

```bash
npm run build
```

Verificação de lint:

```bash
npm run lint
```

## Configuração do Firebase

Crie um arquivo `.env.local` na raiz do projeto:

```bash
NEXT_PUBLIC_FIREBASE_API_KEY=
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=
NEXT_PUBLIC_FIREBASE_PROJECT_ID=
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=
NEXT_PUBLIC_FIREBASE_APP_ID=
```

No Firebase Console:

1. Ative autenticação por Email/Password.
2. Ative autenticação por Google se quiser usar login com Google.
3. Crie um banco Firestore.
4. Publique as regras de `firebase/firestore.rules`.
5. Em Authentication > Settings > Authorized domains, adicione `localhost` e `brenoch.github.io`.
6. Copie os dados de configuração do app web para o `.env.local`.

## Coleções do Firestore

O LifeFlow grava nas seguintes coleções:

- `users`
- `routine_items`
- `activities`
- `study_topics`
- `pomodoro_sessions`

Os schemas pedidos para `activities`, `study_topics` e `pomodoro_sessions` estão contemplados. A coleção `routine_items` guarda o plano semanal que gera os logs diários de atividade.

## Notas do MVP

- O modo demo aceita qualquer email/senha e salva os dados no navegador.
- As regras de XP usam `+10` para rotinas de treino e `+15` para rotinas de estudo ou Pomodoros concluídos.
- Os níveis são calculados a partir do XP, com um nível novo a cada 100 XP.
- A sequência conta dias agendados consecutivos em que todos os itens foram concluídos. O dia atual não quebra a sequência até que um dia agendado passado seja perdido.
- As sugestões de estudo priorizam tópicos por última data estudada, dificuldade, tempo estimado e volume recente de estudo.

## Caminho para Android

A interface é mobile-first e pode ser empacotada depois com Capacitor ou outro shell Android baseado em WebView. O MVP atual mantém o app web limpo antes de adicionar empacotamento nativo.

## GitHub Pages

O projeto já vem preparado para publicar no GitHub Pages com export estático.

1. Crie um repositório no GitHub e envie o código para `main`.
2. Ative GitHub Pages com fonte `Deploy from a branch`.
3. Escolha a branch `gh-pages` e a pasta `/(root)`.
4. O workflow usa a base do repositório como caminho, então o site sai em algo como `https://seu-usuario.github.io/nome-do-repositorio/`.
5. As rotas em português continuam funcionando no Pages, como `/entrar/`, `/cadastro/`, `/calendario/`, `/estudos/` e `/perfil/`.

### Firebase no GitHub Pages

Para usar a mesma conta em outros dispositivos, o build do GitHub Pages precisa receber as variáveis públicas do Firebase. No GitHub, vá em `Settings > Secrets and variables > Actions > Variables` e crie:

```text
NEXT_PUBLIC_FIREBASE_API_KEY
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN
NEXT_PUBLIC_FIREBASE_PROJECT_ID
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID
NEXT_PUBLIC_FIREBASE_APP_ID
```

Depois faça um novo push para `main`. O workflow vai gerar o site com Firebase Auth e Firestore ativos.

No Firebase Console, adicione `brenoch.github.io` em `Authentication > Settings > Authorized domains` e publique as regras em `firebase/firestore.rules`.

Link para testar o projeto: https://brenoch.github.io/LifeFlow/

# Arquitetura

## Decisão principal

A aplicação usa Next.js App Router, React e TypeScript estrito. A UI chama serviços de aplicação; serviços orquestram Supabase; regras pedagógicas permanecem funções puras. Essa separação permite testar avaliação e adaptação sem rede ou banco.

```text
app/routes + components
        |
features/use-cases + validation
        |
domain (scoring, diagnosis, plans, progression, review)
        |
lib/supabase + PostgreSQL/RLS
        |
IndexedDB outbox (somente offline) -> sync idempotente
```

## Árvore-alvo

```text
app/                    rotas públicas, autenticadas, admin e APIs
src/components/         design system e composição acessível
src/features/           casos de uso por área
src/domain/             motores puros e versionados
src/lib/                Supabase, validação, offline e segurança
supabase/migrations/    schema, constraints, índices e RLS
supabase/seed.sql        conteúdo original marcado como seed
public/                 manifest, ícones, offline e service worker
tests/                  unitários, integração e E2E
docs/                   decisões e operação
```

## Fronteiras

- O cliente nunca usa service role. Server actions e handlers validam sessão e entrada.
- Identidade vem de cookies seguros gerenciados pelo Supabase SSR; tokens não vão para `localStorage`.
- Toda tabela de usuário possui política de proprietário; funções administrativas verificam papel no servidor e em RLS.
- `sync_operations.idempotency_key` é única por usuário.
- Versões de textos são imutáveis depois de publicadas; tentativas referenciam a versão usada.

## PWA

O service worker armazena shell, página offline e conteúdo explicitamente baixado. Tentativas ficam em IndexedDB até confirmação do servidor. A fila mantém `operationId`, payload validado, data e estado; remoção ocorre só após resposta idempotente.

## IA futura

`ContentAnalysisProvider` isola análise opcional. A implementação inicial é determinística. `ENABLE_AI_PROVIDER=false` e nenhuma rota externa é chamada.

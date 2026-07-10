# MindForge Reading

PWA educacional em português do Brasil para praticar leitura, compreensão, retenção, vocabulário e estabilidade na tarefa. O produto usa regras determinísticas: velocidade só é valorizada quando compreensão e retenção permanecem adequadas.

## Requisitos

- Node.js 22.13 ou superior
- npm
- Projeto Supabase para autenticação e PostgreSQL
- Supabase CLI opcional para desenvolvimento local

## Instalação

```bash
npm install
Copy-Item .env.example .env.local
```

Preencha `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_ANON_KEY` com os valores públicos do projeto. Nunca coloque a service role no cliente.

## Banco e autenticação

1. Crie um projeto no Supabase.
2. Aplique `supabase/migrations/202607100001_initial_schema.sql`.
3. Aplique `supabase/seed.sql` para carregar os 15 textos originais marcados como `seed`.
4. Em Authentication > URL Configuration, inclua a origem local e a origem de produção entre os redirects permitidos.
5. Mantenha confirmação de e-mail ativa e configure proteção contra abuso/CAPTCHA no painel antes de produção.

O PostgreSQL com RLS é a fonte de verdade. IndexedDB guarda somente conteúdo baixado e a fila idempotente de operações offline; tokens não são persistidos em `localStorage`.

## Execução

```bash
npm run dev
```

Abra a URL exibida no terminal. Sem as variáveis do Supabase, as áreas persistentes mostram uma orientação de configuração e não inventam dados locais.

## Qualidade

```bash
npm run lint
npm run typecheck
npm test
npm run test:integration
npm run build
```

Os testes E2E exigem uma aplicação em execução e um ambiente Supabase de teste:

```bash
npm run test:e2e
```

## Arquitetura

- `app/`: rotas App Router, landing, autenticação e áreas do produto.
- `src/components/`: componentes acessíveis e fluxos interativos.
- `src/domain/`: motores puros de avaliação, adaptação, progressão, revisão e análise por regras.
- `src/lib/supabase/`: clientes SSR e browser.
- `src/lib/offline/`: cache e outbox IndexedDB idempotente.
- `supabase/migrations/`: schema, constraints, índices, gatilhos e RLS.
- `supabase/seed.sql`: conteúdo demonstrativo original e redistribuível.
- `docs/`: especificação, decisões, segurança, testes e implantação.

`ENABLE_AI_PROVIDER=false` permanece desativado. A implementação inicial é `RuleBasedContentAnalysisProvider` e não chama APIs externas de IA.

## PWA

O manifest, os ícones 192/512, o service worker e a página offline ficam em `public/`. O service worker fornece o shell offline; sessões baixadas e tentativas pendentes usam IndexedDB com chaves idempotentes.

## Administração

Os papéis `content_admin` e `system_admin` são concedidos no banco por um administrador autorizado. A interface nunca é a única barreira: RLS e funções do banco validam acesso. O workflow editorial é `draft → review → approved → published → archived`.

## Deploy

1. Configure um projeto Supabase de produção e aplique migrations e seed conforme a política do ambiente.
2. Cadastre a URL pública nos redirects do Supabase.
3. Configure as variáveis públicas no ambiente de hospedagem.
4. Execute `npm run build`.
5. Publique a saída Cloudflare Worker compatível gerada pelo vinext/Sites.
6. Faça smoke tests de cadastro, confirmação, login, onboarding, leitura pública e instalação PWA.

Backup, rollback, monitoramento e checklist de produção estão em `docs/deployment.md`.

## Solução de problemas

- “Configure o Supabase”: confira `.env.local` e reinicie o servidor.
- Cadastro sem e-mail: revise SMTP, confirmação e redirects no Supabase.
- Conteúdo vazio: aplique a migration e depois o seed.
- PWA antiga: feche as abas, remova o service worker anterior e recarregue.
- RLS negou uma ação: valide a sessão e o papel no banco; não desative RLS para contornar o erro.

## Limitações atuais

Consulte `docs/implementation-plan.md`. As fases não validadas com um Supabase de teste não são declaradas concluídas, e os textos jurídicos permanecem provisórios até revisão especializada.

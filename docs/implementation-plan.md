# Plano de implementação

Atualizado em 2026-07-10. Uma fase só recebe status concluída depois de lint, typecheck, testes e build, além da validação das integrações externas aplicáveis.

## Fase 1 — Fundação — concluída no código

Entregue: documentação-base, design system mobile-first, navegação, Supabase SSR/Auth, confirmação e recuperação de conta, onboarding, schema PostgreSQL/RLS, PWA básica, página offline e CI. O fluxo não cria persistência alternativa quando o Supabase está ausente.

Validação: lint, typecheck e 18 testes automatizados passaram; build de produção passou. Cadastro/login e e-mail ainda exigem smoke test em um projeto Supabase configurado.

## Fase 2 — Conteúdo — parcialmente implementada

Entregue: passagens versionadas, perguntas, opções, rubricas, workflow no schema, biblioteca persistente e 15 textos originais `seed`, três por nível.

Pendente: editor administrativo completo, preview, publicação e versionamento por interface. A tela atual aplica autorização real, mas não finge edição inexistente.

## Fase 3 — Avaliação — parcialmente implementada

Entregue: tabelas de runs, eventos, respostas e métricas; funções puras de WPM, pesos, índice efetivo, calibração, confiança e perfis; introdução autenticada que seleciona conteúdo real.

Pendente: máquina de estados interativa dos dez blocos, pausa/timers, persistência de respostas, retenção atrasada e tela final.

## Fase 4 — Motor adaptativo — núcleo implementado

Entregue: prioridades, guardas de compreensão/retenção, alocação exata para 10/15/20/30 minutos, progressão e interfaces de análise sem IA externa, com testes unitários.

Pendente: serviço transacional que gera e persiste as 56 sessões a partir de uma avaliação concluída e testes de integração com PostgreSQL.

## Fase 5 — Treino — parcialmente implementada

Entregue: modelo de exercícios, assignments, tentativas idempotentes, sessões e eventos; rota que consulta sessão planejada real.

Pendente: leitor ajustável, execução bloco a bloco, feedback e conclusão transacional.

## Fase 6 — Memória — núcleo implementado

Entregue: algoritmo transparente de revisão espaçada, bloqueio de “fácil” quando incorreto, tabelas de fila/tentativas e listagem real de itens vencidos.

Pendente: resposta interativa, flashcards e atualização atômica da agenda.

## Fase 7 — Dashboard — parcialmente implementada

Entregue: resumo real da última avaliação, plano e revisões; histórico sempre associa ritmo, compreensão, retenção e índice efetivo.

Pendente: metas, conquistas, médias móveis e gráficos acessíveis.

## Fase 8 — Offline e sincronização — núcleo implementado

Entregue: service worker, página offline, IndexedDB para conteúdo e outbox, deduplicação por UUID, remoção apenas após confirmação e teste de integração.

Pendente: endpoint autenticado de sync, indicador visual de status e download explícito de sessão.

## Fase 9 — Qualidade — em andamento

Entregue: TypeScript estrito, ESLint, Vitest, Playwright configurado, redução de movimento, foco visível, landmarks, RLS, constraints, documentação de privacidade e pipeline CI.

Pendente: suíte E2E dos fluxos completos, auditoria automatizada de acessibilidade, rate limit/CAPTCHA de produção, revisão manual AA, testes RLS e revisão jurídica LGPD.

## Fase 10 — Deploy — preparada, não executada

Entregue: build Cloudflare Worker compatível, `.env.example`, documentação de Supabase, backup, rollback e checklist.

Pendente: credenciais/ambiente Supabase de produção, configuração de e-mail, domínio, monitoramento, publicação e smoke test de produção.

## Registro de decisões

- Supabase/PostgreSQL permanece fonte de verdade; storage do navegador não substitui banco.
- Integração de IA fica desativada e isolada por interface.
- Motores usam funções puras e versões explícitas.
- Conteúdo demo é seed original, nunca dado fingido em runtime.
- A hospedagem Sites não substitui Supabase porque a especificação exige PostgreSQL, Supabase Auth e RLS.

## Próxima sequência segura

1. Implementar a avaliação transacional completa e seus testes de integração.
2. Persistir o plano de oito semanas a partir do resultado validado.
3. Implementar execução e conclusão do treino.
4. Conectar revisão e sync offline a endpoints idempotentes.
5. Completar admin, E2E, acessibilidade e implantação.

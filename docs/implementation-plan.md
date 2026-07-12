# Plano de implementação

Atualizado em 2026-07-12. Uma fase só recebe status concluída após lint, typecheck, testes, build e validação das integrações externas aplicáveis.

## Fase 1 — Fundação — concluída

Design system responsivo, autenticação Supabase SSR, renovação de sessão por `proxy.ts`, onboarding, PostgreSQL/RLS, PWA, CI e navegação autenticada. Cadastro e login usam o projeto Supabase real; sair é uma ação explícita.

## Fase 2 — Conteúdo — concluída para o catálogo do aluno

15 passagens originais `seed`, perguntas, alternativas, rubricas e biblioteca graduada. A área Aprender contém três edições com capas originais, 18 lições completas, exemplos, atividades, revisão ativa, referências e progresso persistente.

Limitação: o editor administrativo rico e o workflow visual de aprovação continuam pendentes; o conteúdo entregue é versionado no repositório e no banco.

## Fase 3 — Avaliação — concluída

Fluxo autenticado e cronometrado com preparação, leitura, régua seletiva, pausa, compreensão ponderada, confiança, recordação imediata, tarefa intermediária, retenção atrasada, estabilidade e resultado. A conclusão persiste run, eventos, respostas e métricas e foi validada ponta a ponta no Supabase de produção.

## Fase 4 — Motor adaptativo — concluída para a primeira avaliação

Motor determinístico gratuito `rules-2.0`, sem API externa, calcula WPM, compreensão, retenção, estabilidade, vocabulário, calibração, índice efetivo, confiança, perfis e prioridades. Gera plano persistente e oito sessões iniciais. As funções centrais permanecem puras em `src/domain`.

Limitação: recomendações de texto livre usam rubricas declaradas; não alegam compreensão semântica profunda.

## Fase 5 — Treino — funcional básico

Plano diário é exibido bloco a bloco e pode ser concluído e salvo. O laboratório oferece régua seletiva, unidades de sentido e recuperação ativa com tentativas persistentes.

Pendente: ampliar o catálogo para os 30 tipos de exercício e gerar todas as 56 sessões detalhadas do programa de oito semanas.

## Fase 6 — Memória — núcleo implementado

Fila real, algoritmo transparente de repetição espaçada, item criado após avaliação e bloqueio de avanço fácil quando a resposta está incorreta.

Pendente: resposta interativa de todos os tipos de item e notificações internas.

## Fase 7 — Dashboard — funcional básico

Dashboard, histórico e plano usam dados reais. Ritmo sempre aparece junto a compreensão, retenção e índice efetivo.

Pendente: médias móveis, metas, conquistas e gráficos acessíveis detalhados.

## Fase 8 — Offline e sincronização — núcleo implementado

Service worker, página offline, IndexedDB e outbox idempotente estão presentes. Pendente conectar todos os novos fluxos de avaliação e treino à fila offline.

## Fase 9 — Qualidade — em andamento

TypeScript estrito, ESLint, Vitest, redução de movimento, foco visível, RLS e documentação. Estado validado em 2026-07-12: lint, typecheck, 20 testes e build passaram; smoke autenticado confirmou login, permanência da sessão, catálogo, avaliação, plano e histórico.

Pendente: ampliar E2E automatizado, auditoria AA completa, CAPTCHA/rate limit de produção e revisão jurídica LGPD.

## Fase 10 — Deploy — em andamento

Supabase de produção, migrations, seed, variáveis Sites e publicação estão configurados. A revisão atual será publicada após o último commit e pipeline.

## Decisões permanentes

- Supabase/PostgreSQL é a fonte de verdade; storage do navegador não substitui banco.
- A “análise adaptativa” é um motor gratuito de regras auditável, não uma API paga nem diagnóstico clínico.
- Compreensão abaixo de 0,60 ou retenção abaixo de 0,50 bloqueia destaque de velocidade.
- Capas e conteúdo didático são originais e redistribuíveis.
- Respostas livres não são enviadas a analytics nem a provedores externos.

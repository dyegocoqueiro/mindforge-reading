# Plano de implementação

Atualizado em 2026-07-12. Uma fase só recebe status concluída após lint, typecheck, testes, build e validação das integrações externas aplicáveis.

## Fase 1 — Fundação — concluída

Design system responsivo, autenticação Supabase SSR, renovação de sessão por `proxy.ts`, onboarding, PostgreSQL/RLS, PWA, CI e navegação autenticada. Cadastro e login usam o projeto Supabase real; sair é uma ação explícita.

## Fase 2 — Conteúdo — concluída para o catálogo do aluno

15 passagens originais `seed`, perguntas, alternativas, rubricas e biblioteca graduada. A área Aprender contém três edições com capas originais, 27 lições completas, exemplos comentados, atividades, revisão ativa, referências e progresso persistente.

Limitação: o editor administrativo rico e o workflow visual de aprovação continuam pendentes; o conteúdo entregue é versionado no repositório e no banco.

## Fase 3 — Avaliação — concluída

Fluxo autenticado e cronometrado com preparação, leitura, régua seletiva, pausa, compreensão ponderada, confiança, recordação imediata, tarefa intermediária, retenção atrasada, estabilidade e resultado. A conclusão persiste run, eventos, respostas e métricas e foi validada ponta a ponta no Supabase de produção.

## Fase 4 — Motor adaptativo — concluída para a primeira avaliação

Motor determinístico gratuito `rules-2.0`, sem API externa, calcula WPM, compreensão, retenção, estabilidade, vocabulário, calibração, índice efetivo, confiança, perfis e prioridades. Gera plano persistente e oito sessões iniciais. As funções centrais permanecem puras em `src/domain`.

Limitação: recomendações de texto livre usam rubricas declaradas; não alegam compreensão semântica profunda.

## Fase 5 — Treino — funcional e persistente

Os oito blocos do plano diário abrem atividades específicas. Um bloco só recebe check após resposta validada no servidor e persistida em `training_block_attempts`; a sessão só encerra com todos os blocos e gera um resumo adaptativo. O laboratório usa os textos publicados, permite alternância de conteúdo, régua automática com ritmo selecionável, pausa, unidades de sentido e recuperação ativa.

Pendente: ampliar o catálogo para os 30 tipos de exercício e gerar todas as 56 sessões detalhadas do programa de oito semanas.

## Fase 6 — Memória — funcional

Fila real com resposta livre, análise conceitual no servidor e algoritmo transparente de repetição espaçada. Cada sessão cria itens para as habilidades de menor resultado; erro impede avanço fácil e agenda retorno próximo. O texto privado da resposta não é persistido.

## Fase 7 — Dashboard — funcional

Dashboard, histórico e plano usam dados reais. A área Progresso combina avaliações e sessões em gráfico responsivo, indicadores e tabela acessível. Ritmo nunca é tratado como conquista isolada.

## Fase 8 — Offline e sincronização — núcleo implementado

Service worker, página offline, IndexedDB e outbox idempotente estão presentes. Pendente conectar todos os novos fluxos de avaliação e treino à fila offline.

## Fase 9 — Qualidade — em andamento

TypeScript estrito, ESLint, Vitest, redução de movimento, foco visível, RLS e documentação. Tema claro, escuro e do sistema é global; tamanho e entrelinha são aplicados somente às tarefas e conteúdos de leitura.

Validação desta revisão: lint, typecheck, 23 testes e build de produção passaram. O smoke autenticado será registrado após a publicação.

Pendente: ampliar E2E automatizado, auditoria AA completa, CAPTCHA/rate limit de produção e revisão jurídica LGPD.

## Fase 10 — Deploy — em andamento

Supabase de produção, seed, variáveis Sites e publicação estão configurados. A migration `202607120002_training_sessions.sql`, com tentativas, resumos, índices e RLS, foi aplicada com sucesso em 2026-07-12.

## Decisões permanentes

- Supabase/PostgreSQL é a fonte de verdade; storage do navegador não substitui banco.
- A “análise adaptativa” é um motor gratuito de regras auditável, não uma API paga nem diagnóstico clínico.
- Compreensão abaixo de 0,60 ou retenção abaixo de 0,50 bloqueia destaque de velocidade.
- Capas e conteúdo didático são originais e redistribuíveis.
- Respostas livres não são enviadas a analytics nem a provedores externos.

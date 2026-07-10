# Plano de testes

## Unitários

WPM, normalização, índice efetivo, perfis, confiança, alocação exata, progressão, repetição espaçada, rubricas, regras adaptativas e idempotência.

## Integração

Com projeto Supabase local: cadastro/login, persistência da avaliação, plano, conclusão de sessão, revisão, sync, políticas RLS e operações administrativas. Testes que exigem Supabase são separados e falham com instrução clara quando o ambiente obrigatório não existe.

## E2E

Playwright percorre onboarding → avaliação → plano → treino → dashboard → revisão, além de instalação PWA, sessão offline/sync, exportação e exclusão. O smoke principal usa um usuário criado no ambiente de teste, nunca um mock de banco.

## Acessibilidade

Auditoria automatizada com axe e checagem manual de teclado, foco, landmarks, zoom, contraste, leitor de tela, redução de movimento e alvos de toque.

## Pipeline

Em cada fase: `lint`, `typecheck`, `test:unit`, `test:integration`, `build` e `test:e2e:smoke`. CI provisiona variáveis e Supabase local antes dos testes de integração.

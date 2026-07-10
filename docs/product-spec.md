# Especificação do produto

## Visão

MindForge Reading é uma aplicação educacional em português do Brasil, responsiva e instalável como PWA, para praticar leitura, compreensão, retenção, vocabulário e foco. A velocidade é consequência da fluência e nunca substitui compreensão ou memória.

## Público e resultado esperado

Estudantes e adultos criam conta, definem objetivos, concluem uma avaliação de 25–35 minutos, recebem um perfil educacional baseado em regras e seguem sessões adaptadas de 10, 15, 20 ou 30 minutos. O padrão é 20 minutos.

## Escopo funcional

- Landing, autenticação, onboarding e preferências de leitura.
- Avaliação em dez blocos com pausas, eventos comportamentais mínimos e metacognição.
- Métricas de ritmo, compreensão, retenção imediata e atrasada, vocabulário e estabilidade na tarefa.
- Plano de oito semanas, cinco níveis e dezesseis módulos.
- Biblioteca versionada, 30 tipos de exercício, treino diário e revisão espaçada.
- Dashboard que sempre contextualiza velocidade com compreensão e retenção.
- Gamificação moderada, material “Fundamentos da Leitura Ativa” e administração de conteúdo.
- PWA, sessão baixada, fila offline idempotente, exportação e exclusão de conta.

## Princípios inegociáveis

- Produto educacional, não clínico; sem câmera, microfone, biometria ou eye tracking.
- Sem promessas de cura, diagnóstico, eliminação de subvocalização ou WPM garantido.
- Conteúdo original, licenciado, aberto ou em domínio público.
- Dados persistentes em PostgreSQL com Supabase Auth e RLS.
- IA externa desligada; a versão inicial usa `RuleBasedContentAnalysisProvider`.

## Critérios de aceitação

Instalação, lint, typecheck, testes e build passam; conta e sessão são reais; avaliação gera métricas; plano totaliza o tempo solicitado; progresso persiste; revisão agenda corretamente; PWA é instalável; operações offline sincronizam uma única vez; teclado e contraste são utilizáveis; não há segredos, botões falsos ou alegações clínicas.

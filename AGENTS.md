# MindForge Reading — regras permanentes

- Trate `docs/product-spec.md` e o prompt mestre como a especificação do produto.
- Use TypeScript estrito, App Router e componentes acessíveis; preserve navegação por teclado e redução de movimento.
- Mantenha regras de avaliação, adaptação, progressão e revisão em funções puras dentro de `src/domain`.
- Supabase/PostgreSQL é a fonte de verdade. IndexedDB serve apenas para conteúdo baixado e fila offline idempotente.
- Nunca armazene tokens em `localStorage`, respostas privadas em analytics ou segredos no repositório.
- Use “perfil educacional” e “estabilidade na tarefa”; não faça diagnóstico clínico nem promessas de leitura ultrarrápida.
- Não recompense velocidade quando compreensão < 0,60 ou retenção atrasada < 0,50.
- Conteúdo de demonstração deve ser original, redistribuível e marcado como `seed`.
- Não crie botões sem ação, páginas vazias ou persistência simulada como solução final.
- Valide entradas no cliente e no servidor com Zod; autorização e RLS nunca dependem apenas da interface.
- Antes de concluir uma fase, rode lint, typecheck, testes e build; registre limitações em `docs/implementation-plan.md`.
- Preserve alterações do usuário e mantenha `.env.example` sincronizado sem incluir credenciais reais.

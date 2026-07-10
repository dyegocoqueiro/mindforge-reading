# Motor de avaliação

## Fluxo

Instruções → leitura basal → compreensão → recordação imediata → tarefa intermediária → recordação atrasada → hábitos/estabilidade → vocabulário → metacognição → resultado. Pausas intencionais são excluídas do tempo ativo e registradas.

## Métricas

- `WPM = palavras / (segundos_ativos / 60)`; entrada inválida retorna 0.
- Questões usam pesos: literal 1, ideia principal 1,5, inferência 1,5, estrutura 1,25, vocabulário 1 e aplicação 1,5.
- Todas as dimensões são normalizadas entre 0 e 1.
- Índice efetivo: `100 × velocidade^0,20 × compreensão^0,35 × retenção_atrasada^0,25 × estabilidade^0,10 × vocabulário^0,10`, com piso numérico apenas no cálculo.
- Calibração metacognitiva é `1 - |confiança - acurácia|`, limitada a 0–1 e descrita somente para a avaliação atual.

## Confiabilidade

Itens respondidos, consistência, tempo plausível, interrupções, variedade de textos e retenção atrasada produzem estado baixo, moderado ou alto. Baixa confiabilidade pede nova medição e não gera conclusões fortes.

## Perfis educacionais

Fluência em desenvolvimento, compreensão prioritária, retenção prioritária, estabilidade na tarefa prioritária, vocabulário prioritário, leitor equilibrado e leitura avançada orientada por objetivo. Mais de um perfil pode ser retornado.

## Segurança

Compreensão abaixo de 0,60 bloqueia celebração de velocidade. Retenção atrasada abaixo de 0,50 prioriza memória. Dor, visão dupla, cefaleia frequente, mal-estar ou dificuldade funcional importante interrompem a avaliação e mostram orientação para buscar profissional qualificado.

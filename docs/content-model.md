# Modelo de conteúdo

## Material didático

As 18 lições de **Fundamentos da Leitura Ativa** vivem em `src/content/lessons.ts`, organizadas em três edições. Cada lição declara objetivo, explicação, exemplo, atividade, pergunta de recuperação, resposta e referências. `learning_progress` registra conclusão por usuário; `practice_attempts` registra somente tipo, pontuação, duração e metadados mínimos, sem guardar o rascunho privado.

## Passagens

`passages` mantém identidade e workflow; `passage_versions` contém texto imutável, idioma, tema, palavras, dificuldades lexical/sintática, conhecimento prévio, estrutura, tempo, licença, autoria e fonte. Estados: rascunho → revisão → aprovado → publicado → arquivado.

## Avaliação

Perguntas têm tipo, peso, feedback e opções. Rubricas de conceito têm palavras obrigatórias, sinônimos aceitos, contradições, peso e obrigatoriedade. A correção mostra conceitos identificados/ausentes e possível contradição; não afirma compreensão semântica profunda.

## Exercícios

Definições incluem instrução, duração, dificuldade, habilidade-alvo, critérios, feedback, acessibilidade e telemetria mínima. O catálogo cobre os 30 tipos especificados, de guia de linha a avaliação atrasada.

## Versionamento e direitos

Tentativas referenciam a versão exata. Publicação exige licença `original`, `licensed`, `open` ou `public_domain`, autor e fonte quando aplicável. Seed inicial contém quinze textos originais e é marcado `is_seed=true`.

## Conteúdo do usuário

Texto colado permite contagem, timer, marcações, resumo e flashcards manuais. Sem rubrica, o sistema não atribui nota de compreensão nem cria perguntas profundas automaticamente.

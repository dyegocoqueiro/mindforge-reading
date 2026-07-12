export type Lesson = {
  slug: string;
  order: number;
  title: string;
  collection: "fundamentos" | "pratica" | "memoria";
  minutes: number;
  objective: string;
  explanation: string[];
  example: string;
  activity: string;
  reviewQuestion: string;
  reviewAnswer: string;
  references: string[];
};

export const collectionMeta = {
  fundamentos: { title: "Fundamentos ativos", cover: "/covers/fundamentos-ativos.png", edition: "1ª edição · 2026" },
  pratica: { title: "Prática guiada", cover: "/covers/pratica-guiada.png", edition: "1ª edição · 2026" },
  memoria: { title: "Memória e autonomia", cover: "/covers/memoria-autonoma.png", edition: "1ª edição · 2026" },
} as const;

export const lessons: Lesson[] = [
  {
    slug: "como-a-leitura-funciona", order: 1, title: "Como a leitura funciona", collection: "fundamentos", minutes: 7,
    objective: "Entender leitura como coordenação entre reconhecimento, linguagem, conhecimento e objetivo.",
    explanation: ["Ler não é apenas mover os olhos nem pronunciar palavras mentalmente. O leitor reconhece sinais escritos, ativa significados, conecta ideias e verifica se a interpretação faz sentido.", "O objetivo muda a estratégia: explorar um texto pede visão geral; estudar pede perguntas, pausas e recuperação; ler literatura pode pedir atenção ao ritmo e às imagens."],
    example: "Antes de um capítulo, observe título e subtítulos. Depois formule uma pergunta. A leitura passa a procurar relações, não somente frases isoladas.",
    activity: "Escolha um texto curto e escreva, antes de ler, qual é seu objetivo e duas perguntas que espera responder.",
    reviewQuestion: "Por que a mesma velocidade não serve para todos os textos?", reviewAnswer: "Porque dificuldade, familiaridade e objetivo exigem estratégias e ritmos diferentes.",
    references: ["Rayner et al. (2016), So Much to Read, So Little Time", "Duke, Ward & Pearson (2021), The Science of Reading Comprehension"],
  },
  {
    slug: "decodificacao-e-palavras", order: 2, title: "Decodificação e reconhecimento de palavras", collection: "fundamentos", minutes: 7,
    objective: "Distinguir decodificação, reconhecimento e compreensão sem prometer eliminar a leitura fonológica.",
    explanation: ["No início, muitas palavras exigem atenção às relações entre letras e sons. Com exposição e prática, palavras frequentes ficam mais fáceis de reconhecer, liberando recursos para compreender frases.", "O processamento fonológico continua útil, sobretudo diante de palavras novas, nomes e textos complexos. Fluência não significa abandonar sons, mas coordenar reconhecimento e significado."],
    example: "A palavra desconhecida ‘intermitente’ pode ser dividida, lida no contexto e relacionada a ‘algo que para e retorna’.",
    activity: "Marque três palavras pouco familiares. Separe partes reconhecíveis e escreva uma hipótese de significado usando a frase.",
    reviewQuestion: "O reconhecimento automático elimina a decodificação?", reviewAnswer: "Não. Ele reduz esforço em palavras familiares, enquanto a decodificação continua disponível quando necessária.",
    references: ["Ehri (2014), Orthographic Mapping in the Acquisition of Sight Word Reading", "Castles, Rastle & Nation (2018), Ending the Reading Wars"],
  },
  {
    slug: "fluencia-com-equilibrio", order: 3, title: "Fluência com equilíbrio", collection: "fundamentos", minutes: 8,
    objective: "Praticar precisão, ritmo e expressão sem sacrificar compreensão.",
    explanation: ["Fluência combina leitura correta, ritmo funcional e organização pela pontuação. Ela ajuda a memória de trabalho porque reduz o esforço gasto em cada palavra.", "Velocidade sozinha não comprova fluência. Se ideias centrais desaparecem, o ritmo precisa ser reduzido e estabilizado."],
    example: "Leia uma vez marcando pausas de vírgulas e pontos. Na segunda leitura, agrupe unidades como ‘ao final da tarde’ e ‘por causa da chuva’.",
    activity: "Leia um parágrafo duas vezes. Registre o tempo e, sem olhar, escreva a ideia central. Só considere melhora se a ideia permanecer correta.",
    reviewQuestion: "Qual é a guarda principal ao aumentar o ritmo?", reviewAnswer: "Preservar compreensão e retenção, não premiar apenas palavras por minuto.",
    references: ["Kuhn, Schwanenflugel & Meisinger (2010), Aligning Theory and Assessment of Reading Fluency", "National Reading Panel (2000)"],
  },
  {
    slug: "compreensao-em-camadas", order: 4, title: "Compreensão em camadas", collection: "fundamentos", minutes: 8,
    objective: "Separar informação literal, ideia central, inferência e aplicação.",
    explanation: ["Compreender inclui localizar o que está explícito, resumir a tese, ligar partes e construir inferências sustentadas por evidências.", "Uma resposta plausível não basta: deve ser possível apontar quais trechos e relações apoiam a interpretação."],
    example: "Se um texto mostra ruas molhadas e pessoas fechando guarda-chuvas, é possível inferir que choveu, mesmo sem a frase ‘choveu’.",
    activity: "Após um parágrafo, escreva uma informação literal, a ideia central e uma inferência. Para a inferência, indique a evidência.",
    reviewQuestion: "O que diferencia inferência de palpite?", reviewAnswer: "A inferência é sustentada por pistas do texto e conhecimento pertinente.",
    references: ["Kintsch (1998), Comprehension: A Paradigm for Cognition", "Duke et al. (2021)"],
  },
  {
    slug: "conhecimento-previo", order: 5, title: "Conhecimento prévio", collection: "fundamentos", minutes: 6,
    objective: "Ativar conhecimento útil sem deixar expectativas substituírem o texto.",
    explanation: ["Conhecimento prévio ajuda a interpretar termos, preencher relações e fazer perguntas. Ele também pode induzir erro quando o leitor confirma apenas o que já acredita.", "Uma boa leitura alterna previsão e verificação: ‘o que espero?’ e ‘o que o texto realmente apresenta?’"],
    example: "Antes de ler sobre energia solar, liste o que sabe. Durante a leitura, marque uma confirmação, uma correção e uma novidade.",
    activity: "Faça uma tabela com três colunas: sei, quero saber, aprendi. Preencha a última somente após a leitura.",
    reviewQuestion: "Como evitar que conhecimento prévio distorça a leitura?", reviewAnswer: "Comparando previsões com evidências e aceitando correções trazidas pelo texto.",
    references: ["McNamara & Kintsch (1996), Learning from Texts", "Willingham (2006), How Knowledge Helps"],
  },
  {
    slug: "vocabulario-no-contexto", order: 6, title: "Vocabulário no contexto", collection: "fundamentos", minutes: 8,
    objective: "Inferir significados com pistas e consolidar novas palavras pelo uso.",
    explanation: ["O contexto pode oferecer definição, contraste, exemplo ou consequência. Nem sempre basta; por isso a hipótese deve ser verificada depois.", "Aprender uma palavra envolve forma, significado, usos possíveis e relações com outras palavras."],
    example: "Em ‘o solo estava árido; nenhuma planta resistia à falta de água’, a consequência ajuda a inferir ‘muito seco’.",
    activity: "Escolha duas palavras novas. Registre a frase, a pista usada, sua hipótese, a definição confirmada e uma nova frase.",
    reviewQuestion: "Quais pistas podem revelar significado?", reviewAnswer: "Definições, exemplos, contrastes, causas, consequências e palavras relacionadas.",
    references: ["Nagy & Scott (2000), Vocabulary Processes", "Beck, McKeown & Kucan (2013), Bringing Words to Life"],
  },
  {
    slug: "memoria-de-trabalho", order: 7, title: "Memória de trabalho", collection: "pratica", minutes: 7,
    objective: "Reduzir carga desnecessária e manter relações importantes durante a leitura.",
    explanation: ["A memória de trabalho mantém temporariamente palavras e relações enquanto a frase é interpretada. Ela é limitada; telas carregadas e instruções longas disputam espaço com o conteúdo.", "Segmentar, nomear a ideia central e fazer pausas estratégicas reduz carga extrínseca."],
    example: "Em uma frase longa, identifique primeiro quem faz o quê; depois acrescente condições e explicações.",
    activity: "Divida um parágrafo longo em unidades de sentido usando barras. Resuma cada unidade em até cinco palavras.",
    reviewQuestion: "Por que segmentar ajuda?", reviewAnswer: "Porque organiza relações em unidades manejáveis e reduz a carga simultânea.",
    references: ["Baddeley (2012), Working Memory", "Sweller, van Merriënboer & Paas (2019), Cognitive Architecture"],
  },
  {
    slug: "memoria-de-longo-prazo", order: 8, title: "Memória de longo prazo", collection: "pratica", minutes: 7,
    objective: "Construir conexões que favoreçam recuperação posterior.",
    explanation: ["Guardar não é fotografar uma página. A memória reconstrói informação a partir de conceitos, relações e pistas.", "Elaboração, exemplos próprios e organização aumentam rotas de acesso, mas a lembrança precisa ser praticada ao longo do tempo."],
    example: "Ligue ‘evaporação’ a um exemplo cotidiano, à mudança de estado e ao papel do calor.",
    activity: "Crie três conexões para uma ideia: definição, exemplo e relação com outro conceito.",
    reviewQuestion: "Por que múltiplas conexões ajudam?", reviewAnswer: "Elas criam mais pistas e caminhos para recuperar a informação.",
    references: ["Squire & Dede (2015), Conscious and Unconscious Memory Systems", "Brown, Roediger & McDaniel (2014), Make It Stick"],
  },
  {
    slug: "recuperacao-ativa", order: 9, title: "Recuperação ativa", collection: "pratica", minutes: 8,
    objective: "Trocar parte da releitura por tentativas de lembrar sem consulta.",
    explanation: ["Tentar recuperar uma informação fortalece acesso futuro e revela lacunas que a releitura pode esconder.", "O esforço precisa ser produtivo: tente, confira, corrija e tente novamente mais tarde."],
    example: "Feche o texto e escreva a ideia central, três apoios e uma dúvida. Depois compare com o original.",
    activity: "Use o ciclo 2–1: dois minutos de leitura e um minuto de recordação sem consulta, por três rodadas.",
    reviewQuestion: "Qual é a sequência completa da recuperação?", reviewAnswer: "Tentar lembrar, verificar, corrigir e recuperar novamente depois.",
    references: ["Roediger & Karpicke (2006), Test-Enhanced Learning", "Dunlosky et al. (2013), Improving Students’ Learning"],
  },
  {
    slug: "repeticao-espacada", order: 10, title: "Repetição espaçada", collection: "pratica", minutes: 8,
    objective: "Distribuir revisões em intervalos e ajustar pelo desempenho real.",
    explanation: ["Revisões distribuídas tendem a produzir retenção mais duradoura do que concentrar todas as repetições em um encontro.", "Itens esquecidos retornam cedo; itens lembrados com segurança avançam gradualmente. O intervalo é uma decisão prática, não uma garantia."],
    example: "Uma ideia estudada hoje pode voltar amanhã, em três dias, sete dias e depois em intervalos maiores.",
    activity: "Crie quatro cartões com perguntas. Responda sem olhar e classifique: esqueci, difícil, esforço ou fácil.",
    reviewQuestion: "Quando um item deve voltar mais cedo?", reviewAnswer: "Quando houve erro, grande esforço ou baixa confiança sustentada pelo desempenho.",
    references: ["Cepeda et al. (2006), Distributed Practice", "Kang (2016), Spaced Repetition Promotes Efficient Learning"],
  },
  {
    slug: "foco-e-distracao", order: 11, title: "Foco e distração", collection: "pratica", minutes: 7,
    objective: "Preparar o ambiente e recuperar a tarefa sem culpa após interrupções.",
    explanation: ["Foco varia e não é um traço fixo. Notificações, alternância de tarefas, fadiga e instruções confusas podem aumentar interrupções.", "A estratégia é tornar o próximo passo visível: definir um bloco curto, remover um gatilho e marcar onde retomar."],
    example: "Antes de dez minutos de leitura, silencie notificações e escreva: ‘vou identificar a tese e duas evidências’.",
    activity: "Faça um bloco de quatro minutos. Ao distrair, marque um ponto, retorne à última frase compreendida e continue.",
    reviewQuestion: "Como a plataforma interpreta interrupções?", reviewAnswer: "Como sinais comportamentais da tarefa, nunca como diagnóstico clínico.",
    references: ["Pashler (1998), The Psychology of Attention", "Rosen, Lim, Carrier & Cheever (2011), Task Switching"],
  },
  {
    slug: "leitura-exploratoria", order: 12, title: "Leitura exploratória", collection: "pratica", minutes: 6,
    objective: "Construir mapa inicial antes de decidir onde aprofundar.",
    explanation: ["Explorar é observar estrutura, títulos, destaques, início e conclusão para formular hipóteses. Não substitui leitura cuidadosa quando detalhes importam.", "O produto da exploração é um mapa: assunto, organização e pontos que merecem atenção."],
    example: "Em dois minutos, identifique cinco subtítulos e transforme-os em perguntas.",
    activity: "Explore um capítulo sem ler tudo. Registre tema, estrutura provável, três perguntas e o trecho que lerá profundamente.",
    reviewQuestion: "Qual é a saída útil da exploração?", reviewAnswer: "Um mapa do texto e uma decisão consciente sobre onde aprofundar.",
    references: ["Afflerbach, Pearson & Paris (2008), Clarifying Differences Between Reading Skills and Strategies"],
  },
  {
    slug: "leitura-de-estudo", order: 13, title: "Leitura de estudo", collection: "memoria", minutes: 9,
    objective: "Transformar leitura em perguntas, respostas e revisões.",
    explanation: ["Estudar exige mais do que destacar. Antes da seção, formule perguntas; durante, procure relações; depois, responda sem consultar.", "Anotações úteis comprimem e organizam. Copiar frases inteiras pode produzir familiaridade sem recuperação."],
    example: "Converta ‘Causas da urbanização’ em ‘quais fatores explicam a urbanização e como se relacionam?’.",
    activity: "Aplique PQR: perguntar, questionar durante a leitura e recuperar ao final. Produza cinco perguntas curtas.",
    reviewQuestion: "Por que responder sem consultar é essencial?", reviewAnswer: "Porque testa acesso real e mostra o que ainda precisa de correção.",
    references: ["Dunlosky et al. (2013)", "Fiorella & Mayer (2015), Learning as a Generative Activity"],
  },
  {
    slug: "leitura-profunda", order: 14, title: "Leitura profunda", collection: "memoria", minutes: 9,
    objective: "Analisar argumentos, linguagem e implicações em ritmo deliberado.",
    explanation: ["Leitura profunda desacelera quando a densidade exige. Ela acompanha definições, premissas, evidências, limites e alternativas.", "Regressões conscientes são úteis quando servem a uma pergunta; voltar automaticamente sem objetivo apenas aumenta esforço."],
    example: "Ao encontrar uma conclusão, liste as premissas e pergunte se as evidências realmente sustentam a passagem entre elas.",
    activity: "Escolha um parágrafo denso. Anote tese, evidência, pressuposto e uma possível objeção.",
    reviewQuestion: "Quando voltar ao texto é produtivo?", reviewAnswer: "Quando a volta responde a uma dúvida específica ou verifica uma relação importante.",
    references: ["Wolf (2018), Reader, Come Home", "Pressley & Afflerbach (1995), Verbal Protocols of Reading"],
  },
  {
    slug: "anotacoes-que-ajudam", order: 15, title: "Anotações que ajudam", collection: "memoria", minutes: 8,
    objective: "Criar registros seletivos que apoiem compreensão e revisão.",
    explanation: ["Anotar tudo transforma leitura em transcrição. Uma nota útil captura estrutura: pergunta, ideia, evidência, conexão e dúvida.", "Marcas devem ter significado consistente. Poucas categorias facilitam retornar ao material."],
    example: "Use P para pergunta, C para conceito, E para evidência e ? para dúvida. Ao final, transforme duas marcas em perguntas de revisão.",
    activity: "Anote um trecho usando no máximo cinco linhas e duas citações curtas. Depois escreva uma síntese sem olhar.",
    reviewQuestion: "Qual é o risco de copiar demais?", reviewAnswer: "Criar familiaridade e volume sem organizar ou recuperar as ideias.",
    references: ["Kiewra (1989), A Review of Note-Taking", "Fiorella & Mayer (2015)"],
  },
  {
    slug: "sintese", order: 16, title: "Síntese", collection: "memoria", minutes: 9,
    objective: "Comprimir ideias preservando relações essenciais.",
    explanation: ["Síntese não é apenas encurtar. Ela seleciona o núcleo, organiza apoios e mostra como as partes se conectam.", "Uma boa síntese usa palavras próprias, evita detalhes decorativos e não contradiz o texto."],
    example: "Reduza um parágrafo a uma frase com: tema + afirmação principal + relação decisiva.",
    activity: "Escreva versões de 100, 50 e 20 palavras. Compare o que permaneceu e justifique cada corte.",
    reviewQuestion: "O que precisa sobreviver a uma síntese?", reviewAnswer: "A ideia central e as relações necessárias para que ela continue correta.",
    references: ["Kintsch & van Dijk (1978), Toward a Model of Text Comprehension", "Brown & Day (1983), Macrorules for Summarizing"],
  },
  {
    slug: "planejamento-de-leitura", order: 17, title: "Planejamento de leitura", collection: "memoria", minutes: 7,
    objective: "Definir objetivo, blocos, estratégia e evidência de conclusão.",
    explanation: ["Um plano útil responde: por que vou ler, quanto cabe agora, qual estratégia usarei e como saberei que compreendi.", "Metas por ação são mais controláveis que metas vagas. ‘Responder três perguntas’ orienta melhor que ‘ler bastante’."],
    example: "Plano de 20 minutos: 2 de exploração, 12 de leitura, 4 de recuperação e 2 de revisão.",
    activity: "Monte um plano para a próxima leitura com tempo, objetivo, modo, pausa e produto final.",
    reviewQuestion: "Qual é um bom critério de conclusão?", reviewAnswer: "Um produto verificável, como explicar a tese, resolver perguntas ou produzir uma síntese.",
    references: ["Zimmerman (2002), Becoming a Self-Regulated Learner", "Panadero (2017), Self-Regulated Learning"],
  },
  {
    slug: "limites-da-leitura-ultrarrapida", order: 18, title: "Limites da leitura ultrarrápida", collection: "memoria", minutes: 8,
    objective: "Avaliar promessas de velocidade com critérios de compreensão e finalidade.",
    explanation: ["É possível explorar rapidamente, ganhar fluência e ajustar ritmo. Porém, limites de linguagem, conhecimento e atenção permanecem, especialmente em material complexo.", "Números de palavras por minuto sem teste de compreensão e retenção não demonstram aprendizagem. O indicador útil é desempenho equilibrado para o objetivo."],
    example: "Duas pessoas terminam um texto em tempos diferentes. A comparação só faz sentido considerando dificuldade, respostas, síntese e lembrança posterior.",
    activity: "Analise uma promessa de leitura rápida. Liste o que ela mede, o que omite e qual teste mostraria compreensão real.",
    reviewQuestion: "Por que WPM isolado é insuficiente?", reviewAnswer: "Porque não informa se ideias foram compreendidas, retidas ou aplicadas.",
    references: ["Rayner et al. (2016)", "Carver (1992), Reading Rate: Theory, Research, and Practical Implications"],
  },
];

export function getLesson(slug: string) {
  return lessons.find((lesson) => lesson.slug === slug);
}

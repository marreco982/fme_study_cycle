export interface Topic {
  id: string;
  name: string;
  durationMinutes?: number;
}

export interface Chapter {
  id: string;
  name: string;
  topics: Topic[];
}

export interface Volume {
  id: string;
  number: number;
  title: string;
  priority: "essential" | "important" | "complementary";
  chapters: Chapter[];
}

export const fmeVolumes: Volume[] = [
  {
    id: "vol1",
    number: 1,
    title: "Conjuntos e Funções",
    priority: "essential",
    chapters: [
      {
        id: "vol1_cap1",
        name: "CAPÍTULO I — Noções de lógica",
        topics: [
          { id: "vol1_cap1_t1", name: "Proposições", durationMinutes: 30 },
          { id: "vol1_cap1_t2", name: "Operações lógicas", durationMinutes: 45 },
          { id: "vol1_cap1_t3", name: "Tabelas-verdade", durationMinutes: 30 },
        ],
      },
      {
        id: "vol1_cap2",
        name: "CAPÍTULO II — Conjuntos",
        topics: [
          { id: "vol1_cap2_t1", name: "Conceito de conjunto", durationMinutes: 45 },
          { id: "vol1_cap2_t2", name: "Relação de pertinência", durationMinutes: 30 },
          { id: "vol1_cap2_t3", name: "Igualdade de conjuntos", durationMinutes: 30 },
          { id: "vol1_cap2_t4", name: "Subconjuntos", durationMinutes: 45 },
          { id: "vol1_cap2_t5", name: "Operações com conjuntos", durationMinutes: 60 },
        ],
      },
      {
        id: "vol1_cap3",
        name: "CAPÍTULO III — Conjuntos numéricos",
        topics: [
          { id: "vol1_cap3_t1", name: "Números naturais", durationMinutes: 45 },
          { id: "vol1_cap3_t2", name: "Números inteiros", durationMinutes: 45 },
          { id: "vol1_cap3_t3", name: "Números racionais", durationMinutes: 60 },
          { id: "vol1_cap3_t4", name: "Números irracionais", durationMinutes: 45 },
          { id: "vol1_cap3_t5", name: "Números reais", durationMinutes: 60 },
          { id: "vol1_cap3_t6", name: "Intervalos", durationMinutes: 30 },
        ],
      },
      {
        id: "vol1_cap4",
        name: "CAPÍTULO IV — Relações",
        topics: [
          { id: "vol1_cap4_t1", name: "Produto cartesiano", durationMinutes: 45 },
          { id: "vol1_cap4_t2", name: "Relação binária", durationMinutes: 60 },
          { id: "vol1_cap4_t3", name: "Domínio e imagem", durationMinutes: 45 },
          { id: "vol1_cap4_t4", name: "Relação inversa", durationMinutes: 30 },
        ],
      },
      {
        id: "vol1_cap5",
        name: "CAPÍTULO V — Introdução às funções",
        topics: [
          { id: "vol1_cap5_t1", name: "Conceito de função", durationMinutes: 60 },
          { id: "vol1_cap5_t2", name: "Domínio, contradomínio e imagem", durationMinutes: 60 },
          { id: "vol1_cap5_t3", name: "Função injetora, sobrejetora e bijetora", durationMinutes: 60 },
          { id: "vol1_cap5_t4", name: "Gráfico de funções", durationMinutes: 45 },
        ],
      },
      {
        id: "vol1_cap6",
        name: "CAPÍTULO VI — Função constante — Função afim",
        topics: [
          { id: "vol1_cap6_t1", name: "Função constante", durationMinutes: 30 },
          { id: "vol1_cap6_t2", name: "Função afim", durationMinutes: 60 },
          { id: "vol1_cap6_t3", name: "Gráfico da função afim", durationMinutes: 45 },
          { id: "vol1_cap6_t4", name: "Raiz da função afim", durationMinutes: 45 },
          { id: "vol1_cap6_t5", name: "Inequações do 1º grau", durationMinutes: 60 },
        ],
      },
      {
        id: "vol1_cap7",
        name: "CAPÍTULO VII — Funções quadráticas",
        topics: [
          { id: "vol1_cap7_t1", name: "Função quadrática", durationMinutes: 75 },
          { id: "vol1_cap7_t2", name: "Gráfico (parábola)", durationMinutes: 60 },
          { id: "vol1_cap7_t3", name: "Raízes", durationMinutes: 60 },
          { id: "vol1_cap7_t4", name: "Vértice", durationMinutes: 45 },
          { id: "vol1_cap7_t5", name: "Inequações do 2º grau", durationMinutes: 75 },
        ],
      },
      {
        id: "vol1_cap8",
        name: "CAPÍTULO VIII — Função modular",
        topics: [
          { id: "vol1_cap8_t1", name: "Módulo de um número real", durationMinutes: 45 },
          { id: "vol1_cap8_t2", name: "Função modular", durationMinutes: 60 },
          { id: "vol1_cap8_t3", name: "Gráfico da função modular", durationMinutes: 45 },
          { id: "vol1_cap8_t4", name: "Equações modulares", durationMinutes: 60 },
          { id: "vol1_cap8_t5", name: "Inequações modulares", durationMinutes: 60 },
        ],
      },
      {
        id: "vol1_cap9",
        name: "CAPÍTULO IX — Outras funções elementares",
        topics: [
          { id: "vol1_cap9_t1", name: "Função potência", durationMinutes: 45 },
          { id: "vol1_cap9_t2", name: "Função raiz", durationMinutes: 45 },
          { id: "vol1_cap9_t3", name: "Função recíproca", durationMinutes: 30 },
        ],
      },
      {
        id: "vol1_cap10",
        name: "CAPÍTULO X — Função composta — Função inversa",
        topics: [
          { id: "vol1_cap10_t1", name: "Composição de funções", durationMinutes: 75 },
          { id: "vol1_cap10_t2", name: "Função inversa", durationMinutes: 75 },
          { id: "vol1_cap10_t3", name: "Propriedades da função inversa", durationMinutes: 60 },
        ],
      },
      {
        id: "vol1_apen1",
        name: "APÊNDICE I — Equações irracionais",
        topics: [
          { id: "vol1_apen1_t1", name: "Resolução de equações irracionais", durationMinutes: 60 },
        ],
      },
      {
        id: "vol1_apen2",
        name: "APÊNDICE II — Inequações irracionais",
        topics: [
          { id: "vol1_apen2_t1", name: "Resolução de inequações irracionais", durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "vol2",
    number: 2,
    title: "Logaritmos",
    priority: "essential",
    chapters: [
      {
        id: "vol2_cap1",
        name: "CAPÍTULO I — Potências e raízes",
        topics: [
          { id: "vol2_cap1_t1", name: "Potência de expoente natural", durationMinutes: 45 },
          { id: "vol2_cap1_t2", name: "Potência de expoente inteiro", durationMinutes: 45 },
          { id: "vol2_cap1_t3", name: "Raiz enésima", durationMinutes: 60 },
          { id: "vol2_cap1_t4", name: "Potência de expoente racional", durationMinutes: 60 },
        ],
      },
      {
        id: "vol2_cap2",
        name: "CAPÍTULO II — Função exponencial",
        topics: [
          { id: "vol2_cap2_t1", name: "Definição", durationMinutes: 60 },
          { id: "vol2_cap2_t2", name: "Gráfico", durationMinutes: 45 },
          { id: "vol2_cap2_t3", name: "Propriedades", durationMinutes: 45 },
          { id: "vol2_cap2_t4", name: "Equações exponenciais", durationMinutes: 75 },
        ],
      },
      {
        id: "vol2_cap3",
        name: "CAPÍTULO III — Logaritmos",
        topics: [
          { id: "vol2_cap3_t1", name: "Definição", durationMinutes: 60 },
          { id: "vol2_cap3_t2", name: "Propriedades dos logaritmos", durationMinutes: 75 },
          { id: "vol2_cap3_t3", name: "Logaritmo decimal", durationMinutes: 45 },
          { id: "vol2_cap3_t4", name: "Logaritmo natural", durationMinutes: 45 },
        ],
      },
      {
        id: "vol2_cap4",
        name: "CAPÍTULO IV — Função logarítmica",
        topics: [
          { id: "vol2_cap4_t1", name: "Definição", durationMinutes: 60 },
          { id: "vol2_cap4_t2", name: "Gráfico", durationMinutes: 45 },
          { id: "vol2_cap4_t3", name: "Propriedades", durationMinutes: 45 },
          { id: "vol2_cap4_t4", name: "Relação com função exponencial", durationMinutes: 60 },
        ],
      },
      {
        id: "vol2_cap5",
        name: "CAPÍTULO V — Equações exponenciais e logarítmicas",
        topics: [
          { id: "vol2_cap5_t1", name: "Resolução de equações exponenciais", durationMinutes: 75 },
          { id: "vol2_cap5_t2", name: "Resolução de equações logarítmicas", durationMinutes: 75 },
        ],
      },
      {
        id: "vol2_cap6",
        name: "CAPÍTULO VI — Inequações exponenciais e logarítmicas",
        topics: [
          { id: "vol2_cap6_t1", name: "Inequações exponenciais", durationMinutes: 75 },
          { id: "vol2_cap6_t2", name: "Inequações logarítmicas", durationMinutes: 75 },
        ],
      },
      {
        id: "vol2_cap7",
        name: "CAPÍTULO VII — Logaritmos decimais",
        topics: [
          { id: "vol2_cap7_t1", name: "Mantissa e característica", durationMinutes: 45 },
          { id: "vol2_cap7_t2", name: "Aplicações", durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "vol3",
    number: 3,
    title: "Trigonometria",
    priority: "essential",
    chapters: [
      {
        id: "vol3_cap1",
        name: "CAPÍTULO I — Arcos e ângulos",
        topics: [
          { id: "vol3_cap1_t1", name: "Medida de arcos", durationMinutes: 60 },
          { id: "vol3_cap1_t2", name: "Conversão entre graus e radianos", durationMinutes: 45 },
        ],
      },
      {
        id: "vol3_cap2",
        name: "CAPÍTULO II — Funções trigonométricas",
        topics: [
          { id: "vol3_cap2_t1", name: "Seno, cosseno e tangente", durationMinutes: 75 },
          { id: "vol3_cap2_t2", name: "Gráficos das funções trigonométricas", durationMinutes: 60 },
        ],
      },
      {
        id: "vol3_cap3",
        name: "CAPÍTULO III — Identidades trigonométricas",
        topics: [
          { id: "vol3_cap3_t1", name: "Identidades fundamentais", durationMinutes: 75 },
          { id: "vol3_cap3_t2", name: "Fórmulas de adição e subtração", durationMinutes: 75 },
        ],
      },
      {
        id: "vol3_cap4",
        name: "CAPÍTULO IV — Equações trigonométricas",
        topics: [
          { id: "vol3_cap4_t1", name: "Resolução de equações trigonométricas", durationMinutes: 90 },
        ],
      },
    ],
  },
  {
    id: "vol4",
    number: 4,
    title: "Sequências, Progressão Aritmética e Progressão Geométrica",
    priority: "essential",
    chapters: [
      {
        id: "vol4_cap1",
        name: "CAPÍTULO I — Sequências",
        topics: [
          { id: "vol4_cap1_t1", name: "Conceito de sequência", durationMinutes: 45 },
          { id: "vol4_cap1_t2", name: "Sequências especiais", durationMinutes: 45 },
        ],
      },
      {
        id: "vol4_cap2",
        name: "CAPÍTULO II — Progressão Aritmética",
        topics: [
          { id: "vol4_cap2_t1", name: "Definição e termo geral", durationMinutes: 60 },
          { id: "vol4_cap2_t2", name: "Soma dos termos", durationMinutes: 60 },
          { id: "vol4_cap2_t3", name: "Propriedades", durationMinutes: 45 },
        ],
      },
      {
        id: "vol4_cap3",
        name: "CAPÍTULO III — Progressão Geométrica",
        topics: [
          { id: "vol4_cap3_t1", name: "Definição e termo geral", durationMinutes: 60 },
          { id: "vol4_cap3_t2", name: "Soma dos termos", durationMinutes: 60 },
          { id: "vol4_cap3_t3", name: "Série geométrica infinita", durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "vol5",
    number: 5,
    title: "Combinatória",
    priority: "important",
    chapters: [
      {
        id: "vol5_cap1",
        name: "CAPÍTULO I — Princípio fundamental da contagem",
        topics: [
          { id: "vol5_cap1_t1", name: "Princípio multiplicativo", durationMinutes: 60 },
          { id: "vol5_cap1_t2", name: "Princípio aditivo", durationMinutes: 45 },
        ],
      },
      {
        id: "vol5_cap2",
        name: "CAPÍTULO II — Permutações",
        topics: [
          { id: "vol5_cap2_t1", name: "Permutação simples", durationMinutes: 60 },
          { id: "vol5_cap2_t2", name: "Permutação com repetição", durationMinutes: 60 },
          { id: "vol5_cap2_t3", name: "Permutação circular", durationMinutes: 45 },
        ],
      },
      {
        id: "vol5_cap3",
        name: "CAPÍTULO III — Arranjos",
        topics: [
          { id: "vol5_cap3_t1", name: "Arranjo simples", durationMinutes: 60 },
          { id: "vol5_cap3_t2", name: "Arranjo com repetição", durationMinutes: 60 },
        ],
      },
      {
        id: "vol5_cap4",
        name: "CAPÍTULO IV — Combinações",
        topics: [
          { id: "vol5_cap4_t1", name: "Combinação simples", durationMinutes: 60 },
          { id: "vol5_cap4_t2", name: "Propriedades das combinações", durationMinutes: 45 },
          { id: "vol5_cap4_t3", name: "Binômio de Newton", durationMinutes: 75 },
        ],
      },
    ],
  },
  {
    id: "vol6",
    number: 6,
    title: "Probabilidade",
    priority: "important",
    chapters: [
      {
        id: "vol6_cap1",
        name: "CAPÍTULO I — Conceitos fundamentais",
        topics: [
          { id: "vol6_cap1_t1", name: "Espaço amostral e eventos", durationMinutes: 60 },
          { id: "vol6_cap1_t2", name: "Definição clássica de probabilidade", durationMinutes: 60 },
        ],
      },
      {
        id: "vol6_cap2",
        name: "CAPÍTULO II — Probabilidade condicional",
        topics: [
          { id: "vol6_cap2_t1", name: "Probabilidade condicional", durationMinutes: 75 },
          { id: "vol6_cap2_t2", name: "Eventos independentes", durationMinutes: 60 },
        ],
      },
      {
        id: "vol6_cap3",
        name: "CAPÍTULO III — Distribuição de probabilidade",
        topics: [
          { id: "vol6_cap3_t1", name: "Variável aleatória", durationMinutes: 60 },
          { id: "vol6_cap3_t2", name: "Distribuição binomial", durationMinutes: 75 },
        ],
      },
    ],
  },
  {
    id: "vol7",
    number: 7,
    title: "Geometria Analítica",
    priority: "important",
    chapters: [
      {
        id: "vol7_cap1",
        name: "CAPÍTULO I — Coordenadas cartesianas",
        topics: [
          { id: "vol7_cap1_t1", name: "Distância entre pontos", durationMinutes: 45 },
          { id: "vol7_cap1_t2", name: "Ponto médio", durationMinutes: 30 },
        ],
      },
      {
        id: "vol7_cap2",
        name: "CAPÍTULO II — Reta",
        topics: [
          { id: "vol7_cap2_t1", name: "Equação da reta", durationMinutes: 75 },
          { id: "vol7_cap2_t2", name: "Posições relativas de retas", durationMinutes: 60 },
          { id: "vol7_cap2_t3", name: "Distância de ponto a reta", durationMinutes: 60 },
        ],
      },
      {
        id: "vol7_cap3",
        name: "CAPÍTULO III — Circunferência",
        topics: [
          { id: "vol7_cap3_t1", name: "Equação da circunferência", durationMinutes: 60 },
          { id: "vol7_cap3_t2", name: "Posições relativas", durationMinutes: 60 },
        ],
      },
      {
        id: "vol7_cap4",
        name: "CAPÍTULO IV — Cônicas",
        topics: [
          { id: "vol7_cap4_t1", name: "Elipse", durationMinutes: 75 },
          { id: "vol7_cap4_t2", name: "Hipérbole", durationMinutes: 75 },
          { id: "vol7_cap4_t3", name: "Parábola", durationMinutes: 75 },
        ],
      },
    ],
  },
  {
    id: "vol8",
    number: 8,
    title: "Limites, Derivadas e Integrais",
    priority: "complementary",
    chapters: [
      {
        id: "vol8_cap1",
        name: "CAPÍTULO I — Limites",
        topics: [
          { id: "vol8_cap1_t1", name: "Conceito de limite", durationMinutes: 90 },
          { id: "vol8_cap1_t2", name: "Propriedades de limites", durationMinutes: 75 },
        ],
      },
      {
        id: "vol8_cap2",
        name: "CAPÍTULO II — Derivadas",
        topics: [
          { id: "vol8_cap2_t1", name: "Definição de derivada", durationMinutes: 90 },
          { id: "vol8_cap2_t2", name: "Regras de derivação", durationMinutes: 90 },
          { id: "vol8_cap2_t3", name: "Aplicações de derivadas", durationMinutes: 90 },
        ],
      },
      {
        id: "vol8_cap3",
        name: "CAPÍTULO III — Integrais",
        topics: [
          { id: "vol8_cap3_t1", name: "Integral indefinida", durationMinutes: 90 },
          { id: "vol8_cap3_t2", name: "Integral definida", durationMinutes: 90 },
          { id: "vol8_cap3_t3", name: "Aplicações de integrais", durationMinutes: 90 },
        ],
      },
    ],
  },
  {
    id: "vol9",
    number: 9,
    title: "Geometria Plana",
    priority: "complementary",
    chapters: [
      {
        id: "vol9_cap1",
        name: "CAPÍTULO I — Conceitos fundamentais",
        topics: [
          { id: "vol9_cap1_t1", name: "Pontos, retas e planos", durationMinutes: 45 },
          { id: "vol9_cap1_t2", name: "Ângulos", durationMinutes: 60 },
        ],
      },
      {
        id: "vol9_cap2",
        name: "CAPÍTULO II — Polígonos",
        topics: [
          { id: "vol9_cap2_t1", name: "Triângulos", durationMinutes: 75 },
          { id: "vol9_cap2_t2", name: "Quadriláteros", durationMinutes: 60 },
          { id: "vol9_cap2_t3", name: "Polígonos regulares", durationMinutes: 60 },
        ],
      },
      {
        id: "vol9_cap3",
        name: "CAPÍTULO III — Círculo e circunferência",
        topics: [
          { id: "vol9_cap3_t1", name: "Propriedades do círculo", durationMinutes: 60 },
          { id: "vol9_cap3_t2", name: "Áreas e perímetros", durationMinutes: 75 },
        ],
      },
    ],
  },
  {
    id: "vol10",
    number: 10,
    title: "Geometria Espacial",
    priority: "complementary",
    chapters: [
      {
        id: "vol10_cap1",
        name: "CAPÍTULO I — Conceitos fundamentais",
        topics: [
          { id: "vol10_cap1_t1", name: "Posições relativas no espaço", durationMinutes: 60 },
          { id: "vol10_cap1_t2", name: "Ângulos no espaço", durationMinutes: 60 },
        ],
      },
      {
        id: "vol10_cap2",
        name: "CAPÍTULO II — Poliedros",
        topics: [
          { id: "vol10_cap2_t1", name: "Prismas", durationMinutes: 75 },
          { id: "vol10_cap2_t2", name: "Pirâmides", durationMinutes: 75 },
          { id: "vol10_cap2_t3", name: "Poliedros regulares", durationMinutes: 60 },
        ],
      },
      {
        id: "vol10_cap3",
        name: "CAPÍTULO III — Corpos redondos",
        topics: [
          { id: "vol10_cap3_t1", name: "Cilindro", durationMinutes: 60 },
          { id: "vol10_cap3_t2", name: "Cone", durationMinutes: 60 },
          { id: "vol10_cap3_t3", name: "Esfera", durationMinutes: 60 },
        ],
      },
    ],
  },
  {
    id: "vol11",
    number: 11,
    title: "Matemática Comercial e Financeira",
    priority: "complementary",
    chapters: [
      {
        id: "vol11_cap1",
        name: "CAPÍTULO I — Porcentagem",
        topics: [
          { id: "vol11_cap1_t1", name: "Conceitos e aplicações", durationMinutes: 60 },
          { id: "vol11_cap1_t2", name: "Aumentos e descontos", durationMinutes: 60 },
        ],
      },
      {
        id: "vol11_cap2",
        name: "CAPÍTULO II — Juros simples",
        topics: [
          { id: "vol11_cap2_t1", name: "Conceito e fórmulas", durationMinutes: 75 },
          { id: "vol11_cap2_t2", name: "Aplicações", durationMinutes: 60 },
        ],
      },
      {
        id: "vol11_cap3",
        name: "CAPÍTULO III — Juros compostos",
        topics: [
          { id: "vol11_cap3_t1", name: "Conceito e fórmulas", durationMinutes: 75 },
          { id: "vol11_cap3_t2", name: "Aplicações", durationMinutes: 75 },
        ],
      },
    ],
  },
];

export function getTopicsByVolume(volumeId: string): Topic[] {
  const volume = fmeVolumes.find(v => v.id === volumeId);
  if (!volume) return [];
  
  const topics: Topic[] = [];
  volume.chapters.forEach(chapter => {
    topics.push(...chapter.topics);
  });
  return topics;
}

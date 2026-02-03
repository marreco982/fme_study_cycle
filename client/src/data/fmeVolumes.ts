export interface Topic {
  id: string;
  name: string;
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
  description: string;
  priority: "essential" | "important" | "complementary";
  chapters: Chapter[];
  topics: Topic[];
}

export const fmeVolumes: Volume[] = [
  {
    id: "vol1",
    number: 1,
    title: "Conjuntos e Funções",
    description: "Fundamentos de conjuntos e funções reais",
    priority: "essential",
    chapters: [
      {
        id: "vol1_cap1",
        name: "CAPÍTULO I — Noções de lógica",
        topics: [
          { id: "vol1_cap1_t1", name: "Proposições" },
          { id: "vol1_cap1_t2", name: "Operações lógicas" },
          { id: "vol1_cap1_t3", name: "Tabelas-verdade" },
        ],
      },
      {
        id: "vol1_cap2",
        name: "CAPÍTULO II — Conjuntos",
        topics: [
          { id: "vol1_cap2_t1", name: "Conceito de conjunto" },
          { id: "vol1_cap2_t2", name: "Relação de pertinência" },
          { id: "vol1_cap2_t3", name: "Igualdade de conjuntos" },
          { id: "vol1_cap2_t4", name: "Subconjuntos" },
          { id: "vol1_cap2_t5", name: "Operações com conjuntos" },
        ],
      },
      {
        id: "vol1_cap3",
        name: "CAPÍTULO III — Conjuntos numéricos",
        topics: [
          { id: "vol1_cap3_t1", name: "Números naturais" },
          { id: "vol1_cap3_t2", name: "Números inteiros" },
          { id: "vol1_cap3_t3", name: "Números racionais" },
          { id: "vol1_cap3_t4", name: "Números irracionais" },
          { id: "vol1_cap3_t5", name: "Números reais" },
          { id: "vol1_cap3_t6", name: "Intervalos" },
        ],
      },
      {
        id: "vol1_cap4",
        name: "CAPÍTULO IV — Relações",
        topics: [
          { id: "vol1_cap4_t1", name: "Produto cartesiano" },
          { id: "vol1_cap4_t2", name: "Relação binária" },
          { id: "vol1_cap4_t3", name: "Domínio e imagem" },
          { id: "vol1_cap4_t4", name: "Relação inversa" },
        ],
      },
      {
        id: "vol1_cap5",
        name: "CAPÍTULO V — Introdução às funções",
        topics: [
          { id: "vol1_cap5_t1", name: "Conceito de função" },
          { id: "vol1_cap5_t2", name: "Domínio, contradomínio e imagem" },
          { id: "vol1_cap5_t3", name: "Função injetora, sobrejetora e bijetora" },
          { id: "vol1_cap5_t4", name: "Gráfico de funções" },
        ],
      },
      {
        id: "vol1_cap6",
        name: "CAPÍTULO VI — Função constante — Função afim",
        topics: [
          { id: "vol1_cap6_t1", name: "Função constante" },
          { id: "vol1_cap6_t2", name: "Função afim" },
          { id: "vol1_cap6_t3", name: "Gráfico da função afim" },
          { id: "vol1_cap6_t4", name: "Raiz da função afim" },
          { id: "vol1_cap6_t5", name: "Inequações do 1º grau" },
        ],
      },
      {
        id: "vol1_cap7",
        name: "CAPÍTULO VII — Funções quadráticas",
        topics: [
          { id: "vol1_cap7_t1", name: "Função quadrática" },
          { id: "vol1_cap7_t2", name: "Gráfico (parábola)" },
          { id: "vol1_cap7_t3", name: "Raízes" },
          { id: "vol1_cap7_t4", name: "Vértice" },
          { id: "vol1_cap7_t5", name: "Inequações do 2º grau" },
        ],
      },
      {
        id: "vol1_cap8",
        name: "CAPÍTULO VIII — Função modular",
        topics: [
          { id: "vol1_cap8_t1", name: "Módulo de um número real" },
          { id: "vol1_cap8_t2", name: "Função modular" },
          { id: "vol1_cap8_t3", name: "Gráfico da função modular" },
          { id: "vol1_cap8_t4", name: "Equações modulares" },
          { id: "vol1_cap8_t5", name: "Inequações modulares" },
        ],
      },
      {
        id: "vol1_cap9",
        name: "CAPÍTULO IX — Outras funções elementares",
        topics: [
          { id: "vol1_cap9_t1", name: "Função potência" },
          { id: "vol1_cap9_t2", name: "Função raiz" },
          { id: "vol1_cap9_t3", name: "Função recíproca" },
        ],
      },
      {
        id: "vol1_cap10",
        name: "CAPÍTULO X — Função composta — Função inversa",
        topics: [
          { id: "vol1_cap10_t1", name: "Composição de funções" },
          { id: "vol1_cap10_t2", name: "Função inversa" },
          { id: "vol1_cap10_t3", name: "Propriedades da função inversa" },
        ],
      },
      {
        id: "vol1_apen1",
        name: "APÊNDICE I — Equações irracionais",
        topics: [
          { id: "vol1_apen1_t1", name: "Resolução de equações irracionais" },
        ],
      },
      {
        id: "vol1_apen2",
        name: "APÊNDICE II — Inequações irracionais",
        topics: [
          { id: "vol1_apen2_t1", name: "Resolução de inequações irracionais" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol2",
    number: 2,
    title: "Logaritmos",
    description: "Logaritmos e exponenciais",
    priority: "essential",
    chapters: [
      {
        id: "vol2_cap1",
        name: "CAPÍTULO I — Potências e raízes",
        topics: [
          { id: "vol2_cap1_t1", name: "Potência de expoente natural" },
          { id: "vol2_cap1_t2", name: "Potência de expoente inteiro" },
          { id: "vol2_cap1_t3", name: "Raiz enésima" },
          { id: "vol2_cap1_t4", name: "Potência de expoente racional" },
        ],
      },
      {
        id: "vol2_cap2",
        name: "CAPÍTULO II — Função exponencial",
        topics: [
          { id: "vol2_cap2_t1", name: "Definição" },
          { id: "vol2_cap2_t2", name: "Gráfico" },
          { id: "vol2_cap2_t3", name: "Propriedades" },
          { id: "vol2_cap2_t4", name: "Equações exponenciais" },
        ],
      },
      {
        id: "vol2_cap3",
        name: "CAPÍTULO III — Logaritmos",
        topics: [
          { id: "vol2_cap3_t1", name: "Definição" },
          { id: "vol2_cap3_t2", name: "Propriedades dos logaritmos" },
          { id: "vol2_cap3_t3", name: "Logaritmo decimal" },
          { id: "vol2_cap3_t4", name: "Logaritmo natural" },
        ],
      },
      {
        id: "vol2_cap4",
        name: "CAPÍTULO IV — Função logarítmica",
        topics: [
          { id: "vol2_cap4_t1", name: "Definição" },
          { id: "vol2_cap4_t2", name: "Gráfico" },
          { id: "vol2_cap4_t3", name: "Propriedades" },
          { id: "vol2_cap4_t4", name: "Relação com função exponencial" },
        ],
      },
      {
        id: "vol2_cap5",
        name: "CAPÍTULO V — Equações exponenciais e logarítmicas",
        topics: [
          { id: "vol2_cap5_t1", name: "Resolução de equações exponenciais" },
          { id: "vol2_cap5_t2", name: "Resolução de equações logarítmicas" },
        ],
      },
      {
        id: "vol2_cap6",
        name: "CAPÍTULO VI — Inequações exponenciais e logarítmicas",
        topics: [
          { id: "vol2_cap6_t1", name: "Inequações exponenciais" },
          { id: "vol2_cap6_t2", name: "Inequações logarítmicas" },
        ],
      },
      {
        id: "vol2_cap7",
        name: "CAPÍTULO VII — Logaritmos decimais",
        topics: [
          { id: "vol2_cap7_t1", name: "Mantissa e característica" },
          { id: "vol2_cap7_t2", name: "Aplicações" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol3",
    number: 3,
    title: "Trigonometria",
    description: "Trigonometria no triângulo retângulo e círculo trigonométrico",
    priority: "essential",
    chapters: [
      {
        id: "vol3_cap1",
        name: "Capítulo I - Arcos e Ângulos",
        topics: [
          { id: "vol3_cap1_t1", name: "Medida de arcos" },
          { id: "vol3_cap1_t2", name: "Medida de ângulos" },
          { id: "vol3_cap1_t3", name: "Conversão entre unidades" },
        ],
      },
      {
        id: "vol3_cap2",
        name: "Capítulo II - Trigonometria no Triângulo Retângulo",
        topics: [
          { id: "vol3_cap2_t1", name: "Seno, cosseno e tangente" },
          { id: "vol3_cap2_t2", name: "Relações trigonométricas" },
          { id: "vol3_cap2_t3", name: "Ângulos notáveis" },
        ],
      },
      {
        id: "vol3_cap3",
        name: "Capítulo III - Círculo Trigonométrico",
        topics: [
          { id: "vol3_cap3_t1", name: "Definição" },
          { id: "vol3_cap3_t2", name: "Seno, cosseno e tangente no círculo" },
          { id: "vol3_cap3_t3", name: "Funções trigonométricas" },
        ],
      },
      {
        id: "vol3_cap4",
        name: "Capítulo IV - Funções Trigonométricas",
        topics: [
          { id: "vol3_cap4_t1", name: "Função seno" },
          { id: "vol3_cap4_t2", name: "Função cosseno" },
          { id: "vol3_cap4_t3", name: "Função tangente" },
          { id: "vol3_cap4_t4", name: "Gráficos e propriedades" },
        ],
      },
      {
        id: "vol3_cap5",
        name: "Capítulo V - Identidades Trigonométricas",
        topics: [
          { id: "vol3_cap5_t1", name: "Identidades fundamentais" },
          { id: "vol3_cap5_t2", name: "Fórmulas de adição" },
          { id: "vol3_cap5_t3", name: "Fórmulas de multiplicação" },
        ],
      },
      {
        id: "vol3_cap6",
        name: "Capítulo VI - Equações Trigonométricas",
        topics: [
          { id: "vol3_cap6_t1", name: "Equações simples" },
          { id: "vol3_cap6_t2", name: "Equações compostas" },
        ],
      },
      {
        id: "vol3_cap7",
        name: "Capítulo VII - Inequações Trigonométricas",
        topics: [
          { id: "vol3_cap7_t1", name: "Resolução de inequações" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol4",
    number: 4,
    title: "Sequências",
    description: "Progressões aritmética e geométrica",
    priority: "important",
    chapters: [
      {
        id: "vol4_cap1",
        name: "Capítulo I - Sequências",
        topics: [
          { id: "vol4_cap1_t1", name: "Conceito de sequência" },
          { id: "vol4_cap1_t2", name: "Sequências numéricas" },
        ],
      },
      {
        id: "vol4_cap2",
        name: "Capítulo II - Progressão Aritmética (PA)",
        topics: [
          { id: "vol4_cap2_t1", name: "Definição" },
          { id: "vol4_cap2_t2", name: "Termo geral" },
          { id: "vol4_cap2_t3", name: "Soma dos termos" },
          { id: "vol4_cap2_t4", name: "Propriedades" },
        ],
      },
      {
        id: "vol4_cap3",
        name: "Capítulo III - Progressão Geométrica (PG)",
        topics: [
          { id: "vol4_cap3_t1", name: "Definição" },
          { id: "vol4_cap3_t2", name: "Termo geral" },
          { id: "vol4_cap3_t3", name: "Soma dos termos" },
          { id: "vol4_cap3_t4", name: "Série geométrica" },
        ],
      },
      {
        id: "vol4_cap4",
        name: "Capítulo IV - Matrizes",
        topics: [
          { id: "vol4_cap4_t1", name: "Conceito" },
          { id: "vol4_cap4_t2", name: "Tipos de matrizes" },
          { id: "vol4_cap4_t3", name: "Operações com matrizes" },
          { id: "vol4_cap4_t4", name: "Matriz inversa" },
        ],
      },
      {
        id: "vol4_cap5",
        name: "Capítulo V - Determinantes",
        topics: [
          { id: "vol4_cap5_t1", name: "Determinante de ordem 2" },
          { id: "vol4_cap5_t2", name: "Determinante de ordem 3" },
          { id: "vol4_cap5_t3", name: "Propriedades" },
          { id: "vol4_cap5_t4", name: "Regra de Sarrus" },
        ],
      },
      {
        id: "vol4_cap6",
        name: "Capítulo VI - Sistemas Lineares",
        topics: [
          { id: "vol4_cap6_t1", name: "Equação linear" },
          { id: "vol4_cap6_t2", name: "Sistema de equações lineares" },
          { id: "vol4_cap6_t3", name: "Resolução de sistemas" },
          { id: "vol4_cap6_t4", name: "Regra de Cramer" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol5",
    number: 5,
    title: "Combinatória",
    description: "Análise combinatória e contagem",
    priority: "important",
    chapters: [
      {
        id: "vol5_cap1",
        name: "Capítulo I - Princípio Fundamental da Contagem",
        topics: [
          { id: "vol5_cap1_t1", name: "Princípio multiplicativo" },
          { id: "vol5_cap1_t2", name: "Princípio aditivo" },
        ],
      },
      {
        id: "vol5_cap2",
        name: "Capítulo II - Fatorial",
        topics: [
          { id: "vol5_cap2_t1", name: "Definição" },
          { id: "vol5_cap2_t2", name: "Propriedades" },
        ],
      },
      {
        id: "vol5_cap3",
        name: "Capítulo III - Arranjos",
        topics: [
          { id: "vol5_cap3_t1", name: "Arranjo simples" },
          { id: "vol5_cap3_t2", name: "Arranjo com repetição" },
        ],
      },
      {
        id: "vol5_cap4",
        name: "Capítulo IV - Permutações",
        topics: [
          { id: "vol5_cap4_t1", name: "Permutação simples" },
          { id: "vol5_cap4_t2", name: "Permutação com repetição" },
          { id: "vol5_cap4_t3", name: "Permutação circular" },
        ],
      },
      {
        id: "vol5_cap5",
        name: "Capítulo V - Combinações",
        topics: [
          { id: "vol5_cap5_t1", name: "Combinação simples" },
          { id: "vol5_cap5_t2", name: "Combinação com repetição" },
          { id: "vol5_cap5_t3", name: "Propriedades" },
        ],
      },
      {
        id: "vol5_cap6",
        name: "Capítulo VI - Binômio de Newton",
        topics: [
          { id: "vol5_cap6_t1", name: "Desenvolvimento" },
          { id: "vol5_cap6_t2", name: "Termo geral" },
          { id: "vol5_cap6_t3", name: "Propriedades" },
        ],
      },
      {
        id: "vol5_cap7",
        name: "Capítulo VII - Triângulo de Pascal",
        topics: [
          { id: "vol5_cap7_t1", name: "Construção" },
          { id: "vol5_cap7_t2", name: "Propriedades" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol6",
    number: 6,
    title: "Probabilidade",
    description: "Teoria da probabilidade",
    priority: "important",
    chapters: [
      {
        id: "vol6_cap1",
        name: "Capítulo I - Espaço Amostral e Evento",
        topics: [
          { id: "vol6_cap1_t1", name: "Conceitos básicos" },
          { id: "vol6_cap1_t2", name: "Tipos de eventos" },
        ],
      },
      {
        id: "vol6_cap2",
        name: "Capítulo II - Probabilidade",
        topics: [
          { id: "vol6_cap2_t1", name: "Definição clássica" },
          { id: "vol6_cap2_t2", name: "Propriedades" },
          { id: "vol6_cap2_t3", name: "Probabilidade condicional" },
        ],
      },
      {
        id: "vol6_cap3",
        name: "Capítulo III - Eventos Independentes",
        topics: [
          { id: "vol6_cap3_t1", name: "Definição" },
          { id: "vol6_cap3_t2", name: "Probabilidade de eventos independentes" },
        ],
      },
      {
        id: "vol6_cap4",
        name: "Capítulo IV - Teorema de Bayes",
        topics: [
          { id: "vol6_cap4_t1", name: "Enunciado" },
          { id: "vol6_cap4_t2", name: "Aplicações" },
        ],
      },
      {
        id: "vol6_cap5",
        name: "Capítulo V - Distribuição de Probabilidade",
        topics: [
          { id: "vol6_cap5_t1", name: "Variável aleatória" },
          { id: "vol6_cap5_t2", name: "Distribuição binomial" },
          { id: "vol6_cap5_t3", name: "Distribuição normal" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol7",
    number: 7,
    title: "Estatística",
    description: "Estatística descritiva",
    priority: "important",
    chapters: [
      {
        id: "vol7_cap1",
        name: "Capítulo I - Conceitos Básicos",
        topics: [
          { id: "vol7_cap1_t1", name: "População e amostra" },
          { id: "vol7_cap1_t2", name: "Variáveis estatísticas" },
        ],
      },
      {
        id: "vol7_cap2",
        name: "Capítulo II - Organização de Dados",
        topics: [
          { id: "vol7_cap2_t1", name: "Tabelas de frequência" },
          { id: "vol7_cap2_t2", name: "Gráficos" },
        ],
      },
      {
        id: "vol7_cap3",
        name: "Capítulo III - Medidas de Posição",
        topics: [
          { id: "vol7_cap3_t1", name: "Média" },
          { id: "vol7_cap3_t2", name: "Mediana" },
          { id: "vol7_cap3_t3", name: "Moda" },
          { id: "vol7_cap3_t4", name: "Quartis" },
        ],
      },
      {
        id: "vol7_cap4",
        name: "Capítulo IV - Medidas de Dispersão",
        topics: [
          { id: "vol7_cap4_t1", name: "Amplitude" },
          { id: "vol7_cap4_t2", name: "Variância" },
          { id: "vol7_cap4_t3", name: "Desvio padrão" },
          { id: "vol7_cap4_t4", name: "Coeficiente de variação" },
        ],
      },
      {
        id: "vol7_cap5",
        name: "Capítulo V - Correlação e Regressão",
        topics: [
          { id: "vol7_cap5_t1", name: "Correlação linear" },
          { id: "vol7_cap5_t2", name: "Regressão linear" },
          { id: "vol7_cap5_t3", name: "Coeficiente de correlação" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol8",
    number: 8,
    title: "Limites",
    description: "Limites e continuidade",
    priority: "complementary",
    chapters: [
      {
        id: "vol8_cap1",
        name: "Capítulo I - Limite",
        topics: [
          { id: "vol8_cap1_t1", name: "Conceito intuitivo" },
          { id: "vol8_cap1_t2", name: "Definição formal" },
          { id: "vol8_cap1_t3", name: "Propriedades" },
          { id: "vol8_cap1_t4", name: "Limites infinitos" },
        ],
      },
      {
        id: "vol8_cap2",
        name: "Capítulo II - Continuidade",
        topics: [
          { id: "vol8_cap2_t1", name: "Definição" },
          { id: "vol8_cap2_t2", name: "Propriedades" },
        ],
      },
      {
        id: "vol8_cap3",
        name: "Capítulo III - Derivada",
        topics: [
          { id: "vol8_cap3_t1", name: "Conceito" },
          { id: "vol8_cap3_t2", name: "Interpretação geométrica" },
          { id: "vol8_cap3_t3", name: "Regras de derivação" },
          { id: "vol8_cap3_t4", name: "Derivada de funções compostas" },
        ],
      },
      {
        id: "vol8_cap4",
        name: "Capítulo IV - Aplicações da Derivada",
        topics: [
          { id: "vol8_cap4_t1", name: "Máximos e mínimos" },
          { id: "vol8_cap4_t2", name: "Crescimento e decrescimento" },
          { id: "vol8_cap4_t3", name: "Concavidade" },
        ],
      },
      {
        id: "vol8_cap5",
        name: "Capítulo V - Integral",
        topics: [
          { id: "vol8_cap5_t1", name: "Conceito" },
          { id: "vol8_cap5_t2", name: "Integral indefinida" },
          { id: "vol8_cap5_t3", name: "Integral definida" },
          { id: "vol8_cap5_t4", name: "Aplicações" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol9",
    number: 9,
    title: "Geometria Plana",
    description: "Geometria plana",
    priority: "essential",
    chapters: [
      {
        id: "vol9_cap1",
        name: "Capítulo I - Conceitos Fundamentais",
        topics: [
          { id: "vol9_cap1_t1", name: "Ponto, reta e plano" },
          { id: "vol9_cap1_t2", name: "Ângulos" },
        ],
      },
      {
        id: "vol9_cap2",
        name: "Capítulo II - Triângulos",
        topics: [
          { id: "vol9_cap2_t1", name: "Classificação" },
          { id: "vol9_cap2_t2", name: "Congruência" },
          { id: "vol9_cap2_t3", name: "Semelhança" },
          { id: "vol9_cap2_t4", name: "Teorema de Pitágoras" },
        ],
      },
      {
        id: "vol9_cap3",
        name: "Capítulo III - Quadriláteros",
        topics: [
          { id: "vol9_cap3_t1", name: "Classificação" },
          { id: "vol9_cap3_t2", name: "Propriedades" },
        ],
      },
      {
        id: "vol9_cap4",
        name: "Capítulo IV - Polígonos",
        topics: [
          { id: "vol9_cap4_t1", name: "Polígonos regulares" },
          { id: "vol9_cap4_t2", name: "Ângulos internos e externos" },
        ],
      },
      {
        id: "vol9_cap5",
        name: "Capítulo V - Circunferência",
        topics: [
          { id: "vol9_cap5_t1", name: "Elementos" },
          { id: "vol9_cap5_t2", name: "Ângulos na circunferência" },
          { id: "vol9_cap5_t3", name: "Potência de um ponto" },
        ],
      },
      {
        id: "vol9_cap6",
        name: "Capítulo VI - Áreas",
        topics: [
          { id: "vol9_cap6_t1", name: "Área de triângulos" },
          { id: "vol9_cap6_t2", name: "Área de quadriláteros" },
          { id: "vol9_cap6_t3", name: "Área de polígonos" },
          { id: "vol9_cap6_t4", name: "Área de círculo" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol10",
    number: 10,
    title: "Geometria Espacial",
    description: "Geometria espacial",
    priority: "complementary",
    chapters: [
      {
        id: "vol10_cap1",
        name: "Capítulo I - Conceitos Fundamentais",
        topics: [
          { id: "vol10_cap1_t1", name: "Posição relativa de retas e planos" },
          { id: "vol10_cap1_t2", name: "Ângulos no espaço" },
        ],
      },
      {
        id: "vol10_cap2",
        name: "Capítulo II - Poliedros",
        topics: [
          { id: "vol10_cap2_t1", name: "Definição" },
          { id: "vol10_cap2_t2", name: "Poliedros regulares" },
          { id: "vol10_cap2_t3", name: "Relação de Euler" },
        ],
      },
      {
        id: "vol10_cap3",
        name: "Capítulo III - Prismas",
        topics: [
          { id: "vol10_cap3_t1", name: "Definição" },
          { id: "vol10_cap3_t2", name: "Tipos" },
          { id: "vol10_cap3_t3", name: "Área e volume" },
        ],
      },
      {
        id: "vol10_cap4",
        name: "Capítulo IV - Pirâmides",
        topics: [
          { id: "vol10_cap4_t1", name: "Definição" },
          { id: "vol10_cap4_t2", name: "Tipos" },
          { id: "vol10_cap4_t3", name: "Área e volume" },
        ],
      },
      {
        id: "vol10_cap5",
        name: "Capítulo V - Cilindros",
        topics: [
          { id: "vol10_cap5_t1", name: "Definição" },
          { id: "vol10_cap5_t2", name: "Área e volume" },
        ],
      },
      {
        id: "vol10_cap6",
        name: "Capítulo VI - Cones",
        topics: [
          { id: "vol10_cap6_t1", name: "Definição" },
          { id: "vol10_cap6_t2", name: "Área e volume" },
        ],
      },
      {
        id: "vol10_cap7",
        name: "Capítulo VII - Esferas",
        topics: [
          { id: "vol10_cap7_t1", name: "Definição" },
          { id: "vol10_cap7_t2", name: "Área e volume" },
        ],
      },
    ],
    topics: [],
  },
  {
    id: "vol11",
    number: 11,
    title: "Geometria",
    description: "Matemática comercial, financeira e estatística",
    priority: "complementary",
    chapters: [
      {
        id: "vol11_cap1",
        name: "Capítulo I - Razão e Proporção",
        topics: [
          { id: "vol11_cap1_t1", name: "Razão" },
          { id: "vol11_cap1_t2", name: "Proporção" },
          { id: "vol11_cap1_t3", name: "Propriedades" },
        ],
      },
      {
        id: "vol11_cap2",
        name: "Capítulo II - Porcentagem",
        topics: [
          { id: "vol11_cap2_t1", name: "Conceito" },
          { id: "vol11_cap2_t2", name: "Aplicações" },
          { id: "vol11_cap2_t3", name: "Variação percentual" },
        ],
      },
      {
        id: "vol11_cap3",
        name: "Capítulo III - Juros Simples",
        topics: [
          { id: "vol11_cap3_t1", name: "Conceito" },
          { id: "vol11_cap3_t2", name: "Fórmulas" },
          { id: "vol11_cap3_t3", name: "Aplicações" },
        ],
      },
      {
        id: "vol11_cap4",
        name: "Capítulo IV - Juros Compostos",
        topics: [
          { id: "vol11_cap4_t1", name: "Conceito" },
          { id: "vol11_cap4_t2", name: "Fórmulas" },
          { id: "vol11_cap4_t3", name: "Aplicações" },
        ],
      },
      {
        id: "vol11_cap5",
        name: "Capítulo V - Desconto",
        topics: [
          { id: "vol11_cap5_t1", name: "Desconto simples" },
          { id: "vol11_cap5_t2", name: "Desconto composto" },
        ],
      },
      {
        id: "vol11_cap6",
        name: "Capítulo VI - Anuidades",
        topics: [
          { id: "vol11_cap6_t1", name: "Conceito" },
          { id: "vol11_cap6_t2", name: "Tipos" },
          { id: "vol11_cap6_t3", name: "Cálculos" },
        ],
      },
      {
        id: "vol11_cap7",
        name: "Capítulo VII - Estatística Descritiva",
        topics: [
          { id: "vol11_cap7_t1", name: "Conceitos básicos" },
          { id: "vol11_cap7_t2", name: "Medidas de posição e dispersão" },
          { id: "vol11_cap7_t3", name: "Gráficos" },
        ],
      },
    ],
    topics: [],
  },
];

export function getTopicsByVolume(volumeId: string): Topic[] {
  const volume = fmeVolumes.find((v) => v.id === volumeId);
  if (!volume) return [];

  const allTopics: Topic[] = [];
  volume.chapters.forEach((chapter) => {
    allTopics.push(...chapter.topics);
  });
  return allTopics;
}

export function getChaptersByVolume(volumeId: string): Chapter[] {
  const volume = fmeVolumes.find((v) => v.id === volumeId);
  return volume?.chapters || [];
}

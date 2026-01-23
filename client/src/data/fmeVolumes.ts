export interface Topic {
  id: string;
  name: string;
  description?: string;
}

export interface Volume {
  id: string;
  number: number;
  title: string;
  description: string;
  priority: "essential" | "important" | "complementary";
  topics: Topic[];
}

export const fmeVolumes: Volume[] = [
  {
    id: "vol1",
    number: 1,
    title: "Conjuntos e Funções",
    description: "Fundamentos de conjuntos e funções reais",
    priority: "essential",
    topics: [
      { id: "vol1-1", name: "Conjuntos" },
      { id: "vol1-2", name: "Operações com Conjuntos" },
      { id: "vol1-3", name: "Relações" },
      { id: "vol1-4", name: "Funções" },
      { id: "vol1-5", name: "Tipos de Funções" },
      { id: "vol1-6", name: "Função Composta" },
      { id: "vol1-7", name: "Função Inversa" },
      { id: "vol1-8", name: "Funções Polinomiais" },
      { id: "vol1-9", name: "Funções Racionais" },
      { id: "vol1-10", name: "Inequações" },
    ],
  },
  {
    id: "vol2",
    number: 2,
    title: "Logaritmos",
    description: "Logaritmos e exponenciais",
    priority: "essential",
    topics: [
      { id: "vol2-1", name: "Potências e Raízes" },
      { id: "vol2-2", name: "Função Exponencial" },
      { id: "vol2-3", name: "Equações Exponenciais" },
      { id: "vol2-4", name: "Logaritmos - Definição" },
      { id: "vol2-5", name: "Propriedades dos Logaritmos" },
      { id: "vol2-6", name: "Mudança de Base" },
      { id: "vol2-7", name: "Função Logarítmica" },
      { id: "vol2-8", name: "Equações Logarítmicas" },
      { id: "vol2-9", name: "Inequações Exponenciais e Logarítmicas" },
      { id: "vol2-10", name: "Aplicações de Logaritmos" },
    ],
  },
  {
    id: "vol3",
    number: 3,
    title: "Trigonometria",
    description: "Trigonometria no triângulo retângulo e círculo trigonométrico",
    priority: "essential",
    topics: [
      { id: "vol3-1", name: "Trigonometria no Triângulo Retângulo" },
      { id: "vol3-2", name: "Razões Trigonométricas" },
      { id: "vol3-3", name: "Ângulos Notáveis" },
      { id: "vol3-4", name: "Círculo Trigonométrico" },
      { id: "vol3-5", name: "Funções Trigonométricas" },
      { id: "vol3-6", name: "Gráficos de Funções Trigonométricas" },
      { id: "vol3-7", name: "Identidades Trigonométricas" },
      { id: "vol3-8", name: "Equações Trigonométricas" },
      { id: "vol3-9", name: "Inequações Trigonométricas" },
      { id: "vol3-10", name: "Aplicações da Trigonometria" },
    ],
  },
  {
    id: "vol4",
    number: 4,
    title: "Sequências",
    description: "Progressões aritmética e geométrica",
    priority: "essential",
    topics: [
      { id: "vol4-1", name: "Sequências Numéricas" },
      { id: "vol4-2", name: "Progressão Aritmética (PA)" },
      { id: "vol4-3", name: "Termo Geral da PA" },
      { id: "vol4-4", name: "Soma dos Termos da PA" },
      { id: "vol4-5", name: "Progressão Geométrica (PG)" },
      { id: "vol4-6", name: "Termo Geral da PG" },
      { id: "vol4-7", name: "Soma dos Termos da PG" },
      { id: "vol4-8", name: "Série Geométrica Infinita" },
      { id: "vol4-9", name: "Aplicações de PA e PG" },
      { id: "vol4-10", name: "Problemas com Sequências" },
    ],
  },
  {
    id: "vol5",
    number: 5,
    title: "Combinatória",
    description: "Análise combinatória e contagem",
    priority: "important",
    topics: [
      { id: "vol5-1", name: "Princípio Fundamental da Contagem" },
      { id: "vol5-2", name: "Fatorial" },
      { id: "vol5-3", name: "Arranjos" },
      { id: "vol5-4", name: "Permutações" },
      { id: "vol5-5", name: "Combinações" },
      { id: "vol5-6", name: "Binômio de Newton" },
      { id: "vol5-7", name: "Triângulo de Pascal" },
      { id: "vol5-8", name: "Permutações com Repetição" },
      { id: "vol5-9", name: "Combinações com Repetição" },
      { id: "vol5-10", name: "Problemas de Contagem" },
    ],
  },
  {
    id: "vol6",
    number: 6,
    title: "Probabilidade",
    description: "Teoria da probabilidade e cálculo de probabilidades",
    priority: "important",
    topics: [
      { id: "vol6-1", name: "Espaço Amostral" },
      { id: "vol6-2", name: "Eventos" },
      { id: "vol6-3", name: "Definição de Probabilidade" },
      { id: "vol6-4", name: "Propriedades da Probabilidade" },
      { id: "vol6-5", name: "Probabilidade Condicional" },
      { id: "vol6-6", name: "Eventos Independentes" },
      { id: "vol6-7", name: "Teorema da Multiplicação" },
      { id: "vol6-8", name: "Teorema da Probabilidade Total" },
      { id: "vol6-9", name: "Teorema de Bayes" },
      { id: "vol6-10", name: "Aplicações de Probabilidade" },
    ],
  },
  {
    id: "vol7",
    number: 7,
    title: "Estatística",
    description: "Estatística descritiva e análise de dados",
    priority: "important",
    topics: [
      { id: "vol7-1", name: "Conceitos Básicos de Estatística" },
      { id: "vol7-2", name: "Coleta e Organização de Dados" },
      { id: "vol7-3", name: "Distribuição de Frequências" },
      { id: "vol7-4", name: "Gráficos Estatísticos" },
      { id: "vol7-5", name: "Medidas de Tendência Central" },
      { id: "vol7-6", name: "Medidas de Dispersão" },
      { id: "vol7-7", name: "Variância e Desvio Padrão" },
      { id: "vol7-8", name: "Correlação e Regressão" },
      { id: "vol7-9", name: "Distribuição Normal" },
      { id: "vol7-10", name: "Aplicações de Estatística" },
    ],
  },
  {
    id: "vol8",
    number: 8,
    title: "Limites",
    description: "Limites de funções e continuidade",
    priority: "complementary",
    topics: [
      { id: "vol8-1", name: "Conceito de Limite" },
      { id: "vol8-2", name: "Limite de uma Função" },
      { id: "vol8-3", name: "Propriedades dos Limites" },
      { id: "vol8-4", name: "Limites Laterais" },
      { id: "vol8-5", name: "Limites Infinitos" },
      { id: "vol8-6", name: "Limites no Infinito" },
      { id: "vol8-7", name: "Continuidade de Funções" },
      { id: "vol8-8", name: "Teorema do Valor Intermediário" },
      { id: "vol8-9", name: "Assíntotas" },
      { id: "vol8-10", name: "Aplicações de Limites" },
    ],
  },
  {
    id: "vol9",
    number: 9,
    title: "Derivadas",
    description: "Derivadas e aplicações",
    priority: "complementary",
    topics: [
      { id: "vol9-1", name: "Conceito de Derivada" },
      { id: "vol9-2", name: "Derivada de uma Função" },
      { id: "vol9-3", name: "Regras de Derivação" },
      { id: "vol9-4", name: "Derivada da Função Composta" },
      { id: "vol9-5", name: "Derivadas de Funções Elementares" },
      { id: "vol9-6", name: "Derivadas Sucessivas" },
      { id: "vol9-7", name: "Máximos e Mínimos" },
      { id: "vol9-8", name: "Análise de Funções" },
      { id: "vol9-9", name: "Aplicações de Derivadas" },
      { id: "vol9-10", name: "Taxa de Variação" },
    ],
  },
  {
    id: "vol10",
    number: 10,
    title: "Integrais",
    description: "Integrais e cálculo de áreas",
    priority: "complementary",
    topics: [
      { id: "vol10-1", name: "Conceito de Integral" },
      { id: "vol10-2", name: "Integral Indefinida" },
      { id: "vol10-3", name: "Propriedades da Integral" },
      { id: "vol10-4", name: "Técnicas de Integração" },
      { id: "vol10-5", name: "Integração por Partes" },
      { id: "vol10-6", name: "Integração por Substituição" },
      { id: "vol10-7", name: "Integral Definida" },
      { id: "vol10-8", name: "Teorema Fundamental do Cálculo" },
      { id: "vol10-9", name: "Cálculo de Áreas" },
      { id: "vol10-10", name: "Aplicações de Integrais" },
    ],
  },
  {
    id: "vol11",
    number: 11,
    title: "Geometria",
    description: "Geometria analítica e espacial",
    priority: "important",
    topics: [
      { id: "vol11-1", name: "Geometria Analítica Plana" },
      { id: "vol11-2", name: "Ponto e Reta" },
      { id: "vol11-3", name: "Equação da Reta" },
      { id: "vol11-4", name: "Circunferência" },
      { id: "vol11-5", name: "Cônicas" },
      { id: "vol11-6", name: "Elipse" },
      { id: "vol11-7", name: "Hipérbole" },
      { id: "vol11-8", name: "Parábola" },
      { id: "vol11-9", name: "Geometria Espacial" },
      { id: "vol11-10", name: "Sólidos Geométricos" },
    ],
  },
];

export const getVolumeById = (id: string): Volume | undefined => {
  return fmeVolumes.find((vol) => vol.id === id);
};

export const getTopicsByVolume = (volumeId: string): Topic[] => {
  const volume = getVolumeById(volumeId);
  return volume ? volume.topics : [];
};

export const getAllTopics = (): { volumeNumber: number; volumeTitle: string; topics: Topic[] }[] => {
  return fmeVolumes.map((vol) => ({
    volumeNumber: vol.number,
    volumeTitle: vol.title,
    topics: vol.topics,
  }));
};

import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertCircle, BookMarked, CheckCircle2, Clock } from "lucide-react";

export default function Guide() {
  const volumes = [
    {
      priority: "Alta",
      volume: 1,
      title: "Conjuntos e Funções",
      relevance: "Base de toda a matemática. Essencial para a compreensão de todos os volumes subsequentes.",
      color: "bg-red-100 text-red-900",
    },
    {
      priority: "Alta",
      volume: 9,
      title: "Geometria Plana",
      relevance: "Tópico de alta recorrência em provas de raciocínio lógico e matemática básica.",
      color: "bg-red-100 text-red-900",
    },
    {
      priority: "Alta",
      volume: 11,
      title: "Mat. Comercial, Financeira e Estatística",
      relevance: "Tópicos específicos e muito comuns em editais de diversas áreas.",
      color: "bg-red-100 text-red-900",
    },
    {
      priority: "Média",
      volume: 4,
      title: "Sequências, Matrizes, Determinantes e Sistemas",
      relevance: "Matrizes e Sistemas Lineares são frequentes. Sequências (PA/PG) são básicas.",
      color: "bg-yellow-100 text-yellow-900",
    },
    {
      priority: "Média",
      volume: 5,
      title: "Combinatória e Probabilidade",
      relevance: "Essencial para raciocínio lógico e aprofundamento em Estatística.",
      color: "bg-yellow-100 text-yellow-900",
    },
    {
      priority: "Média",
      volume: 10,
      title: "Geometria Espacial",
      relevance: "Cobrada em concursos que exigem um nível mais aprofundado de Geometria.",
      color: "bg-yellow-100 text-yellow-900",
    },
    {
      priority: "Baixa",
      volume: 2,
      title: "Logaritmos",
      relevance: "Menos frequente, mas necessário para algumas áreas de exatas.",
      color: "bg-blue-100 text-blue-900",
    },
    {
      priority: "Baixa",
      volume: 3,
      title: "Trigonometria",
      relevance: "Cobrada em concursos de nível superior ou específicos (militares).",
      color: "bg-blue-100 text-blue-900",
    },
  ];

  const studyMethod = [
    {
      phase: "Teoria e Resumo",
      percentage: "20%",
      description: "Leia a teoria do capítulo, focando nas definições, teoremas e fórmulas. Crie um Mapa Mental ou Cartão de Revisão.",
      icon: BookMarked,
    },
    {
      phase: "Exemplos e Demonstrações",
      percentage: "30%",
      description: "Refaça os exemplos resolvidos no livro. Entenda a lógica por trás das demonstrações dos teoremas.",
      icon: CheckCircle2,
    },
    {
      phase: "Resolução de Exercícios",
      percentage: "50%",
      description: "Comece pelos exercícios simples (Seção A), avance para médios (Seção B). Marque os difíceis para revisão.",
      icon: AlertCircle,
    },
  ];

  const reviewSystem = [
    {
      review: "Revisão 1",
      timing: "24 horas",
      focus: "Fixação Imediata",
      action: "Releitura rápida do Mapa Mental/Flashcards e exercícios marcados.",
    },
    {
      review: "Revisão 2",
      timing: "7 dias",
      focus: "Consolidação",
      action: "Resolução de 5 a 10 exercícios marcados como difíceis.",
    },
    {
      review: "Revisão 3",
      timing: "30 dias",
      focus: "Memória de Longo Prazo",
      action: "Resolução de 10 a 15 questões de concursos sobre o tema.",
    },
    {
      review: "Revisão Contínua",
      timing: "A cada 90 dias",
      focus: "Manutenção",
      action: "Simulado geral com questões de todos os temas já estudados.",
    },
  ];

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-0 lg:ml-64 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Guia Completo de Estudos
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground max-w-3xl">
            Estrutura estratégica para dominar a Coleção Fundamentos da Matemática Elementar
          </p>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="volumes" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="volumes">Volumes</TabsTrigger>
            <TabsTrigger value="method">Método</TabsTrigger>
            <TabsTrigger value="review">Revisão</TabsTrigger>
          </TabsList>

          {/* Volumes Tab */}
          <TabsContent value="volumes" className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Priorização e Ordem de Estudo
              </h2>
              <p className="text-muted-foreground text-sm lg:text-base">
                A coleção FME é composta por 11 volumes. Abaixo está a classificação de relevância para concursos:
              </p>
            </div>

            <div className="space-y-4">
              {volumes.map((vol, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className={`flex-shrink-0 w-12 h-12 rounded-lg ${vol.color} flex items-center justify-center font-bold`}>
                      V{vol.volume}
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {vol.title}
                        </h3>
                        <span className={`text-xs font-semibold px-2 py-1 rounded ${vol.color}`}>
                          {vol.priority}
                        </span>
                      </div>
                      <p className="text-muted-foreground">
                        {vol.relevance}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Ordem Recomendada de Estudo
              </h3>
              <ol className="space-y-2 text-muted-foreground">
                <li><strong className="text-foreground">1. Base:</strong> Volume 1 (Conjuntos e Funções)</li>
                <li><strong className="text-foreground">2. Álgebra:</strong> Volumes 4, 5, 6, 2, 3</li>
                <li><strong className="text-foreground">3. Geometria:</strong> Volumes 9 e 10</li>
                <li><strong className="text-foreground">4. Específicos:</strong> Volume 11</li>
                <li><strong className="text-foreground">5. Avançado:</strong> Volumes 7 e 8 (se necessário)</li>
              </ol>
            </div>
          </TabsContent>

          {/* Method Tab */}
          <TabsContent value="method" className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Método de Estudo por Capítulo
              </h2>
              <p className="text-muted-foreground">
                Para garantir a absorção completa do conteúdo denso da FME, siga este método em três etapas:
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {studyMethod.map((method, index) => {
                const Icon = method.icon;
                return (
                  <Card key={index} className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                        <Icon className="text-primary" size={20} />
                      </div>
                      <span className="text-sm font-semibold text-primary bg-primary/10 px-3 py-1 rounded">
                        {method.percentage}
                      </span>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {method.phase}
                    </h3>
                    <p className="text-muted-foreground text-sm">
                      {method.description}
                    </p>
                  </Card>
                );
              })}
            </div>

            <div className="bg-accent/10 border border-accent/20 rounded-lg p-6 mt-8">
              <h3 className="text-lg font-semibold text-foreground mb-3">
                Dica Importante
              </h3>
              <p className="text-muted-foreground">
                O FME é um material denso. Não se preocupe em "zerar" a coleção. Concentre-se em <strong>dominar</strong> os tópicos mais cobrados no seu edital. Use o FME como uma fonte de aprofundamento e exercícios para os temas que você já identificou como prioritários.
              </p>
            </div>
          </TabsContent>

          {/* Review Tab */}
          <TabsContent value="review" className="space-y-6">
            <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-foreground mb-2">
                Sistema de Revisão Programada
              </h2>
              <p className="text-muted-foreground">
                A revisão é o pilar da memorização de longo prazo. Utilize o sistema de repetição espaçada:
              </p>
            </div>

            <div className="space-y-4">
              {reviewSystem.map((item, index) => (
                <Card key={index} className="p-6 hover:shadow-md transition-shadow">
                  <div className="flex items-start gap-4">
                    <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                      <Clock className="text-primary" size={20} />
                    </div>
                    <div className="flex-grow">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-lg font-semibold text-foreground">
                          {item.review}
                        </h3>
                        <span className="text-sm font-semibold text-primary bg-primary/10 px-2 py-1 rounded">
                          {item.timing}
                        </span>
                      </div>
                      <p className="text-sm font-semibold text-accent mb-2">
                        Foco: {item.focus}
                      </p>
                      <p className="text-muted-foreground">
                        {item.action}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

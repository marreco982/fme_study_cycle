import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { BookOpen, Calendar, Zap } from "lucide-react";

interface HomeProps {
  onNavigate: (section: string) => void;
}

export default function Home({ onNavigate }: HomeProps) {
  const features = [
    {
      icon: BookOpen,
      title: "Guia Estruturado",
      description: "Aprenda a ordem correta de estudo dos 11 volumes da FME com priorização inteligente.",
    },
    {
      icon: Calendar,
      title: "Calendário Personalizável",
      description: "Organize seu cronograma de estudos com revisões programadas e acompanhe seu progresso.",
    },
    {
      icon: Zap,
      title: "Sistema de Revisão",
      description: "Utilize a curva do esquecimento para consolidar conhecimento em memória de longo prazo.",
    },
  ];

  return (
    <div className="min-h-screen bg-background lg:ml-64">
      {/* Hero Section */}
      <section className="pt-24 pb-20 px-4 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl lg:text-6xl font-bold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
              Ciclo de Estudos <span className="text-primary">FME</span>
            </h1>
            <p className="text-lg lg:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Prepare-se para concursos públicos com a Coleção Fundamentos da Matemática Elementar
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                onClick={() => onNavigate("guide")}
                className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
              >
                Começar a Estudar
              </Button>
              <Button
                size="lg"
                variant="outline"
                onClick={() => onNavigate("calendar")}
                className="border-primary text-primary hover:bg-primary/10"
              >
                Ver Calendário
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4 lg:px-8 bg-secondary/30">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl lg:text-4xl font-bold text-foreground text-center mb-12" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="p-6 hover:shadow-lg transition-shadow">
                  <div className="flex items-center justify-center w-12 h-12 rounded-lg bg-primary/10 mb-4">
                    <Icon className="text-primary" size={24} />
                  </div>
                  <h3 className="text-xl font-semibold text-foreground mb-2" style={{ fontFamily: "'Poppins', sans-serif" }}>
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {feature.description}
                  </p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 lg:px-8 border-t border-border">
        <div className="max-w-4xl mx-auto bg-primary/5 border border-primary/20 rounded-lg p-8 text-center">
          <h2 className="text-2xl font-bold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Pronto para começar sua jornada?
          </h2>
          <p className="text-muted-foreground mb-6">
            Explore o guia completo de estudos e crie seu calendário personalizado agora mesmo.
          </p>
          <Button
            size="lg"
            onClick={() => onNavigate("guide")}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
          >
            Acessar Guia de Estudos
          </Button>
        </div>
      </section>
    </div>
  );
}

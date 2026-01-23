import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { AlertCircle, BookMarked, CheckCircle2, Clock, ChevronDown } from "lucide-react";
import { fmeVolumes } from "@/data/fmeVolumes";
import { useState } from "react";

export default function Guide() {
  const [expandedVolume, setExpandedVolume] = useState<string | null>(null);

  const toggleVolume = (volumeId: string) => {
    setExpandedVolume(expandedVolume === volumeId ? null : volumeId);
  };

  const essentialVolumes = fmeVolumes.filter((v) => v.priority === "essential");
  const importantVolumes = fmeVolumes.filter((v) => v.priority === "important");
  const complementaryVolumes = fmeVolumes.filter((v) => v.priority === "complementary");

  const renderVolumeCard = (volume: typeof fmeVolumes[0]) => {
    const isExpanded = expandedVolume === volume.id;
    const priorityColor = {
      essential: "border-red-300 bg-red-50",
      important: "border-yellow-300 bg-yellow-50",
      complementary: "border-blue-300 bg-blue-50",
    };

    const priorityLabel = {
      essential: "Essencial",
      important: "Importante",
      complementary: "Complementar",
    };

    return (
      <Card
        key={volume.id}
        className={`p-6 cursor-pointer transition-all ${priorityColor[volume.priority]}`}
        onClick={() => toggleVolume(volume.id)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-white">
                {priorityLabel[volume.priority]}
              </span>
            </div>
            <h3 className="text-lg font-bold text-foreground mb-1">
              Volume {volume.number} - {volume.title}
            </h3>
            <p className="text-sm text-muted-foreground">{volume.description}</p>
          </div>
          <ChevronDown
            size={24}
            className={`text-muted-foreground transition-transform ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-current/10">
            <h4 className="font-semibold text-foreground mb-4">Tópicos Principais:</h4>
            <div className="grid md:grid-cols-2 gap-3">
              {volume.topics.map((topic) => (
                <div
                  key={topic.id}
                  className="flex items-start gap-3 p-3 bg-white rounded-lg border border-current/5"
                >
                  <CheckCircle2 size={18} className="text-primary mt-0.5 flex-shrink-0" />
                  <div>
                    <p className="text-sm font-medium text-foreground">{topic.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-0 lg:ml-64 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Guia de Estudos FME
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            Estrutura completa da Coleção Fundamentos da Matemática Elementar com todos os tópicos
          </p>
        </div>

        <Tabs defaultValue="essencial" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 bg-secondary">
            <TabsTrigger value="essencial">Essencial ({essentialVolumes.length})</TabsTrigger>
            <TabsTrigger value="importante">Importante ({importantVolumes.length})</TabsTrigger>
            <TabsTrigger value="complementar">Complementar ({complementaryVolumes.length})</TabsTrigger>
          </TabsList>

          <TabsContent value="essencial" className="space-y-4">
            <div className="grid gap-4">
              {essentialVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Volumes Essenciais</h4>
                  <p className="text-sm text-muted-foreground">
                    Estes volumes cobrem os fundamentos da matemática elementar e aparecem com frequência em provas de concursos. Recomenda-se estudá-los com atenção especial.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="importante" className="space-y-4">
            <div className="grid gap-4">
              {importantVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Volumes Importantes</h4>
                  <p className="text-sm text-muted-foreground">
                    Estes volumes complementam os essenciais e são importantes para uma preparação completa. Estude-os após dominar os volumes essenciais.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="complementar" className="space-y-4">
            <div className="grid gap-4">
              {complementaryVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <Card className="p-6 bg-blue-50 border-blue-200">
              <div className="flex gap-4">
                <AlertCircle className="text-blue-600 flex-shrink-0" size={24} />
                <div>
                  <h4 className="font-semibold text-foreground mb-2">Volumes Complementares</h4>
                  <p className="text-sm text-muted-foreground">
                    Estes volumes cobrem tópicos mais avançados como Limites, Derivadas e Integrais. Estude-os se tiver tempo e se o edital do concurso exigir.
                  </p>
                </div>
              </div>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="mt-12 grid md:grid-cols-3 gap-6">
          <Card className="p-6 bg-gradient-to-br from-primary/10 to-primary/5">
            <BookMarked className="text-primary mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">11 Volumes</h3>
            <p className="text-sm text-muted-foreground">
              Cobertura completa de toda a matemática elementar
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-green-500/10 to-green-500/5">
            <CheckCircle2 className="text-green-600 mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">110+ Tópicos</h3>
            <p className="text-sm text-muted-foreground">
              Todos os tópicos principais organizados por volume
            </p>
          </Card>

          <Card className="p-6 bg-gradient-to-br from-blue-500/10 to-blue-500/5">
            <Clock className="text-blue-600 mb-4" size={32} />
            <h3 className="font-semibold text-foreground mb-2">Revisões Automáticas</h3>
            <p className="text-sm text-muted-foreground">
              Sistema de revisão espaçada para retenção máxima
            </p>
          </Card>
        </div>
      </div>
    </div>
  );
}

import { Card } from "@/components/ui/card";
import { AlertCircle, BookMarked, CheckCircle2, Clock, ChevronDown, Check } from "lucide-react";
import { fmeVolumes } from "@/data/fmeVolumes";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";

interface CompletedTopic {
  id: string;
  volumeId: string;
  topicId: string;
  topicName: string;
  completionDate: Date;
}

export default function Guide() {
  const [expandedVolume, setExpandedVolume] = useState<string | null>(null);
  const [completedTopics, setCompletedTopics] = useState<CompletedTopic[]>(() => {
    const saved = localStorage.getItem("completedTopics");
    return saved ? JSON.parse(saved).map((t: any) => ({
      ...t,
      completionDate: new Date(t.completionDate),
    })) : [];
  });

  useEffect(() => {
    localStorage.setItem("completedTopics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  const toggleVolume = (volumeId: string) => {
    setExpandedVolume(expandedVolume === volumeId ? null : volumeId);
  };

  const toggleTopicComplete = (volumeId: string, topicId: string, topicName: string) => {
    const isCompleted = completedTopics.some(
      (t) => t.volumeId === volumeId && t.topicId === topicId
    );

    if (isCompleted) {
      setCompletedTopics(
        completedTopics.filter((t) => !(t.volumeId === volumeId && t.topicId === topicId))
      );
    } else {
      const newCompletedTopic: CompletedTopic = {
        id: `topic-${volumeId}-${topicId}-${Date.now()}`,
        volumeId,
        topicId,
        topicName,
        completionDate: new Date(),
      };
      setCompletedTopics([...completedTopics, newCompletedTopic]);
    }
  };

  const isTopicCompleted = (volumeId: string, topicId: string) => {
    return completedTopics.some((t) => t.volumeId === volumeId && t.topicId === topicId);
  };

  const getVolumeProgress = (volumeId: string) => {
    const volume = fmeVolumes.find((v) => v.id === volumeId);
    if (!volume) return 0;
    const totalTopics = volume.topics.length;
    const completedCount = completedTopics.filter((t) => t.volumeId === volumeId).length;
    return totalTopics > 0 ? Math.round((completedCount / totalTopics) * 100) : 0;
  };

  const essentialVolumes = fmeVolumes.filter((v) => v.priority === "essential");
  const importantVolumes = fmeVolumes.filter((v) => v.priority === "important");
  const complementaryVolumes = fmeVolumes.filter((v) => v.priority === "complementary");

  const renderVolumeCard = (volume: typeof fmeVolumes[0]) => {
    const isExpanded = expandedVolume === volume.id;
    const progress = getVolumeProgress(volume.id);
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
        <div className="flex items-start justify-between mb-4">
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
            className={`text-muted-foreground transition-transform flex-shrink-0 ${
              isExpanded ? "rotate-180" : ""
            }`}
          />
        </div>

        {/* Progress Bar */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-foreground">Progresso</span>
            <span className="text-xs font-bold text-foreground">{progress}%</span>
          </div>
          <div className="w-full bg-white rounded-full h-2 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        {isExpanded && (
          <div className="mt-6 pt-6 border-t border-current/10">
            <h4 className="font-semibold text-foreground mb-4">Tópicos:</h4>
            <div className="space-y-2">
              {volume.topics.map((topic) => {
                const isCompleted = isTopicCompleted(volume.id, topic.id);
                return (
                  <div
                    key={topic.id}
                    className={`flex items-center gap-3 p-3 rounded-lg border transition-all ${
                      isCompleted
                        ? "bg-green-50 border-green-200"
                        : "bg-white border-current/5 hover:bg-gray-50"
                    }`}
                  >
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleTopicComplete(volume.id, topic.id, topic.name);
                      }}
                      className={`flex-shrink-0 w-5 h-5 rounded border-2 flex items-center justify-center transition-all ${
                        isCompleted
                          ? "bg-green-500 border-green-500"
                          : "border-gray-300 hover:border-green-500"
                      }`}
                    >
                      {isCompleted && <Check size={14} className="text-white" />}
                    </button>
                    <div className="flex-1">
                      <p
                        className={`text-sm font-medium ${
                          isCompleted
                            ? "text-green-700 line-through"
                            : "text-foreground"
                        }`}
                      >
                        {topic.name}
                      </p>
                    </div>
                    {isCompleted && (
                      <CheckCircle2 size={16} className="text-green-500 flex-shrink-0" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </Card>
    );
  };

  const totalTopics = fmeVolumes.reduce((acc, v) => acc + v.topics.length, 0);
  const totalCompleted = completedTopics.length;
  const overallProgress = totalTopics > 0 ? Math.round((totalCompleted / totalTopics) * 100) : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Guia de Estudos FME</h1>
        <p className="text-muted-foreground mb-8">
          Estrutura completa da Coleção Fundamentos da Matemática Elementar com todos os tópicos
        </p>

        {/* Progresso Geral */}
        <Card className="p-6 bg-white mb-8 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h2 className="text-lg font-bold text-foreground">Progresso Geral</h2>
              <p className="text-sm text-muted-foreground">
                {totalCompleted} de {totalTopics} tópicos concluídos
              </p>
            </div>
            <div className="text-right">
              <p className="text-3xl font-bold text-primary">{overallProgress}%</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
              style={{ width: `${overallProgress}%` }}
            />
          </div>
        </Card>

        {/* Abas de Prioridade */}
        <div className="space-y-8">
          {/* Essenciais */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-red-500 rounded-full"></span>
              Essencial ({essentialVolumes.length})
            </h2>
            <div className="grid gap-4">
              {essentialVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-4 bg-red-50 rounded-lg border border-red-200">
              <strong>ℹ️ Volumes Essenciais:</strong> Estes volumes cobrem os fundamentos da matemática elementar e aparecem com frequência em provas de concursos. Recomenda-se estudá-los com atenção especial.
            </p>
          </div>

          {/* Importantes */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-yellow-500 rounded-full"></span>
              Importante ({importantVolumes.length})
            </h2>
            <div className="grid gap-4">
              {importantVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <strong>ℹ️ Volumes Importantes:</strong> Estes volumes complementam os essenciais e são cobrados regularmente em concursos. Estude-os após dominar os volumes essenciais.
            </p>
          </div>

          {/* Complementares */}
          <div>
            <h2 className="text-2xl font-bold text-foreground mb-4 flex items-center gap-2">
              <span className="w-3 h-3 bg-blue-500 rounded-full"></span>
              Complementar ({complementaryVolumes.length})
            </h2>
            <div className="grid gap-4">
              {complementaryVolumes.map((volume) => renderVolumeCard(volume))}
            </div>
            <p className="text-sm text-muted-foreground mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <strong>ℹ️ Volumes Complementares:</strong> Estes volumes aprofundam tópicos específicos e são menos frequentes em concursos. Estude-os conforme sua necessidade e disponibilidade.
            </p>
          </div>
        </div>

        {/* Dica de Uso */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-8">
          <h3 className="font-bold text-foreground mb-3 flex items-center gap-2">
            <AlertCircle size={20} className="text-blue-600" />
            Como Usar o Checklist
          </h3>
          <ul className="space-y-2 text-sm text-foreground">
            <li>✓ <strong>Clique no checkbox</strong> ao lado de cada tópico para marcá-lo como concluído</li>
            <li>✓ <strong>Acompanhe o progresso</strong> de cada volume com a barra de progresso</li>
            <li>✓ <strong>Visualize o progresso geral</strong> no topo da página</li>
            <li>✓ <strong>Use o Cronograma</strong> para agendar sessões de estudo e revisões</li>
          </ul>
        </Card>
      </div>
    </div>
  );
}

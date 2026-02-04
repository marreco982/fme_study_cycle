import { AlertCircle, BookMarked, CheckCircle2, Clock, ChevronDown, Check } from "lucide-react";
import { fmeVolumes, Topic } from "@/data/fmeVolumes";
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

  const isTopicCompleted = (volumeId: string, topicId: string): boolean => {
    return completedTopics.some(
      (t) => t.volumeId === volumeId && t.topicId === topicId
    );
  };

  const calculateVolumeProgress = (volumeId: string): number => {
    const volume = fmeVolumes.find((v) => v.id === volumeId);
    if (!volume) return 0;

    const totalTopics = volume.chapters.reduce((sum, ch) => sum + ch.topics.length, 0);
    if (totalTopics === 0) return 0;

    const completedCount = completedTopics.filter(
      (t) => t.volumeId === volumeId
    ).length;

    return Math.round((completedCount / totalTopics) * 100);
  };

  const calculateOverallProgress = (): number => {
    const totalTopics = fmeVolumes.reduce(
      (sum, vol) => sum + vol.chapters.reduce((s, ch) => s + ch.topics.length, 0),
      0
    );
    if (totalTopics === 0) return 0;
    return Math.round((completedTopics.length / totalTopics) * 100);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Guia de Estudos FME</h1>
          <p className="text-muted-foreground">Fundamentos da Matemática Elementar</p>
        </div>

        {/* Overall Progress */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8 border border-blue-100">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <Clock className="text-blue-600" size={24} />
              <div>
                <h3 className="font-semibold text-foreground">Progresso Geral</h3>
                <p className="text-sm text-muted-foreground">{completedTopics.length} tópicos concluídos</p>
              </div>
            </div>
            <span className="text-3xl font-bold text-blue-600">{calculateOverallProgress()}%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-blue-500 to-indigo-600 h-full transition-all duration-300"
              style={{ width: `${calculateOverallProgress()}%` }}
            />
          </div>
        </div>

        {/* Volumes List */}
        <div className="space-y-4">
          {fmeVolumes.map((volume) => {
            const isExpanded = expandedVolume === volume.id;
            const progress = calculateVolumeProgress(volume.id);

            return (
              <div key={volume.id} className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
                {/* Volume Header */}
                <div
                  onClick={() => toggleVolume(volume.id)}
                  className="p-6 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-between"
                >
                  <div className="flex items-center gap-4 flex-1">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center font-bold text-white ${
                      volume.priority === "essential" ? "bg-blue-600" :
                      volume.priority === "important" ? "bg-amber-600" :
                      "bg-gray-600"
                    }`}>
                      {volume.number}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-foreground">
                        Volume {volume.number} - {volume.title}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        Prioridade: {volume.priority === "essential" ? "Essencial" : volume.priority === "important" ? "Importante" : "Complementar"}
                      </p>
                    </div>
                  </div>
                  <div className="text-right mr-4">
                    <span className="text-2xl font-bold text-blue-600">{progress}%</span>
                  </div>
                  <ChevronDown
                    size={24}
                    className={`text-muted-foreground transition-transform flex-shrink-0 ${
                      isExpanded ? "rotate-180" : ""
                    }`}
                  />
                </div>

                {/* Progress Bar */}
                <div className="px-6 pb-4">
                  <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-blue-500 to-blue-600 h-full transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>

                {/* Chapters and Topics */}
                {isExpanded && (
                  <div className="px-6 pb-6 border-t border-gray-200 bg-gray-50">
                    <div className="space-y-6">
                      {volume.chapters.map((chapter) => (
                        <div key={chapter.id}>
                          <h4 className="font-semibold text-foreground mb-3 text-sm uppercase tracking-wide">
                            {chapter.name}
                          </h4>
                          <div className="space-y-2 pl-4">
                            {chapter.topics.map((topic: Topic) => {
                              const isCompleted = isTopicCompleted(volume.id, topic.id);
                              return (
                                <div
                                  key={topic.id}
                                  className={`flex items-center gap-3 p-3 rounded-lg border transition-all cursor-pointer ${
                                    isCompleted
                                      ? "bg-green-50 border-green-200"
                                      : "bg-white border-gray-200 hover:bg-gray-50"
                                  }`}
                                  onClick={() => toggleTopicComplete(volume.id, topic.id, topic.name)}
                                >
                                  <div className={`w-5 h-5 rounded border flex items-center justify-center flex-shrink-0 ${
                                    isCompleted
                                      ? "bg-green-500 border-green-500"
                                      : "border-gray-300"
                                  }`}>
                                    {isCompleted && <Check size={16} className="text-white" />}
                                  </div>
                                  <span className={`flex-1 ${isCompleted ? "line-through text-gray-500" : "text-foreground"}`}>
                                    {topic.name}
                                  </span>
                                  {topic.durationMinutes && (
                                    <span className="text-xs text-muted-foreground">
                                      {Math.round(topic.durationMinutes / 60)}h {topic.durationMinutes % 60}m
                                    </span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

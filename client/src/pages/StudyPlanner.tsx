import { Card } from "@/components/ui/card";
import { fmeVolumes } from "@/data/fmeVolumes";
import { useState, useMemo, useEffect } from "react";
import { Calendar, Clock, BookOpen, AlertCircle, Download, CheckCircle2, Circle, ChevronDown, ChevronUp } from "lucide-react";

interface ScheduleItem {
  id: string;
  date: Date;
  volume: number;
  volumeTitle: string;
  chapter: string;
  topic: string;
  duration: number;
  type: "study" | "review";
  reviewDay?: number;
  completed?: boolean;
  originalStudyDate?: Date;
  isCarryover?: boolean;
}

export default function StudyPlanner() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [includeComplementary, setIncludeComplementary] = useState(false);
  const [completedTopics, setCompletedTopics] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("completedTopicsSchedule");
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const [completedReviews, setCompletedReviews] = useState<Set<string>>(() => {
    const saved = localStorage.getItem("completedReviewsSchedule");
    return new Set(saved ? JSON.parse(saved) : []);
  });

  const [expandedVolumes, setExpandedVolumes] = useState<Set<number>>(() => {
    const saved = localStorage.getItem("expandedVolumesSchedule");
    return new Set(saved ? JSON.parse(saved) : [1]);
  });

  // Salvar tópicos concluídos no localStorage
  useEffect(() => {
    localStorage.setItem("completedTopicsSchedule", JSON.stringify(Array.from(completedTopics)));
  }, [completedTopics]);

  // Salvar revisões concluídas no localStorage
  useEffect(() => {
    localStorage.setItem("completedReviewsSchedule", JSON.stringify(Array.from(completedReviews)));
  }, [completedReviews]);

  // Salvar volumes expandidos no localStorage
  useEffect(() => {
    localStorage.setItem("expandedVolumesSchedule", JSON.stringify(Array.from(expandedVolumes)));
  }, [expandedVolumes]);

  // Calcular cronograma diário flexível
  const schedule = useMemo(() => {
    const items: ScheduleItem[] = [];
    let currentDate = new Date(startDate);
    let currentTopicIndex = 0;
    const topicsToStudy: Array<{
      volume: typeof fmeVolumes[0];
      chapter: typeof fmeVolumes[0]["chapters"][0];
      topic: typeof fmeVolumes[0]["chapters"][0]["topics"][0];
    }> = [];

    // Filtrar volumes e coletar todos os tópicos
    const volumesToStudy = fmeVolumes.filter((vol) => {
      if (includeComplementary) return true;
      return vol.priority !== "complementary";
    });

    volumesToStudy.forEach((volume) => {
      volume.chapters.forEach((chapter) => {
        chapter.topics.forEach((topic) => {
          topicsToStudy.push({ volume, chapter, topic });
        });
      });
    });

    // Gerar cronograma diário: um tópico por dia (ou carryover se não concluído)
    // Limitar a 365 dias para evitar loop infinito
    let dayCount = 0;
    const MAX_DAYS = 365;
    
    while (currentTopicIndex < topicsToStudy.length && dayCount < MAX_DAYS) {
      const { volume, chapter, topic } = topicsToStudy[currentTopicIndex];
      const duration = topic.durationMinutes || 60;
      const topicId = `${volume.id}_${chapter.id}_${topic.id}`;
      const isCompleted = completedTopics.has(topicId);

      // Adicionar tópico para o dia atual
      items.push({
        id: `study_${topicId}_${currentDate.toISOString().split("T")[0]}`,
        date: new Date(currentDate),
        volume: volume.number,
        volumeTitle: volume.title,
        chapter: chapter.name,
        topic: topic.name,
        duration,
        type: "study",
        completed: isCompleted,
        originalStudyDate: new Date(currentDate),
      });

      // Se o tópico foi concluído, agendar revisões e ir para o próximo
      if (isCompleted) {
        const reviewDays = [1, 7, 14, 30, 90];
        const completionDate = new Date(currentDate);

        reviewDays.forEach((reviewDay) => {
          const reviewDate = new Date(completionDate);
          reviewDate.setDate(reviewDate.getDate() + reviewDay);

          items.push({
            id: `review_${topicId}_${reviewDay}d`,
            date: reviewDate,
            volume: volume.number,
            volumeTitle: volume.title,
            chapter: chapter.name,
            topic: `[REVISÃO] ${topic.name}`,
            duration: Math.ceil(duration / 2),
            type: "review",
            reviewDay,
            completed: completedReviews.has(`review_${topicId}_${reviewDay}d`),
            originalStudyDate: completionDate,
          });
        });

        // Ir para o próximo tópico
        currentTopicIndex++;
        currentDate.setDate(currentDate.getDate() + 1);
      } else {
        // Se não foi concluído, repete no próximo dia (carryover)
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      dayCount++;
    }

    // Ordenar por data
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [startDate, includeComplementary, completedTopics, completedReviews]);

  // Agrupar cronograma por data
  const scheduleByDate = useMemo(() => {
    const dates: { [key: string]: ScheduleItem[] } = {};

    schedule.forEach((item) => {
      const dateKey = item.date.toLocaleDateString("pt-BR");
      if (!dates[dateKey]) {
        dates[dateKey] = [];
      }
      dates[dateKey].push(item);
    });

    return dates;
  }, [schedule]);

  // Agrupar cronograma por volume para melhor visualização
  const scheduleByVolume = useMemo(() => {
    const volumes: { [key: number]: { title: string; items: ScheduleItem[] } } = {};

    schedule.forEach((item) => {
      if (!volumes[item.volume]) {
        volumes[item.volume] = {
          title: item.volumeTitle,
          items: [],
        };
      }
      volumes[item.volume].items.push(item);
    });

    return volumes;
  }, [schedule]);

  // Calcular progresso por volume
  const volumeProgress = useMemo(() => {
    const progress: { [key: number]: { completed: number; total: number; percentage: number } } = {};

    Object.entries(scheduleByVolume).forEach(([volumeNum, { items }]) => {
      const studyItems = items.filter((item) => item.type === "study");
      const completedItems = studyItems.filter((item) => item.completed);
      progress[parseInt(volumeNum)] = {
        completed: completedItems.length,
        total: studyItems.length,
        percentage: studyItems.length > 0 ? Math.round((completedItems.length / studyItems.length) * 100) : 0,
      };
    });

    return progress;
  }, [scheduleByVolume]);

  // Alternar conclusão de tópico
  const toggleTopicCompletion = (topicId: string) => {
    const newCompleted = new Set(completedTopics);
    if (newCompleted.has(topicId)) {
      newCompleted.delete(topicId);
    } else {
      newCompleted.add(topicId);
    }
    setCompletedTopics(newCompleted);
  };

  // Alternar conclusão de revisão
  const toggleReviewCompletion = (reviewId: string) => {
    const newCompleted = new Set(completedReviews);
    if (newCompleted.has(reviewId)) {
      newCompleted.delete(reviewId);
    } else {
      newCompleted.add(reviewId);
    }
    setCompletedReviews(newCompleted);
  };

  // Alternar expansão de volume
  const toggleVolumeExpansion = (volumeNum: number) => {
    const newExpanded = new Set(expandedVolumes);
    if (newExpanded.has(volumeNum)) {
      newExpanded.delete(volumeNum);
    } else {
      newExpanded.add(volumeNum);
    }
    setExpandedVolumes(newExpanded);
  };

  // Estatísticas
  const stats = useMemo(() => {
    const studyItems = schedule.filter((item) => item.type === "study");
    const reviewItems = schedule.filter((item) => item.type === "review");
    const completedStudyItems = studyItems.filter((item) => item.completed);
    const completedReviewItems = reviewItems.filter((item) => completedReviews.has(item.id));
    
    const completedStudyMinutes = completedStudyItems.reduce((acc, item) => acc + item.duration, 0);
    const totalStudyMinutes = studyItems.reduce((acc, item) => acc + item.duration, 0);
    
    const totalMinutes = totalStudyMinutes;
    const completedMinutes = completedStudyMinutes;
    const totalDays = new Set(schedule.map((item) => item.date.toDateString())).size;
    const endDate = schedule.length > 0 ? schedule[schedule.length - 1].date : new Date();
    const progressPercentage = studyItems.length > 0 
      ? Math.round((completedStudyItems.length / studyItems.length) * 100) 
      : 0;

    return {
      studyItems: studyItems.length,
      completedStudyItems: completedStudyItems.length,
      reviewItems: reviewItems.length,
      completedReviewItems: completedReviewItems.length,
      totalMinutes,
      completedMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      completedHours: Math.round((completedMinutes / 60) * 10) / 10,
      totalDays,
      endDate,
      progressPercentage,
    };
  }, [schedule, completedReviews]);

  // Exportar como CSV
  const exportCSV = () => {
    const csv = [
      ["Data", "Volume", "Capítulo", "Tópico", "Duração (min)", "Tipo", "Status"].join(","),
      ...schedule.map((item) =>
        [
          item.date.toLocaleDateString("pt-BR"),
          `Vol ${item.volume}`,
          item.chapter,
          item.topic,
          item.duration,
          item.type === "study" ? "Estudo" : "Revisão",
          item.completed ? "Concluído" : "Pendente",
        ].join(",")
      ),
    ].join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `cronograma-fme-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Planejador de Cronograma</h1>
        <p className="text-muted-foreground mb-8">
          Cronograma diário flexível: um tópico por dia, com revisões automáticas após conclusão
        </p>

        {/* Configurações */}
        <Card className="p-6 bg-white shadow-sm mb-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Configurações</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-foreground mb-2">
                Data de Início
              </label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            <div className="flex items-end">
              <label className="flex items-center gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={includeComplementary}
                  onChange={(e) => setIncludeComplementary(e.target.checked)}
                  className="w-4 h-4"
                />
                <span className="text-sm font-medium text-foreground">
                  Incluir volumes complementares
                </span>
              </label>
            </div>
          </div>
        </Card>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progresso</p>
                <p className="text-3xl font-bold text-primary">{stats.progressPercentage}%</p>
              </div>
              <CheckCircle2 className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo de Estudo</p>
                <p className="text-3xl font-bold text-green-600">{stats.completedHours}h</p>
                <p className="text-xs text-muted-foreground">de {stats.totalHours}h</p>
              </div>
              <Clock className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dias de Estudo</p>
                <p className="text-3xl font-bold text-blue-600">{stats.totalDays}</p>
              </div>
              <Calendar className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões (Extra)</p>
                <p className="text-3xl font-bold text-purple-600">{stats.completedReviewItems}/{stats.reviewItems}</p>
              </div>
              <BookOpen className="text-purple-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Data Final</p>
                <p className="text-lg font-bold text-orange-600">
                  {stats.endDate.toLocaleDateString("pt-BR")}
                </p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Botão de Exportar */}
        <div className="mb-8">
          <button
            onClick={exportCSV}
            className="flex items-center gap-2 px-6 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 transition-colors"
          >
            <Download size={20} />
            Exportar como CSV
          </button>
        </div>

        {/* Cronograma por Volume */}
        <div className="space-y-6">
          {Object.entries(scheduleByVolume)
            .sort((a, b) => parseInt(a[0]) - parseInt(b[0]))
            .map(([volumeNum, { title, items }]) => {
              const volumeNumber = parseInt(volumeNum);
              const isExpanded = expandedVolumes.has(volumeNumber);
              const progress = volumeProgress[volumeNumber];
              const studyItems = items.filter((item) => item.type === "study");
              const reviewItems = items.filter((item) => item.type === "review");

              return (
                <Card key={volumeNum} className="bg-white shadow-sm overflow-hidden">
                  {/* Cabeçalho do Volume */}
                  <div
                    onClick={() => toggleVolumeExpansion(volumeNumber)}
                    className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-b border-blue-200 cursor-pointer hover:from-blue-100 hover:to-blue-150 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4 flex-1">
                        {isExpanded ? (
                          <ChevronUp className="text-blue-600" size={24} />
                        ) : (
                          <ChevronDown className="text-blue-600" size={24} />
                        )}
                        <div>
                          <h3 className="text-lg font-bold text-foreground">
                            Volume {volumeNumber}: {title}
                          </h3>
                          <p className="text-sm text-muted-foreground">
                            {progress.completed} de {progress.total} tópicos concluídos
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-green-500 transition-all"
                              style={{ width: `${progress.percentage}%` }}
                            />
                          </div>
                          <span className="text-sm font-semibold text-foreground">{progress.percentage}%</span>
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {studyItems.length} aulas + {reviewItems.length} revisões
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Conteúdo do Volume */}
                  {isExpanded && (
                    <div className="p-6 space-y-4">
                      {items.map((item) => (
                        <div
                          key={item.id}
                          className={`p-4 rounded-lg border-2 transition-all ${
                            item.completed
                              ? "bg-green-50 border-green-200"
                              : "bg-gray-50 border-gray-200"
                          }`}
                        >
                          <div className="flex items-start gap-4">
                            <button
                              onClick={() => {
                                if (item.type === "study") {
                                  const topicId = item.id.split("_")[1];
                                  toggleTopicCompletion(topicId);
                                } else {
                                  toggleReviewCompletion(item.id);
                                }
                              }}
                              className="mt-1 flex-shrink-0"
                            >
                              {item.completed ? (
                                <CheckCircle2 className="text-green-600" size={24} />
                              ) : (
                                <Circle className="text-gray-400" size={24} />
                              )}
                            </button>
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                  {item.date.toLocaleDateString("pt-BR")}
                                </span>
                                <span className={`text-xs font-semibold px-2 py-1 rounded ${
                                  item.type === "study"
                                    ? "bg-green-100 text-green-700"
                                    : "bg-purple-100 text-purple-700"
                                }`}>
                                  {item.type === "study" ? "Estudo" : `Revisão (${item.reviewDay}d)`}
                                </span>
                              </div>
                              <h4 className={`font-semibold text-foreground ${item.completed ? "line-through text-gray-500" : ""}`}>
                                {item.topic}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                {item.chapter} • ⏱️ {item.duration} minutos
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>

        {/* Resumo */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-blue-100 border-blue-200 mt-8">
          <h2 className="text-2xl font-bold text-foreground mb-4">Resumo do Cronograma</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <p className="text-muted-foreground">✅ <strong>Progresso:</strong> {stats.completedStudyItems} de {stats.studyItems} tópicos concluídos ({stats.progressPercentage}%)</p>
              <p className="text-muted-foreground mt-2">📚 <strong>Total de Sessões:</strong> {stats.studyItems} aulas + {stats.reviewItems} revisões ({stats.completedReviewItems} revisões concluídas)</p>
              <p className="text-muted-foreground mt-2">⏱️ <strong>Tempo Concluído:</strong> {stats.completedHours}h de {stats.totalHours}h ({stats.completedMinutes} de {stats.totalMinutes} minutos)</p>
            </div>
            <div>
              <p className="text-muted-foreground">📅 <strong>Período:</strong> {stats.totalDays} dias</p>
              <p className="text-muted-foreground mt-2">🎯 <strong>Ritmo:</strong> Um tópico por dia (com carryover se não concluído)</p>
              <p className="text-muted-foreground mt-2">✨ <strong>Data Final Estimada:</strong> {stats.endDate.toLocaleDateString("pt-BR")}</p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}

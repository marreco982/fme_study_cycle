import { Button } from "@/components/ui/button";
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
}

const DAILY_STUDY_HOURS = 2;
const DAILY_STUDY_MINUTES = DAILY_STUDY_HOURS * 60;

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

  // Calcular cronograma com ajuste para tópicos concluídos
  const schedule = useMemo(() => {
    const items: ScheduleItem[] = [];
    let currentDate = new Date(startDate);
    let minutesRemaining = 0;

    // Filtrar volumes
    const volumesToStudy = fmeVolumes.filter((vol) => {
      if (includeComplementary) return true;
      return vol.priority !== "complementary";
    });

    // Gerar cronograma de estudo
    volumesToStudy.forEach((volume) => {
      volume.chapters.forEach((chapter) => {
        chapter.topics.forEach((topic) => {
          const duration = topic.durationMinutes || 60;
          const topicId = `${volume.id}_${chapter.id}_${topic.id}`;
          const isCompleted = completedTopics.has(topicId);

          if (minutesRemaining === 0) {
            minutesRemaining = DAILY_STUDY_MINUTES;
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }

          const studyDate = new Date(currentDate);

          if (duration <= minutesRemaining) {
            items.push({
              id: `study_${topicId}`,
              date: studyDate,
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name,
              duration,
              type: "study",
              completed: isCompleted,
              originalStudyDate: studyDate,
            });
            minutesRemaining -= duration;
          } else {
            // Tópico que não cabe no dia
            items.push({
              id: `study_${topicId}_part1`,
              date: studyDate,
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name,
              duration: minutesRemaining,
              type: "study",
              completed: isCompleted,
              originalStudyDate: studyDate,
            });

            // Resto do tópico no próximo dia
            const remaining = duration - minutesRemaining;
            currentDate.setDate(currentDate.getDate() + 1);
            items.push({
              id: `study_${topicId}_part2`,
              date: new Date(currentDate),
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name + " (continuação)",
              duration: remaining,
              type: "study",
              completed: isCompleted,
              originalStudyDate: studyDate,
            });
            minutesRemaining = DAILY_STUDY_MINUTES - remaining;
          }
        });
      });
    });

    // Adicionar revisões espaçadas baseadas na data de conclusão
    const reviewDays = [1, 7, 14, 30, 90];
    const studyItems = items.filter((item) => item.type === "study");

    studyItems.forEach((studyItem) => {
      const topicId = studyItem.id.replace("study_", "").split("_part")[0];
      const isCompleted = completedTopics.has(topicId);

      if (isCompleted) {
        // Se o tópico foi concluído, usar a data de conclusão como base
        const completionDate = new Date(studyItem.originalStudyDate!);

        reviewDays.forEach((reviewDay) => {
          const reviewDate = new Date(completionDate);
          reviewDate.setDate(reviewDate.getDate() + reviewDay);

          items.push({
            id: `review_${topicId}_${reviewDay}d`,
            date: reviewDate,
            volume: studyItem.volume,
            volumeTitle: studyItem.volumeTitle,
            chapter: studyItem.chapter,
            topic: `[REVISÃO] ${studyItem.topic.replace(" (continuação)", "")}`,
            duration: Math.ceil(studyItem.duration / 2),
            type: "review",
            reviewDay,
            completed: false,
            originalStudyDate: studyItem.originalStudyDate,
          });
        });
      }
    });

    // Ordenar por data
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [startDate, includeComplementary, completedTopics]);

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
    
    // Calcular tempo SEPARADAMENTE: estudo vs revisões
    const completedStudyMinutes = completedStudyItems.reduce((acc, item) => acc + item.duration, 0);
    const totalStudyMinutes = studyItems.reduce((acc, item) => acc + item.duration, 0);
    
    // NÃO somar revisões no tempo total de estudo
    const completedMinutes = completedStudyMinutes;
    const totalMinutes = totalStudyMinutes;
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
          Crie um cronograma personalizado com 2 horas diárias e marque tópicos como concluídos
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
                <p className="text-sm text-muted-foreground mb-1">Tempo Concluído</p>
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
                <p className="text-sm text-muted-foreground mb-1">Revisões (Obrigação Extra)</p>
                <p className="text-3xl font-bold text-purple-600">{stats.completedReviewItems}/{stats.reviewItems}</p>
                <p className="text-xs text-muted-foreground">Fora das 2h/dia</p>
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
          <Button
            onClick={exportCSV}
            className="flex items-center gap-2 bg-primary text-primary-foreground hover:bg-primary/90"
          >
            <Download size={20} />
            Exportar como CSV
          </Button>
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
                    <div className="p-6 space-y-3">
                      {items.map((item, index) => {
                        const topicId = item.id.replace("study_", "").split("_part")[0];
                        const isStudyItem = item.type === "study";
                        const isCompleted = isStudyItem 
                          ? completedTopics.has(topicId) 
                          : completedReviews.has(item.id);

                        return (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-l-4 transition-all ${
                              isStudyItem
                                ? isCompleted
                                  ? "bg-green-50 border-green-500 opacity-60"
                                  : "bg-blue-50 border-blue-500"
                                : isCompleted
                                ? "bg-purple-50 border-purple-500 opacity-60"
                                : "bg-purple-50 border-purple-400"
                            }`}
                          >
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex-1">
                                <p className="font-semibold text-foreground">
                                  {item.date.toLocaleDateString("pt-BR", {
                                    weekday: "short",
                                    day: "numeric",
                                    month: "short",
                                  })}
                                </p>
                                <p className="text-sm text-muted-foreground">
                                  {item.chapter}
                                </p>
                              </div>
                              <div className="flex items-center gap-2">
                                {isStudyItem && (
                                  <button
                                    onClick={() => toggleTopicCompletion(topicId)}
                                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="text-green-600" size={24} />
                                    ) : (
                                      <Circle className="text-gray-400" size={24} />
                                    )}
                                  </button>
                                )}
                                {!isStudyItem && (
                                  <button
                                    onClick={() => toggleReviewCompletion(item.id)}
                                    className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                                  >
                                    {isCompleted ? (
                                      <CheckCircle2 className="text-purple-600" size={24} />
                                    ) : (
                                      <Circle className="text-gray-400" size={24} />
                                    )}
                                  </button>
                                )}
                                <span
                                  className={`px-3 py-1 rounded-full text-sm font-medium ${
                                    isStudyItem
                                      ? isCompleted
                                        ? "bg-green-200 text-green-800"
                                        : "bg-blue-200 text-blue-800"
                                      : isCompleted
                                      ? "bg-purple-200 text-purple-800"
                                      : "bg-purple-100 text-purple-700"
                                  }`}
                                >
                                  {isStudyItem ? "Estudo" : "Revisão"}
                                  {item.reviewDay && ` (${item.reviewDay}d)`}
                                </span>
                              </div>
                            </div>
                            <p className={`text-foreground font-medium mb-2 ${isCompleted ? "line-through" : ""}`}>
                              {item.topic}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              ⏱️ {item.duration} minutos
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </Card>
              );
            })}
        </div>

        {/* Resumo Final */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Resumo do Cronograma</h2>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              ✅ <strong>Progresso:</strong> {stats.completedStudyItems} de{" "}
              {stats.studyItems} tópicos concluídos ({stats.progressPercentage}%)
            </p>
            <p>
              📚 <strong>Total de Sessões:</strong> {stats.studyItems} aulas +{" "}
              {stats.reviewItems} revisões ({stats.completedReviewItems} revisões concluídas)
            </p>
            <p>
              ⏱️ <strong>Tempo Concluído:</strong> {stats.completedHours}h de {stats.totalHours}h ({stats.completedMinutes} de {stats.totalMinutes}{" "}
              minutos)
            </p>
            <p>
              📅 <strong>Período:</strong> {stats.totalDays} dias ({Math.ceil(stats.totalDays / 7)}{" "}
              semanas)
            </p>
            <p>
              🎯 <strong>Ritmo:</strong> {DAILY_STUDY_HOURS} horas por dia
            </p>
            <p>
              ✨ <strong>Data Final Estimada:</strong>{" "}
              {stats.endDate.toLocaleDateString("pt-BR")}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

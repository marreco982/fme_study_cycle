import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { fmeVolumes } from "@/data/fmeVolumes";
import { useState, useMemo } from "react";
import { Calendar, Clock, BookOpen, AlertCircle, Download } from "lucide-react";

interface ScheduleItem {
  date: Date;
  volume: number;
  volumeTitle: string;
  chapter: string;
  topic: string;
  duration: number;
  type: "study" | "review";
  reviewDay?: number;
}

const DAILY_STUDY_HOURS = 2;
const DAILY_STUDY_MINUTES = DAILY_STUDY_HOURS * 60;

export default function StudyPlanner() {
  const [startDate, setStartDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [includeComplementary, setIncludeComplementary] = useState(false);

  // Calcular cronograma
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

          if (minutesRemaining === 0) {
            minutesRemaining = DAILY_STUDY_MINUTES;
            currentDate = new Date(currentDate);
            currentDate.setDate(currentDate.getDate() + 1);
          }

          if (duration <= minutesRemaining) {
            items.push({
              date: new Date(currentDate),
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name,
              duration,
              type: "study",
            });
            minutesRemaining -= duration;
          } else {
            // Tópico que não cabe no dia
            items.push({
              date: new Date(currentDate),
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name,
              duration: minutesRemaining,
              type: "study",
            });

            // Resto do tópico no próximo dia
            const remaining = duration - minutesRemaining;
            currentDate.setDate(currentDate.getDate() + 1);
            items.push({
              date: new Date(currentDate),
              volume: volume.number,
              volumeTitle: volume.title,
              chapter: chapter.name,
              topic: topic.name + " (continuação)",
              duration: remaining,
              type: "study",
            });
            minutesRemaining = DAILY_STUDY_MINUTES - remaining;
          }
        });
      });
    });

    // Adicionar revisões espaçadas
    const reviewDays = [1, 7, 14, 30, 90];
    const studyItems = items.filter((item) => item.type === "study");

    studyItems.forEach((studyItem, index) => {
      reviewDays.forEach((reviewDay) => {
        const reviewDate = new Date(studyItem.date);
        reviewDate.setDate(reviewDate.getDate() + reviewDay);

        items.push({
          date: reviewDate,
          volume: studyItem.volume,
          volumeTitle: studyItem.volumeTitle,
          chapter: studyItem.chapter,
          topic: `[REVISÃO] ${studyItem.topic}`,
          duration: Math.ceil(studyItem.duration / 2), // Revisão leva metade do tempo
          type: "review",
          reviewDay,
        });
      });
    });

    // Ordenar por data
    return items.sort((a, b) => a.date.getTime() - b.date.getTime());
  }, [startDate, includeComplementary]);

  // Estatísticas
  const stats = useMemo(() => {
    const studyItems = schedule.filter((item) => item.type === "study");
    const reviewItems = schedule.filter((item) => item.type === "review");
    const totalMinutes = schedule.reduce((acc, item) => acc + item.duration, 0);
    const totalDays = new Set(schedule.map((item) => item.date.toDateString())).size;
    const endDate = schedule.length > 0 ? schedule[schedule.length - 1].date : new Date();

    return {
      studyItems: studyItems.length,
      reviewItems: reviewItems.length,
      totalMinutes,
      totalHours: Math.round((totalMinutes / 60) * 10) / 10,
      totalDays,
      endDate,
    };
  }, [schedule]);

  // Agrupar por semana
  const scheduleByWeek = useMemo(() => {
    const weeks: { [key: string]: ScheduleItem[] } = {};

    schedule.forEach((item) => {
      const weekStart = new Date(item.date);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split("T")[0];

      if (!weeks[weekKey]) {
        weeks[weekKey] = [];
      }
      weeks[weekKey].push(item);
    });

    return weeks;
  }, [schedule]);

  // Exportar como CSV
  const exportCSV = () => {
    const csv = [
      ["Data", "Volume", "Capítulo", "Tópico", "Duração (min)", "Tipo"].join(","),
      ...schedule.map((item) =>
        [
          item.date.toLocaleDateString("pt-BR"),
          `Vol ${item.volume}`,
          item.chapter,
          item.topic,
          item.duration,
          item.type === "study" ? "Estudo" : "Revisão",
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
          Crie um cronograma personalizado com 2 horas diárias de estudo e revisões automáticas
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Total</p>
                <p className="text-3xl font-bold text-primary">{stats.totalHours}h</p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Dias de Estudo</p>
                <p className="text-3xl font-bold text-green-600">{stats.totalDays}</p>
              </div>
              <Calendar className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sessões de Estudo</p>
                <p className="text-3xl font-bold text-purple-600">{stats.studyItems}</p>
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

        {/* Cronograma por Semana */}
        <div className="space-y-6">
          {Object.entries(scheduleByWeek).map(([weekStart, items]) => {
            const weekDate = new Date(weekStart);
            const weekEnd = new Date(weekDate);
            weekEnd.setDate(weekEnd.getDate() + 6);

            return (
              <Card key={weekStart} className="p-6 bg-white shadow-sm">
                <h3 className="text-lg font-bold text-foreground mb-4">
                  Semana de {weekDate.toLocaleDateString("pt-BR")} a{" "}
                  {weekEnd.toLocaleDateString("pt-BR")}
                </h3>

                <div className="space-y-3">
                  {items.map((item, index) => (
                    <div
                      key={index}
                      className={`p-4 rounded-lg border-l-4 ${
                        item.type === "study"
                          ? "bg-blue-50 border-blue-500"
                          : "bg-green-50 border-green-500"
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-semibold text-foreground">
                            {item.date.toLocaleDateString("pt-BR", {
                              weekday: "long",
                              day: "numeric",
                              month: "long",
                            })}
                          </p>
                          <p className="text-sm text-muted-foreground">
                            Vol {item.volume} - {item.volumeTitle}
                          </p>
                        </div>
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.type === "study"
                              ? "bg-blue-200 text-blue-800"
                              : "bg-green-200 text-green-800"
                          }`}
                        >
                          {item.type === "study" ? "Estudo" : "Revisão"}
                          {item.reviewDay && ` (${item.reviewDay}d)`}
                        </span>
                      </div>
                      <p className="text-foreground mb-1">{item.chapter}</p>
                      <p className="text-foreground font-medium mb-2">{item.topic}</p>
                      <p className="text-sm text-muted-foreground">
                        ⏱️ {item.duration} minutos
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            );
          })}
        </div>

        {/* Resumo Final */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200 mt-8">
          <h2 className="text-xl font-bold text-foreground mb-4">Resumo do Cronograma</h2>
          <div className="space-y-2 text-sm text-foreground">
            <p>
              📚 <strong>Total de Sessões:</strong> {stats.studyItems} aulas +{" "}
              {stats.reviewItems} revisões
            </p>
            <p>
              ⏱️ <strong>Tempo Total:</strong> {stats.totalHours} horas ({stats.totalMinutes}{" "}
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
              ✅ <strong>Data Final Estimada:</strong>{" "}
              {stats.endDate.toLocaleDateString("pt-BR")}
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}

import { useState, useMemo, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, Clock, BookOpen, AlertCircle, CheckCircle2, TrendingUp, Zap, ArrowRight } from "lucide-react";
import { fmeVolumes } from "@/data/fmeVolumes";

interface StudyLog {
  id: string;
  date: string;
  hours: number;
  minutes: number;
  volume: string;
  volumeNumber: number;
  chapter: string;
  topic: string;
  status: "continuing" | "completed" | "review";
  generateReviews: boolean;
  observations: string;
  timestamp: Date;
}

interface ScheduledReview {
  id: string;
  topic: string;
  daysAfter: number;
  scheduledDate: Date;
  completed: boolean;
}

export default function StudyPlanner() {
  // Carregar dados do Registrador
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem("studyLogs");
    return saved
      ? JSON.parse(saved).map((log: any) => ({
          ...log,
          timestamp: new Date(log.timestamp),
        }))
      : [];
  });

  const [reviews, setReviews] = useState<ScheduledReview[]>(() => {
    const saved = localStorage.getItem("scheduledReviews");
    return saved
      ? JSON.parse(saved).map((r: any) => ({
          ...r,
          scheduledDate: new Date(r.scheduledDate),
        }))
      : [];
  });

  // Criar lista de todos os tópicos em ordem
  const allTopics = useMemo(() => {
    const topics: Array<{
      id: string;
      volume: string;
      volumeNumber: number;
      chapter: string;
      topic: string;
      durationMinutes: number;
    }> = [];

    fmeVolumes.forEach((volume) => {
      volume.chapters.forEach((chapter) => {
        chapter.topics.forEach((topic) => {
          topics.push({
            id: `${volume.id}_${chapter.id}_${topic.id}`,
            volume: volume.title,
            volumeNumber: volume.number,
            chapter: chapter.name,
            topic: topic.name,
            durationMinutes: topic.durationMinutes || 60,
          });
        });
      });
    });

    return topics;
  }, []);

  // Encontrar próximo tópico a estudar
  const nextTopicToStudy = useMemo(() => {
    // Encontrar quais tópicos foram marcados como "concluídos" no Registrador
    const completedTopics = new Set(
      studyLogs
        .filter((log) => log.status === "completed")
        .map((log) => `${log.volume}_${log.chapter}_${log.topic}`)
    );

    // Encontrar o primeiro tópico não concluído
    for (const topic of allTopics) {
      const topicKey = `${topic.volume}_${topic.chapter}_${topic.topic}`;
      if (!completedTopics.has(topicKey)) {
        return topic;
      }
    }

    return null;
  }, [studyLogs, allTopics]);

  // Calcular estatísticas
  const stats = useMemo(() => {
    const totalMinutesStudied = studyLogs.reduce((acc, log) => acc + log.hours * 60 + log.minutes, 0);
    const totalHoursStudied = Math.floor(totalMinutesStudied / 60);
    const remainingMinutes = totalMinutesStudied % 60;

    const completedTheories = studyLogs.filter((log) => log.status === "completed").length;
    const continuingStudies = studyLogs.filter((log) => log.status === "continuing").length;
    const completedReviews = reviews.filter((r) => r.completed).length;
    const pendingReviews = reviews.filter((r) => !r.completed).length;
    const overdueReviews = reviews.filter(
      (r) => !r.completed && new Date(r.scheduledDate) < new Date()
    ).length;

    const progressPercentage = Math.round((completedTheories / allTopics.length) * 100);

    return {
      totalHoursStudied,
      remainingMinutes,
      completedTheories,
      continuingStudies,
      completedReviews,
      pendingReviews,
      overdueReviews,
      progressPercentage,
      totalTopics: allTopics.length,
    };
  }, [studyLogs, reviews, allTopics]);

  // Agrupar estudos por volume
  const studiesByVolume = useMemo(() => {
    const grouped: { [key: string]: StudyLog[] } = {};

    studyLogs.forEach((log) => {
      if (!grouped[log.volume]) {
        grouped[log.volume] = [];
      }
      grouped[log.volume].push(log);
    });

    return grouped;
  }, [studyLogs]);

  // Próximas revisões vencidas
  const overdueReviewsList = useMemo(() => {
    return reviews
      .filter((r) => !r.completed && new Date(r.scheduledDate) < new Date())
      .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
      .slice(0, 5);
  }, [reviews]);

  const toggleReviewCompletion = (reviewId: string) => {
    const newReviews = reviews.map((r) =>
      r.id === reviewId ? { ...r, completed: !r.completed } : r
    );
    setReviews(newReviews);
    localStorage.setItem("scheduledReviews", JSON.stringify(newReviews));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Planejador & Progresso</h1>
        <p className="text-muted-foreground mb-8">Acompanhe seu progresso real vs. planejado</p>

        {/* Estatísticas Principais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Progresso</p>
                <p className="text-3xl font-bold text-blue-600">{stats.progressPercentage}%</p>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.completedTheories}/{stats.totalTopics}
                </p>
              </div>
              <TrendingUp className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Tempo Total</p>
                <p className="text-3xl font-bold text-green-600">
                  {stats.totalHoursStudied}h
                </p>
                <p className="text-xs text-muted-foreground mt-1">{stats.remainingMinutes}m</p>
              </div>
              <Clock className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Teorias</p>
                <p className="text-3xl font-bold text-purple-600">{stats.completedTheories}</p>
                <p className="text-xs text-muted-foreground mt-1">concluídas</p>
              </div>
              <BookOpen className="text-purple-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Revisões</p>
                <p className="text-3xl font-bold text-indigo-600">
                  {stats.completedReviews}/{reviews.length}
                </p>
                <p className="text-xs text-muted-foreground mt-1">concluídas</p>
              </div>
              <CheckCircle2 className="text-indigo-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Pendentes</p>
                <p className="text-3xl font-bold text-orange-600">{stats.pendingReviews}</p>
                <p className="text-xs text-muted-foreground mt-1">revisões</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground mb-1">Vencidas</p>
                <p className="text-3xl font-bold text-red-600">{stats.overdueReviews}</p>
                <p className="text-xs text-muted-foreground mt-1">urgentes</p>
              </div>
              <Zap className="text-red-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Abas */}
        <Tabs defaultValue="next" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="next">Próximo Tópico</TabsTrigger>
            <TabsTrigger value="progress">Progresso</TabsTrigger>
            <TabsTrigger value="reviews">Revisões Vencidas</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Aba: Próximo Tópico */}
          <TabsContent value="next">
            <Card className="p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Próximo Tópico a Estudar</h2>

              {nextTopicToStudy ? (
                <div className="space-y-6">
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border-2 border-blue-200">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Volume {nextTopicToStudy.volumeNumber}</p>
                        <h3 className="text-3xl font-bold text-foreground mb-2">{nextTopicToStudy.topic}</h3>
                        <p className="text-lg text-muted-foreground">{nextTopicToStudy.chapter}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-4xl font-bold text-blue-600">
                          {Math.floor(nextTopicToStudy.durationMinutes / 60)}h {nextTopicToStudy.durationMinutes % 60}m
                        </p>
                        <p className="text-sm text-muted-foreground mt-1">tempo estimado</p>
                      </div>
                    </div>

                    <div className="flex gap-4 mt-6">
                      <Button className="flex-1 bg-blue-600 text-white hover:bg-blue-700">
                        <ArrowRight className="mr-2" size={20} />
                        Ir para Registrador
                      </Button>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="p-4 bg-slate-50">
                      <p className="text-sm text-muted-foreground mb-2">Posição na Fila</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.completedTheories + 1} de {stats.totalTopics}
                      </p>
                    </Card>

                    <Card className="p-4 bg-slate-50">
                      <p className="text-sm text-muted-foreground mb-2">Tópicos Restantes</p>
                      <p className="text-2xl font-bold text-foreground">
                        {stats.totalTopics - stats.completedTheories}
                      </p>
                    </Card>

                    <Card className="p-4 bg-slate-50">
                      <p className="text-sm text-muted-foreground mb-2">Tempo Restante (aprox)</p>
                      <p className="text-2xl font-bold text-foreground">
                        {Math.round(
                          ((stats.totalTopics - stats.completedTheories) * 60) / 60
                        )}h
                      </p>
                    </Card>
                  </div>
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Parabéns!</h3>
                  <p className="text-muted-foreground">Você completou todos os tópicos!</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Aba: Progresso */}
          <TabsContent value="progress">
            <Card className="p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Progresso por Volume</h2>

              <div className="space-y-6">
                {Object.entries(studiesByVolume).map(([volumeName, logs]) => {
                  const volume = fmeVolumes.find((v) => v.title === volumeName);
                  const completedCount = logs.filter((l) => l.status === "completed").length;
                  const percentage = Math.round((completedCount / logs.length) * 100);

                  return (
                    <div key={volumeName} className="p-6 border border-border rounded-lg">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h3 className="text-lg font-semibold text-foreground">{volumeName}</h3>
                          <p className="text-sm text-muted-foreground">
                            {completedCount} de {logs.length} tópicos concluídos
                          </p>
                        </div>
                        <p className="text-3xl font-bold text-blue-600">{percentage}%</p>
                      </div>

                      <div className="w-full bg-gray-200 rounded-full h-3">
                        <div
                          className="bg-blue-600 h-3 rounded-full transition-all duration-300"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                    </div>
                  );
                })}

                {Object.keys(studiesByVolume).length === 0 && (
                  <p className="text-center text-muted-foreground py-8">
                    Nenhum estudo registrado ainda. Comece a estudar!
                  </p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Aba: Revisões Vencidas */}
          <TabsContent value="reviews">
            <Card className="p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Revisões Vencidas</h2>

              {overdueReviewsList.length > 0 ? (
                <div className="space-y-4">
                  {overdueReviewsList.map((review) => {
                    const daysOverdue = Math.floor(
                      (new Date().getTime() - new Date(review.scheduledDate).getTime()) /
                        (1000 * 60 * 60 * 24)
                    );

                    return (
                      <div
                        key={review.id}
                        className="p-4 bg-red-50 border-2 border-red-200 rounded-lg flex items-center justify-between"
                      >
                        <div>
                          <p className="font-semibold text-foreground">{review.topic}</p>
                          <p className="text-sm text-red-600">
                            Vencida há {daysOverdue} dia{daysOverdue !== 1 ? "s" : ""}
                          </p>
                        </div>
                        <Button
                          onClick={() => toggleReviewCompletion(review.id)}
                          className="bg-red-600 text-white hover:bg-red-700"
                        >
                          Marcar como Concluída
                        </Button>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
                  <h3 className="text-2xl font-bold text-foreground mb-2">Tudo em dia!</h3>
                  <p className="text-muted-foreground">Não há revisões vencidas.</p>
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Aba: Histórico */}
          <TabsContent value="history">
            <Card className="p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Histórico de Estudos</h2>

              {studyLogs.length > 0 ? (
                <div className="space-y-3">
                  {studyLogs
                    .slice()
                    .reverse()
                    .slice(0, 20)
                    .map((log) => (
                      <div
                        key={log.id}
                        className="p-4 border border-border rounded-lg flex items-start justify-between hover:bg-slate-50 transition-colors"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {log.date}
                            </span>
                            <span
                              className={`text-xs font-semibold px-2 py-1 rounded ${
                                log.status === "completed"
                                  ? "bg-green-100 text-green-700"
                                  : "bg-gray-100 text-gray-700"
                              }`}
                            >
                              {log.status === "completed" ? "Concluído" : "Continuando"}
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground">{log.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            {log.volume} • {log.chapter} • {log.hours}h {log.minutes}m
                          </p>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-8">Nenhum estudo registrado ainda</p>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Play, Pause, RotateCcw, Trash2, Clock, CheckCircle2, AlertCircle, BookOpen, Zap } from "lucide-react";
import { toast } from "sonner";
import { fmeVolumes, getTopicsByVolume } from "@/data/fmeVolumes";

interface StudySession {
  id: string;
  volume: string;
  topic: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  completedReviews: number[];
}

interface ScheduledReview {
  id: string;
  sessionId: string;
  volume: string;
  topic: string;
  daysAfter: number;
  scheduledDate: Date;
  completed: boolean;
}

interface CompletedVolume {
  id: string;
  volumeId: string;
  volumeTitle: string;
  completionDate: Date;
  reviews: ScheduledReview[];
}

export default function Schedule() {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("studySessions");
    return saved ? JSON.parse(saved) : [];
  });

  const [reviews, setReviews] = useState<ScheduledReview[]>(() => {
    const saved = localStorage.getItem("scheduledReviews");
    return saved ? JSON.parse(saved).map((r: any) => ({
      ...r,
      scheduledDate: new Date(r.scheduledDate),
    })) : [];
  });

  const [completedVolumes, setCompletedVolumes] = useState<CompletedVolume[]>(() => {
    const saved = localStorage.getItem("completedVolumes");
    return saved ? JSON.parse(saved).map((v: any) => ({
      ...v,
      completionDate: new Date(v.completionDate),
      reviews: v.reviews.map((r: any) => ({
        ...r,
        scheduledDate: new Date(r.scheduledDate),
      })),
    })) : [];
  });

  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [selectedVolumeId, setSelectedVolumeId] = useState("");
  const [selectedTopicId, setSelectedTopicId] = useState("");

  const selectedVolume = fmeVolumes.find((v) => v.id === selectedVolumeId);
  const topicsForVolume = selectedVolumeId ? getTopicsByVolume(selectedVolumeId) : [];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerActive) {
      interval = setInterval(() => {
        setTimerSeconds((s) => s + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerActive]);

  useEffect(() => {
    localStorage.setItem("studySessions", JSON.stringify(sessions));
  }, [sessions]);

  useEffect(() => {
    localStorage.setItem("scheduledReviews", JSON.stringify(reviews));
  }, [reviews]);

  useEffect(() => {
    localStorage.setItem("completedVolumes", JSON.stringify(completedVolumes));
  }, [completedVolumes]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const startSession = () => {
    if (!selectedVolume || !selectedTopicId) {
      toast.error("Selecione um volume e um tópico");
      return;
    }
    const topic = topicsForVolume.find((t) => t.id === selectedTopicId);
    setTimerActive(true);
    toast.success(`Sessão de estudo iniciada: ${topic?.name}`);
  };

  const endSession = () => {
    if (timerSeconds === 0) {
      toast.error("Nenhum tempo de estudo registrado");
      return;
    }

    const topic = topicsForVolume.find((t) => t.id === selectedTopicId);
    const volumeTitle = `Volume ${selectedVolume!.number} - ${selectedVolume!.title}`;
    const newSession: StudySession = {
      id: Date.now().toString(),
      volume: volumeTitle,
      topic: topic?.name || "",
      duration: Math.ceil(timerSeconds / 60),
      startTime: new Date(Date.now() - timerSeconds * 1000),
      endTime: new Date(),
      completedReviews: [],
    };

    setSessions([...sessions, newSession]);

    const reviewDays = [1, 7, 14, 30, 90];
    const newReviews = reviewDays.map((days) => {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + days);
      return {
        id: `${newSession.id}-${days}`,
        sessionId: newSession.id,
        volume: volumeTitle,
        topic: topic?.name || "",
        daysAfter: days,
        scheduledDate,
        completed: false,
      };
    });

    setReviews([...reviews, ...newReviews]);

    setTimerActive(false);
    setTimerSeconds(0);
    setSelectedTopicId("");

    toast.success(`Sessão salva! ${newReviews.length} revisões agendadas.`);
  };

  const completeVolume = () => {
    if (!selectedVolume) {
      toast.error("Selecione um volume");
      return;
    }

    const volumeTitle = `Volume ${selectedVolume.number} - ${selectedVolume.title}`;
    
    // Verificar se o volume já foi marcado como completo
    if (completedVolumes.some((v) => v.volumeId === selectedVolumeId)) {
      toast.error("Este volume já foi marcado como completo");
      return;
    }

    const reviewDays = [1, 7, 14, 30, 90];
    const volumeReviews = reviewDays.map((days) => {
      const scheduledDate = new Date();
      scheduledDate.setDate(scheduledDate.getDate() + days);
      return {
        id: `volume-${selectedVolumeId}-${days}`,
        sessionId: `volume-${selectedVolumeId}`,
        volume: volumeTitle,
        topic: `Revisão Completa - ${selectedVolume.title}`,
        daysAfter: days,
        scheduledDate,
        completed: false,
      };
    });

    const newCompletedVolume: CompletedVolume = {
      id: `completed-${selectedVolumeId}-${Date.now()}`,
      volumeId: selectedVolumeId,
      volumeTitle,
      completionDate: new Date(),
      reviews: volumeReviews,
    };

    setCompletedVolumes([...completedVolumes, newCompletedVolume]);
    setReviews([...reviews, ...volumeReviews]);

    setSelectedVolumeId("");
    setSelectedTopicId("");
    setTimerSeconds(0);

    toast.success(`🎉 ${volumeTitle} marcado como completo! ${volumeReviews.length} revisões agendadas automaticamente.`);
  };

  const pauseSession = () => {
    setTimerActive(false);
    toast.info("Sessão pausada");
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    setSelectedTopicId("");
    toast.info("Timer reiniciado");
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    setReviews(reviews.filter((r) => r.sessionId !== id));
    toast.success("Sessão removida");
  };

  const markReviewComplete = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, completed: true } : r
      )
    );
    toast.success("Revisão marcada como concluída");
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Revisão removida");
  };

  const totalStudyTime = sessions.reduce((acc, s) => acc + s.duration, 0);
  const completedReviews = reviews.filter((r) => r.completed).length;
  const pendingReviews = reviews.filter((r) => !r.completed).length;
  const overdueReviews = reviews.filter(
    (r) => !r.completed && new Date(r.scheduledDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Cronograma de Estudos</h1>
          <p className="text-slate-600">Marque seu tempo de estudo e acompanhe as revisões agendadas automaticamente</p>
        </div>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-4 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Tempo Total de Estudo</p>
                <p className="text-2xl font-bold text-slate-900">{Math.floor(totalStudyTime / 60)}h {totalStudyTime % 60}m</p>
              </div>
              <Clock className="w-8 h-8 text-blue-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Revisões Concluídas</p>
                <p className="text-2xl font-bold text-green-600">{completedReviews}</p>
              </div>
              <CheckCircle2 className="w-8 h-8 text-green-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Revisões Pendentes</p>
                <p className="text-2xl font-bold text-orange-600">{pendingReviews}</p>
              </div>
              <AlertCircle className="w-8 h-8 text-orange-500" />
            </div>
          </Card>

          <Card className="p-4 bg-white border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-600">Volumes Completos</p>
                <p className="text-2xl font-bold text-purple-600">{completedVolumes.length}</p>
              </div>
              <BookOpen className="w-8 h-8 text-purple-500" />
            </div>
          </Card>
        </div>

        {/* Abas */}
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-4 bg-white border border-slate-200">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="future">Futuras</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Timer */}
          <TabsContent value="timer" className="mt-6">
            <Card className="p-8 bg-white border-slate-200">
              <div className="text-center mb-8">
                <p className="text-slate-600 mb-4">Tempo de Estudo</p>
                <div className="text-6xl font-bold text-blue-600 font-mono mb-8">
                  {formatTime(timerSeconds)}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Volume</label>
                    <Select value={selectedVolumeId} onValueChange={setSelectedVolumeId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {fmeVolumes.map((vol) => (
                          <SelectItem key={vol.id} value={vol.id}>
                            Volume {vol.number} - {vol.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">Tópico</label>
                    <Select value={selectedTopicId} onValueChange={setSelectedTopicId} disabled={!selectedVolumeId}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Selecione um tópico" />
                      </SelectTrigger>
                      <SelectContent>
                        {topicsForVolume.map((topic) => (
                          <SelectItem key={topic.id} value={topic.id}>
                            {topic.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex gap-4 justify-center flex-wrap">
                  <Button
                    onClick={startSession}
                    disabled={timerActive}
                    className="bg-blue-600 hover:bg-blue-700 text-white"
                  >
                    <Play className="w-4 h-4 mr-2" />
                    Iniciar Estudo
                  </Button>
                  <Button
                    onClick={pauseSession}
                    disabled={!timerActive}
                    variant="outline"
                  >
                    <Pause className="w-4 h-4 mr-2" />
                    Pausar
                  </Button>
                  <Button
                    onClick={resetTimer}
                    variant="outline"
                  >
                    <RotateCcw className="w-4 h-4 mr-2" />
                    Reiniciar
                  </Button>
                  <Button
                    onClick={endSession}
                    disabled={timerSeconds === 0}
                    className="bg-green-600 hover:bg-green-700 text-white"
                  >
                    <CheckCircle2 className="w-4 h-4 mr-2" />
                    Finalizar Sessão
                  </Button>
                </div>

                <div className="mt-8 pt-8 border-t border-slate-200">
                  <p className="text-slate-600 mb-4">Marcar Volume como Completo</p>
                  <p className="text-sm text-slate-500 mb-4">Ao marcar um volume como completo, 5 revisões serão agendadas automaticamente (1, 7, 14, 30 e 90 dias)</p>
                  <Button
                    onClick={completeVolume}
                    disabled={!selectedVolumeId}
                    className="bg-purple-600 hover:bg-purple-700 text-white"
                  >
                    <Zap className="w-4 h-4 mr-2" />
                    Marcar Volume como Completo
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Próximas Revisões */}
          <TabsContent value="upcoming" className="mt-6">
            <Card className="p-6 bg-white border-slate-200">
              {overdueReviews > 0 && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">⚠️ {overdueReviews} revisão(ões) vencida(s)</p>
                </div>
              )}

              {reviews.filter((r) => !r.completed && new Date(r.scheduledDate) <= new Date(Date.now() + 86400000)).length === 0 ? (
                <p className="text-slate-500 text-center py-8">Nenhuma revisão próxima nos próximos 24 horas</p>
              ) : (
                <div className="space-y-4">
                  {reviews
                    .filter((r) => !r.completed && new Date(r.scheduledDate) <= new Date(Date.now() + 86400000))
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .map((review) => (
                      <Card key={review.id} className="p-4 border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{review.volume}</p>
                            <p className="text-sm text-slate-600">{review.topic}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Revisão de {review.daysAfter} dias - {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => markReviewComplete(review.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Concluir
                            </Button>
                            <Button
                              onClick={() => deleteReview(review.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Futuras Revisões */}
          <TabsContent value="future" className="mt-6">
            <Card className="p-6 bg-white border-slate-200">
              {reviews.filter((r) => !r.completed && new Date(r.scheduledDate) > new Date(Date.now() + 86400000)).length === 0 ? (
                <p className="text-slate-500 text-center py-8">Nenhuma revisão futura agendada</p>
              ) : (
                <div className="space-y-4">
                  {reviews
                    .filter((r) => !r.completed && new Date(r.scheduledDate) > new Date(Date.now() + 86400000))
                    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                    .map((review) => (
                      <Card key={review.id} className="p-4 border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{review.volume}</p>
                            <p className="text-sm text-slate-600">{review.topic}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              Revisão de {review.daysAfter} dias - {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => markReviewComplete(review.id)}
                              size="sm"
                              className="bg-green-600 hover:bg-green-700 text-white"
                            >
                              Concluir
                            </Button>
                            <Button
                              onClick={() => deleteReview(review.id)}
                              size="sm"
                              variant="outline"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Histórico */}
          <TabsContent value="history" className="mt-6">
            <Card className="p-6 bg-white border-slate-200">
              {sessions.length === 0 ? (
                <p className="text-slate-500 text-center py-8">Nenhuma sessão de estudo registrada</p>
              ) : (
                <div className="space-y-4">
                  {sessions
                    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
                    .map((session) => (
                      <Card key={session.id} className="p-4 border-slate-200">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-slate-900">{session.volume}</p>
                            <p className="text-sm text-slate-600">{session.topic}</p>
                            <p className="text-xs text-slate-500 mt-2">
                              {Math.floor(session.duration / 60)}h {session.duration % 60}m - {new Date(session.endTime).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Button
                            onClick={() => deleteSession(session.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

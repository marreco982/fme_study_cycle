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
import { Play, Pause, RotateCcw, Trash2, Clock, CheckCircle2, AlertCircle, BookOpen, Zap, Check, Save, RotateCw } from "lucide-react";
import { toast } from "sonner";
import { fmeVolumes, getTopicsByVolume, Topic } from "@/data/fmeVolumes";

interface StudySession {
  id: string;
  volume: string;
  volumeNumber: number;
  chapter: string;
  topic: string;
  duration: number;
  startTime: Date;
  endTime: Date;
  completedReviews: number[];
  isCompleted: boolean;
}

interface IncompleteSession {
  id: string;
  volume: string;
  volumeNumber: number;
  chapter: string;
  topic: string;
  duration: number;
  startTime: Date;
  pausedTime: number;
  isPaused: boolean;
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

interface CompletedTopic {
  id: string;
  volumeId: string;
  topicId: string;
  topicName: string;
  completionDate: Date;
}

export default function Schedule() {
  const [sessions, setSessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("studySessions");
    return saved ? JSON.parse(saved).map((s: any) => ({
      ...s,
      startTime: new Date(s.startTime),
      endTime: new Date(s.endTime),
    })) : [];
  });

  const [incompleteSession, setIncompleteSession] = useState<IncompleteSession | null>(() => {
    const saved = localStorage.getItem("incompleteSession");
    return saved ? JSON.parse(saved).map((s: any) => ({
      ...s,
      startTime: new Date(s.startTime),
    })) : null;
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

  const [completedTopics, setCompletedTopics] = useState<CompletedTopic[]>(() => {
    const saved = localStorage.getItem("completedTopics");
    return saved ? JSON.parse(saved).map((t: any) => ({
      ...t,
      completionDate: new Date(t.completionDate),
    })) : [];
  });

  const [timerActive, setTimerActive] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(incompleteSession?.duration || 0);
  const [selectedVolumeId, setSelectedVolumeId] = useState(incompleteSession?.volume || "");
  const [selectedChapterId, setSelectedChapterId] = useState(incompleteSession?.chapter || "");
  const [selectedTopicId, setSelectedTopicId] = useState(incompleteSession?.topic || "");

  const selectedVolume = fmeVolumes.find((v) => v.id === selectedVolumeId);
  const selectedChapter = selectedVolume?.chapters.find((c) => c.id === selectedChapterId);
  const topicsForVolume = selectedVolumeId ? getTopicsByVolume(selectedVolumeId) : [];
  const chaptersForVolume = selectedVolume?.chapters || [];

  // Salvar sessões incompletas
  useEffect(() => {
    if (timerActive || timerSeconds > 0) {
      const incompleteData: IncompleteSession = {
        id: Date.now().toString(),
        volume: selectedVolumeId,
        volumeNumber: selectedVolume?.number || 0,
        chapter: selectedChapterId,
        topic: selectedTopicId,
        duration: timerSeconds,
        startTime: new Date(),
        pausedTime: 0,
        isPaused: !timerActive,
      };
      localStorage.setItem("incompleteSession", JSON.stringify(incompleteData));
    }
  }, [timerSeconds, timerActive, selectedVolumeId, selectedChapterId, selectedTopicId, selectedVolume]);

  // Timer em tempo real
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

  useEffect(() => {
    localStorage.setItem("completedTopics", JSON.stringify(completedTopics));
  }, [completedTopics]);

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`;
  };

  const formatTimeShort = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    }
    return `${minutes}m ${seconds % 60}s`;
  };

  const startSession = () => {
    if (!selectedVolume || !selectedTopicId) {
      toast.error("Selecione um volume e um tópico");
      return;
    }
    const topic = topicsForVolume.find((t: Topic) => t.id === selectedTopicId);
    setTimerActive(true);
    toast.success(`Sessão de estudo iniciada: ${topic?.name}`);
  };

  const pauseSession = () => {
    setTimerActive(false);
    toast.info("Sessão pausada");
  };

  const resumeSession = () => {
    if (!selectedVolume || !selectedTopicId) {
      toast.error("Selecione um volume e um tópico");
      return;
    }
    setTimerActive(true);
    toast.success("Sessão retomada");
  };

  const endSession = () => {
    if (timerSeconds === 0) {
      toast.error("Nenhum tempo de estudo registrado");
      return;
    }

    const topic = topicsForVolume.find((t: Topic) => t.id === selectedTopicId);
    const volumeTitle = `Volume ${selectedVolume!.number} - ${selectedVolume!.title}`;
    const chapterName = selectedChapter?.name || "Capítulo desconhecido";
    
    const newSession: StudySession = {
      id: Date.now().toString(),
      volume: volumeTitle,
      volumeNumber: selectedVolume!.number,
      chapter: chapterName,
      topic: topic?.name || "",
      duration: Math.ceil(timerSeconds / 60),
      startTime: new Date(Date.now() - timerSeconds * 1000),
      endTime: new Date(),
      completedReviews: [],
      isCompleted: true,
    };

    setSessions([...sessions, newSession]);

    // Sincronizar com o calendário
    const calendarEvents = JSON.parse(localStorage.getItem("fmeStudyEvents") || "[]");
    const calendarEvent = {
      id: newSession.id,
      date: new Date().toISOString().split("T")[0],
      title: `Estudo: ${topic?.name || "Tópico"}`,
      type: "content",
      volume: selectedVolume?.number,
      duration: newSession.duration,
      notes: `${volumeTitle} - ${chapterName} - ${topic?.name || ""}`,
    };
    localStorage.setItem("fmeStudyEvents", JSON.stringify([...calendarEvents, calendarEvent]));

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

    // Adicionar revisões ao calendário
    const calendarEventsWithReviews = JSON.parse(localStorage.getItem("fmeStudyEvents") || "[]");
    newReviews.forEach((review) => {
      const reviewEvent = {
        id: review.id,
        date: review.scheduledDate.toISOString().split("T")[0],
        title: `Revisão: ${review.topic}`,
        type: "revision",
        volume: selectedVolume?.number,
        duration: 60,
        notes: `${review.volume}`,
      };
      calendarEventsWithReviews.push(reviewEvent);
    });
    localStorage.setItem("fmeStudyEvents", JSON.stringify(calendarEventsWithReviews));

    // Limpar sessão incompleta
    localStorage.removeItem("incompleteSession");
    setIncompleteSession(null);

    setTimerActive(false);
    setTimerSeconds(0);
    setSelectedVolumeId("");
    setSelectedChapterId("");
    setSelectedTopicId("");

    toast.success(`Sessão salva! ${newReviews.length} revisões agendadas.`);
  };

  const saveIncompleteSession = () => {
    if (timerSeconds === 0) {
      toast.error("Nenhum tempo de estudo para salvar");
      return;
    }

    if (!selectedVolume || !selectedTopicId) {
      toast.error("Selecione um volume e um tópico");
      return;
    }

    const topic = topicsForVolume.find((t: Topic) => t.id === selectedTopicId);
    toast.success(`Sessão salva: ${topic?.name} (${formatTimeShort(timerSeconds)})`);
  };

  const clearIncompleteSession = () => {
    localStorage.removeItem("incompleteSession");
    setIncompleteSession(null);
    setTimerActive(false);
    setTimerSeconds(0);
    setSelectedVolumeId("");
    setSelectedChapterId("");
    setSelectedTopicId("");
    toast.info("Sessão incompleta removida");
  };

  const completeReview = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, completed: true } : r
      )
    );
    toast.success("Revisão marcada como concluída!");
  };

  const completeVolume = () => {
    if (!selectedVolume) {
      toast.error("Selecione um volume");
      return;
    }

    const volumeTitle = `Volume ${selectedVolume.number} - ${selectedVolume.title}`;
    
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
    setSelectedChapterId("");
    setSelectedTopicId("");
    setTimerSeconds(0);

    toast.success(`🎉 ${volumeTitle} marcado como completo! ${volumeReviews.length} revisões agendadas automaticamente.`);
  };

  const markTopicComplete = () => {
    if (!selectedVolume || !selectedTopicId) {
      toast.error("Selecione um volume e um tópico");
      return;
    }

    const topic = topicsForVolume.find((t: Topic) => t.id === selectedTopicId);
    if (!topic) return;

    const isAlreadyCompleted = completedTopics.some(
      (t) => t.topicId === selectedTopicId && t.volumeId === selectedVolumeId
    );

    if (isAlreadyCompleted) {
      toast.error("Este tópico já foi marcado como concluído");
      return;
    }

    const newCompletedTopic: CompletedTopic = {
      id: `topic-${selectedVolumeId}-${selectedTopicId}-${Date.now()}`,
      volumeId: selectedVolumeId,
      topicId: selectedTopicId,
      topicName: topic.name,
      completionDate: new Date(),
    };

    setCompletedTopics([...completedTopics, newCompletedTopic]);
    toast.success(`✓ Tópico "${topic.name}" marcado como concluído!`);
  };

  const isTopicCompleted = (volumeId: string, topicId: string) => {
    return completedTopics.some((t) => t.volumeId === volumeId && t.topicId === topicId);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerSeconds(0);
    setSelectedVolumeId("");
    setSelectedChapterId("");
    setSelectedTopicId("");
    localStorage.removeItem("incompleteSession");
    setIncompleteSession(null);
    toast.info("Timer reiniciado");
  };

  const deleteSession = (id: string) => {
    setSessions(sessions.filter((s) => s.id !== id));
    setReviews(reviews.filter((r: ScheduledReview) => r.sessionId !== id));
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
  const reviewTimeCompleted = reviews.filter((r) => r.completed).length * 60;
  const totalTimeIncludingReviews = totalStudyTime + reviewTimeCompleted;
  const completedReviews = reviews.filter((r) => r.completed).length;
  const pendingReviews = reviews.filter((r) => !r.completed).length;
  const overdueReviews = reviews.filter(
    (r) => !r.completed && new Date(r.scheduledDate) < new Date()
  ).length;
  const totalTopicsCompleted = completedTopics.length;

  const formatHours = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Cronômetro de Estudos</h1>
        <p className="text-muted-foreground mb-8">Rastreie suas sessões de estudo em tempo real</p>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Total Estudado</p>
                <p className="text-3xl font-bold text-primary">{formatHours(totalStudyTime)}</p>
              </div>
              <Clock size={32} className="text-blue-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Sessões Completas</p>
                <p className="text-3xl font-bold text-green-600">{sessions.length}</p>
              </div>
              <CheckCircle2 size={32} className="text-green-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Concluídas</p>
                <p className="text-3xl font-bold text-purple-600">{completedReviews}</p>
              </div>
              <Zap size={32} className="text-purple-500" />
            </div>
          </Card>

          <Card className="p-6 bg-white border-0 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tópicos Concluídos</p>
                <p className="text-3xl font-bold text-orange-600">{totalTopicsCompleted}</p>
              </div>
              <BookOpen size={32} className="text-orange-500" />
            </div>
          </Card>
        </div>

        {/* Abas */}
        <Tabs defaultValue="timer" className="w-full">
          <TabsList className="grid w-full grid-cols-4 mb-8">
            <TabsTrigger value="timer">Cronômetro</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="future">Futuras</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          {/* Aba Cronômetro */}
          <TabsContent value="timer" className="space-y-6">
            <Card className="p-8 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <h2 className="text-2xl font-bold text-foreground mb-8">Cronômetro em Tempo Real</h2>
              
              {/* Display do Cronômetro */}
              <div className="text-center mb-8 p-8 bg-white rounded-lg shadow-sm border-2 border-blue-300">
                <div className="text-7xl font-bold text-blue-600 font-mono mb-4">
                  {formatTime(timerSeconds)}
                </div>
                <p className="text-sm text-muted-foreground">
                  {timerActive ? "⏱️ Cronômetro em execução..." : "⏸️ Cronômetro pausado"}
                </p>
              </div>

              {/* Seleção de Volume, Capítulo e Tópico */}
              <div className="space-y-4 mb-8">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Volume</label>
                  <Select value={selectedVolumeId} onValueChange={(value) => {
                    setSelectedVolumeId(value);
                    setSelectedChapterId("");
                    setSelectedTopicId("");
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um volume" />
                    </SelectTrigger>
                    <SelectContent>
                      {fmeVolumes.map((volume) => (
                        <SelectItem key={volume.id} value={volume.id}>
                          Volume {volume.number} - {volume.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedVolume && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">Capítulo</label>
                    <Select value={selectedChapterId} onValueChange={(value) => {
                      setSelectedChapterId(value);
                      setSelectedTopicId("");
                    }}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um capítulo" />
                      </SelectTrigger>
                      <SelectContent>
                        {chaptersForVolume.map((chapter) => (
                          <SelectItem key={chapter.id} value={chapter.id}>
                            {chapter.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">Tópico</label>
                  <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione um tópico" />
                    </SelectTrigger>
                    <SelectContent>
                      {topicsForVolume.map((topic: Topic) => {
                        const isCompleted = isTopicCompleted(selectedVolumeId, topic.id);
                        return (
                          <SelectItem key={topic.id} value={topic.id}>
                            {isCompleted ? "✓ " : ""}{topic.name}
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Controles do Cronômetro */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={startSession}
                  disabled={timerActive}
                  className="flex-1 bg-green-600 hover:bg-green-700 text-white"
                >
                  <Play size={18} className="mr-2" />
                  Iniciar
                </Button>
                <Button
                  onClick={pauseSession}
                  disabled={!timerActive}
                  variant="outline"
                  className="flex-1"
                >
                  <Pause size={18} className="mr-2" />
                  Pausar
                </Button>
                <Button
                  onClick={resumeSession}
                  disabled={timerActive || timerSeconds === 0}
                  variant="outline"
                  className="flex-1"
                >
                  <RotateCw size={18} className="mr-2" />
                  Retomar
                </Button>
                <Button onClick={resetTimer} variant="outline" className="flex-1">
                  <RotateCcw size={18} className="mr-2" />
                  Reiniciar
                </Button>
              </div>

              {/* Botões de Ação */}
              <div className="flex gap-3 mb-8">
                <Button
                  onClick={endSession}
                  disabled={timerSeconds === 0}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                >
                  <Check size={18} className="mr-2" />
                  Finalizar Sessão
                </Button>
                <Button
                  onClick={saveIncompleteSession}
                  disabled={timerSeconds === 0}
                  variant="outline"
                  className="flex-1"
                >
                  <Save size={18} className="mr-2" />
                  Salvar Progresso
                </Button>
              </div>

              {/* Botões Adicionais */}
              <div className="flex gap-3">
                <Button
                  onClick={markTopicComplete}
                  disabled={!selectedTopicId || isTopicCompleted(selectedVolumeId, selectedTopicId)}
                  className="flex-1 bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <CheckCircle2 size={18} className="mr-2" />
                  Marcar Tópico Completo
                </Button>
              </div>

              <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <p className="text-sm text-blue-900">
                  <strong>💡 Dica:</strong> Seu progresso é salvo automaticamente. Você pode pausar a sessão e retomar depois. Ao finalizar uma sessão, 5 revisões serão agendadas automaticamente (1, 7, 14, 30 e 90 dias).
                </p>
              </div>

              <div className="mt-8">
                <h3 className="text-lg font-bold text-foreground mb-4">Marcar Volume como Completo</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Ao marcar um volume como completo, 5 revisões serão agendadas automaticamente (1, 7, 14, 30 e 90 dias)
                </p>
                <Button
                  onClick={completeVolume}
                  disabled={!selectedVolumeId}
                  className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                >
                  <Zap size={18} className="mr-2" />
                  Marcar Volume como Completo
                </Button>
              </div>
            </Card>
          </TabsContent>

          {/* Aba Próximas */}
          <TabsContent value="upcoming" className="space-y-4">
            <div className="space-y-4">
              {overdueReviews > 0 && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <div className="flex items-center gap-3">
                    <AlertCircle size={24} className="text-red-600" />
                    <div>
                      <p className="font-semibold text-red-900">{overdueReviews} revisões vencidas!</p>
                      <p className="text-sm text-red-700">Você tem revisões que deveriam ter sido feitas</p>
                    </div>
                  </div>
                </Card>
              )}

              {reviews
                .filter((r) => !r.completed && new Date(r.scheduledDate) <= new Date())
                .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
                .map((review) => (
                  <Card key={review.id} className="p-4 bg-white border-l-4 border-l-red-500">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">{review.topic}</p>
                        <p className="text-sm text-muted-foreground">{review.volume}</p>
                        <p className="text-xs text-red-600 mt-2">
                          ⚠️ Vencida em {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => markReviewComplete(review.id)}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check size={16} />
                        </Button>
                        <Button
                          onClick={() => deleteReview(review.id)}
                          size="sm"
                          variant="outline"
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}

              {reviews.filter((r) => !r.completed && new Date(r.scheduledDate) <= new Date()).length === 0 && (
                <Card className="p-8 bg-green-50 border-green-200 text-center">
                  <CheckCircle2 size={48} className="mx-auto text-green-600 mb-4" />
                  <p className="text-green-900 font-semibold">Nenhuma revisão vencida!</p>
                  <p className="text-sm text-green-700">Você está em dia com suas revisões</p>
                </Card>
              )}
            </div>
          </TabsContent>

          {/* Aba Futuras */}
          <TabsContent value="future" className="space-y-4">
            {reviews
              .filter((r) => !r.completed && new Date(r.scheduledDate) > new Date())
              .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime())
              .map((review) => (
                <Card key={review.id} className="p-4 bg-white border-l-4 border-l-blue-500">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="font-semibold text-foreground">{review.topic}</p>
                      <p className="text-sm text-muted-foreground">{review.volume}</p>
                      <p className="text-xs text-blue-600 mt-2">
                        📅 Agendada para {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        onClick={() => markReviewComplete(review.id)}
                        size="sm"
                        className="bg-green-600 hover:bg-green-700"
                      >
                        <Check size={16} />
                      </Button>
                      <Button
                        onClick={() => deleteReview(review.id)}
                        size="sm"
                        variant="outline"
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

            {reviews.filter((r) => !r.completed && new Date(r.scheduledDate) > new Date()).length === 0 && (
              <Card className="p-8 bg-blue-50 border-blue-200 text-center">
                <Clock size={48} className="mx-auto text-blue-600 mb-4" />
                <p className="text-blue-900 font-semibold">Nenhuma revisão futura agendada</p>
                <p className="text-sm text-blue-700">Comece a estudar para agendar revisões</p>
              </Card>
            )}
          </TabsContent>

          {/* Aba Histórico */}
          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              <div className="mb-6">
                <h3 className="text-lg font-bold text-foreground mb-4">Sessões Completas</h3>
                {sessions.length === 0 ? (
                  <Card className="p-8 bg-gray-50 border-gray-200 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-900 font-semibold">Nenhuma sessão completa</p>
                    <p className="text-sm text-gray-700">Comece a estudar para registrar sessões</p>
                  </Card>
                ) : (
                  sessions
                    .sort((a, b) => new Date(b.endTime).getTime() - new Date(a.endTime).getTime())
                    .map((session) => (
                      <Card key={session.id} className="p-4 bg-white border-l-4 border-l-green-500">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{session.topic}</p>
                            <p className="text-sm text-muted-foreground">{session.volume}</p>
                            <p className="text-xs text-gray-600 mt-1">📖 {session.chapter}</p>
                            <p className="text-xs text-green-600 mt-2">
                              ✓ {session.duration} minutos - {new Date(session.endTime).toLocaleDateString("pt-BR")} às {new Date(session.endTime).toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}
                            </p>
                          </div>
                          <Button
                            onClick={() => deleteSession(session.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))
                )}
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-4">Revisões Concluídas</h3>
                {reviews.filter((r) => r.completed).length === 0 ? (
                  <Card className="p-8 bg-gray-50 border-gray-200 text-center">
                    <BookOpen size={48} className="mx-auto text-gray-600 mb-4" />
                    <p className="text-gray-900 font-semibold">Nenhuma revisão concluída</p>
                    <p className="text-sm text-gray-700">Comece a estudar e marque as revisões como concluídas</p>
                  </Card>
                ) : (
                  reviews
                    .filter((r) => r.completed)
                    .sort((a, b) => new Date(b.scheduledDate).getTime() - new Date(a.scheduledDate).getTime())
                    .map((review) => (
                      <Card key={review.id} className="p-4 bg-white border-l-4 border-l-green-500 mb-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <p className="font-semibold text-foreground">{review.topic}</p>
                            <p className="text-sm text-muted-foreground">{review.volume}</p>
                            <p className="text-xs text-green-600 mt-2">
                              ✓ Concluída em {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                            </p>
                          </div>
                          <Button
                            onClick={() => deleteReview(review.id)}
                            size="sm"
                            variant="outline"
                          >
                            <Trash2 size={16} />
                          </Button>
                        </div>
                      </Card>
                    ))
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

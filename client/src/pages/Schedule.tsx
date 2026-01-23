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
import { Play, Pause, RotateCcw, Trash2, Clock, CheckCircle2, AlertCircle } from "lucide-react";
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

    const reviewDays = [1, 7, 30, 90];
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

  const completeReview = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, completed: true } : r
      )
    );
    toast.success("Revisão marcada como concluída!");
  };

  const deleteReview = (reviewId: string) => {
    setReviews(reviews.filter((r) => r.id !== reviewId));
    toast.success("Revisão removida");
  };

  const upcomingReviews = reviews
    .filter((r) => !r.completed && new Date(r.scheduledDate) <= new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const futureReviews = reviews
    .filter((r) => !r.completed && new Date(r.scheduledDate) > new Date())
    .sort((a, b) => new Date(a.scheduledDate).getTime() - new Date(b.scheduledDate).getTime());

  const completedReviews = reviews.filter((r) => r.completed);

  const totalStudyTime = sessions.reduce((acc, s) => acc + s.duration, 0);

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-0 lg:ml-64 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3">
            Cronograma de Estudos
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            Marque seu tempo de estudo e acompanhe as revisões agendadas automaticamente
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-4 mb-8">
          <Card className="p-6 bg-primary/5 border-primary/20">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Total de Estudo</p>
                <p className="text-2xl font-bold text-foreground">{totalStudyTime} min</p>
              </div>
              <Clock className="text-primary" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-green-50 border-green-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Concluídas</p>
                <p className="text-2xl font-bold text-foreground">{completedReviews.length}</p>
              </div>
              <CheckCircle2 className="text-green-600" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-orange-50 border-orange-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Pendentes</p>
                <p className="text-2xl font-bold text-foreground">{upcomingReviews.length + futureReviews.length}</p>
              </div>
              <AlertCircle className="text-orange-600" size={32} />
            </div>
          </Card>
        </div>

        <Tabs defaultValue="timer" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 bg-secondary">
            <TabsTrigger value="timer">Timer</TabsTrigger>
            <TabsTrigger value="upcoming">Próximas</TabsTrigger>
            <TabsTrigger value="future">Futuras</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
          </TabsList>

          <TabsContent value="timer" className="space-y-6">
            <Card className="p-8">
              <div className="space-y-6">
                <div className="text-center">
                  <div className="text-6xl font-bold text-primary mb-4 font-mono">
                    {formatTime(timerSeconds)}
                  </div>
                  <p className="text-muted-foreground mb-6">
                    {timerActive ? "Estudando..." : "Pronto para começar?"}
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Volume
                    </label>
                    <Select value={selectedVolumeId} onValueChange={(id) => {
                      setSelectedVolumeId(id);
                      setSelectedTopicId("");
                    }}>
                      <SelectTrigger>
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
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Tópico
                    </label>
                    <Select value={selectedTopicId} onValueChange={setSelectedTopicId}>
                      <SelectTrigger>
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

                <div className="flex gap-3 justify-center flex-wrap">
                  {!timerActive ? (
                    <Button
                      size="lg"
                      onClick={startSession}
                      className="gap-2"
                    >
                      <Play size={20} />
                      Iniciar Estudo
                    </Button>
                  ) : (
                    <Button
                      size="lg"
                      variant="outline"
                      onClick={pauseSession}
                      className="gap-2"
                    >
                      <Pause size={20} />
                      Pausar
                    </Button>
                  )}

                  <Button
                    size="lg"
                    variant="outline"
                    onClick={resetTimer}
                    className="gap-2"
                  >
                    <RotateCcw size={20} />
                    Reiniciar
                  </Button>

                  <Button
                    size="lg"
                    variant="default"
                    onClick={endSession}
                    disabled={timerSeconds === 0}
                    className="gap-2"
                  >
                    <CheckCircle2 size={20} />
                    Finalizar Sessão
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-4">
            {upcomingReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <AlertCircle className="mx-auto mb-4 text-muted-foreground" size={40} />
                <p className="text-muted-foreground">Nenhuma revisão pendente no momento</p>
              </Card>
            ) : (
              upcomingReviews.map((review) => (
                <Card key={review.id} className="p-6 border-orange-200 bg-orange-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <AlertCircle className="text-orange-600" size={20} />
                        <h3 className="font-semibold text-foreground">
                          Revisão de {review.daysAfter} dia{review.daysAfter !== 1 ? "s" : ""}
                        </h3>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{review.volume}</p>
                      <p className="text-sm text-muted-foreground">{review.topic}</p>
                      <p className="text-xs text-orange-600 mt-2">
                        Vencida em: {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        onClick={() => completeReview(review.id)}
                        className="gap-1"
                      >
                        <CheckCircle2 size={16} />
                        Concluir
                      </Button>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="future" className="space-y-4">
            {futureReviews.length === 0 ? (
              <Card className="p-8 text-center">
                <Clock className="mx-auto mb-4 text-muted-foreground" size={40} />
                <p className="text-muted-foreground">Nenhuma revisão futura agendada</p>
              </Card>
            ) : (
              futureReviews.map((review) => (
                <Card key={review.id} className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-foreground mb-2">
                        Revisão de {review.daysAfter} dia{review.daysAfter !== 1 ? "s" : ""}
                      </h3>
                      <p className="text-sm text-muted-foreground mb-1">{review.volume}</p>
                      <p className="text-sm text-muted-foreground">{review.topic}</p>
                      <p className="text-xs text-primary mt-2">
                        Agendada para: {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => deleteReview(review.id)}
                      >
                        <Trash2 size={16} />
                      </Button>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </TabsContent>

          <TabsContent value="history" className="space-y-4">
            <div className="space-y-4">
              {sessions.length === 0 ? (
                <Card className="p-8 text-center">
                  <Clock className="mx-auto mb-4 text-muted-foreground" size={40} />
                  <p className="text-muted-foreground">Nenhuma sessão de estudo registrada</p>
                </Card>
              ) : (
                sessions
                  .sort((a, b) => new Date(b.startTime).getTime() - new Date(a.startTime).getTime())
                  .map((session) => (
                    <Card key={session.id} className="p-6">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground mb-2">
                            {session.volume}
                          </h3>
                          <p className="text-sm text-muted-foreground mb-1">
                            Tópico: {session.topic}
                          </p>
                          <p className="text-sm text-muted-foreground mb-1">
                            Duração: {session.duration} minutos
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {new Date(session.startTime).toLocaleDateString("pt-BR")} às{" "}
                            {new Date(session.startTime).toLocaleTimeString("pt-BR", {
                              hour: "2-digit",
                              minute: "2-digit",
                            })}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => deleteSession(session.id)}
                        >
                          <Trash2 size={16} />
                        </Button>
                      </div>
                    </Card>
                  ))
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

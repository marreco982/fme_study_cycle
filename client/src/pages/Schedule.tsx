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
import { Clock, CheckCircle2, BookOpen, Trash2, AlertCircle, Send, RotateCcw } from "lucide-react";
import { toast } from "sonner";
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

export default function Schedule() {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem("studyLogs");
    return saved ? JSON.parse(saved).map((log: any) => ({
      ...log,
      timestamp: new Date(log.timestamp),
      scheduledDate: log.scheduledDate ? new Date(log.scheduledDate) : null,
    })) : [];
  });

  const [reviews, setReviews] = useState<ScheduledReview[]>(() => {
    const saved = localStorage.getItem("scheduledReviews");
    return saved ? JSON.parse(saved).map((r: any) => ({
      ...r,
      scheduledDate: new Date(r.scheduledDate),
    })) : [];
  });

  // Formulário
  const [formData, setFormData] = useState({
    hours: "00",
    minutes: "00",
    date: new Date().toISOString().split("T")[0],
    volume: "",
    chapter: "",
    topic: "",
    status: "continuing" as "continuing" | "completed" | "review",
    generateReviews: false,
    observations: "",
  });

  const [selectedVolume, setSelectedVolume] = useState<typeof fmeVolumes[0] | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<typeof fmeVolumes[0]["chapters"][0] | null>(null);

  // Salvar study logs
  useEffect(() => {
    localStorage.setItem("studyLogs", JSON.stringify(studyLogs));
  }, [studyLogs]);

  // Salvar reviews
  useEffect(() => {
    localStorage.setItem("scheduledReviews", JSON.stringify(reviews));
  }, [reviews]);

  // Atualizar volume selecionado
  useEffect(() => {
    if (formData.volume) {
      const vol = fmeVolumes.find((v) => v.id === formData.volume);
      setSelectedVolume(vol || null);
      setFormData((prev) => ({ ...prev, chapter: "", topic: "" }));
      setSelectedChapter(null);
    }
  }, [formData.volume]);

  // Atualizar capítulo selecionado
  useEffect(() => {
    if (formData.chapter && selectedVolume) {
      const chap = selectedVolume.chapters.find((c) => c.id === formData.chapter);
      setSelectedChapter(chap || null);
      setFormData((prev) => ({ ...prev, topic: "" }));
    }
  }, [formData.chapter, selectedVolume]);

  const handleRegisterStudy = () => {
    if (!formData.volume || !formData.chapter || !formData.topic) {
      toast.error("Preencha todos os campos obrigatórios");
      return;
    }

    if (formData.hours === "00" && formData.minutes === "00") {
      toast.error("Informe o tempo estudado");
      return;
    }

    const volume = fmeVolumes.find((v) => v.id === formData.volume);
    const chapter = volume?.chapters.find((c) => c.id === formData.chapter);
    const topic = chapter?.topics.find((t) => t.id === formData.topic);

    if (!volume || !chapter || !topic) {
      toast.error("Dados inválidos selecionados");
      return;
    }

    const newLog: StudyLog = {
      id: `log_${Date.now()}`,
      date: formData.date,
      hours: parseInt(formData.hours),
      minutes: parseInt(formData.minutes),
      volume: volume.title,
      volumeNumber: volume.number,
      chapter: chapter.name,
      topic: topic.name,
      status: formData.status,
      generateReviews: formData.generateReviews,
      observations: formData.observations,
      timestamp: new Date(),
    };

    setStudyLogs([...studyLogs, newLog]);

    // Se marcou como concluído e quer gerar revisões
    if (formData.status === "completed" && formData.generateReviews) {
      const reviewDays = [1, 7, 14, 30, 90];
      const baseDate = new Date(formData.date);

      const newReviews = reviewDays.map((days) => {
        const reviewDate = new Date(baseDate);
        reviewDate.setDate(reviewDate.getDate() + days);

        return {
          id: `review_${Date.now()}_${days}d`,
          topic: `[REVISÃO] ${topic.name}`,
          daysAfter: days,
          scheduledDate: reviewDate,
          completed: false,
        };
      });

      setReviews([...reviews, ...newReviews]);
      toast.success(`Estudo registrado! ${newReviews.length} revisões agendadas.`);
    } else {
      toast.success("Estudo registrado com sucesso!");
    }

    // Limpar formulário
    setFormData({
      hours: "00",
      minutes: "00",
      date: new Date().toISOString().split("T")[0],
      volume: "",
      chapter: "",
      topic: "",
      status: "continuing",
      generateReviews: false,
      observations: "",
    });
  };

  const toggleReviewCompletion = (reviewId: string) => {
    setReviews(
      reviews.map((r) =>
        r.id === reviewId ? { ...r, completed: !r.completed } : r
      )
    );
  };

  const deleteStudyLog = (id: string) => {
    setStudyLogs(studyLogs.filter((log) => log.id !== id));
    toast.success("Registro removido");
  };

  const deleteReview = (id: string) => {
    setReviews(reviews.filter((r) => r.id !== id));
    toast.success("Revisão removida");
  };

  // Estatísticas
  const totalMinutesStudied = studyLogs.reduce((acc, log) => acc + log.hours * 60 + log.minutes, 0);
  const totalHoursStudied = Math.floor(totalMinutesStudied / 60);
  const remainingMinutes = totalMinutesStudied % 60;
  const completedStudies = studyLogs.filter((log) => log.status === "completed").length;
  const completedReviews = reviews.filter((r) => r.completed).length;
  const pendingReviews = reviews.filter((r) => !r.completed).length;
  const overdueReviews = reviews.filter(
    (r) => !r.completed && new Date(r.scheduledDate) < new Date()
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Cronograma de Estudos</h1>
        <p className="text-muted-foreground mb-8">Registre suas sessões de estudo e acompanhe seu progresso</p>

        {/* Estatísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Total</p>
                <p className="text-3xl font-bold text-blue-600">
                  {totalHoursStudied}h {remainingMinutes}m
                </p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Teorias Concluídas</p>
                <p className="text-3xl font-bold text-green-600">{completedStudies}</p>
              </div>
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Concluídas</p>
                <p className="text-3xl font-bold text-purple-600">{completedReviews}/{reviews.length}</p>
              </div>
              <BookOpen className="text-purple-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Pendentes</p>
                <p className="text-3xl font-bold text-orange-600">{pendingReviews}</p>
              </div>
              <AlertCircle className="text-orange-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Revisões Vencidas</p>
                <p className="text-3xl font-bold text-red-600">{overdueReviews}</p>
              </div>
              <AlertCircle className="text-red-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Abas */}
        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register">Registrar Estudo</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="reviews">Revisões</TabsTrigger>
          </TabsList>

          {/* Aba: Registrar Estudo */}
          <TabsContent value="register">
            <Card className="p-8 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Registrar Estudo</h2>

              <div className="space-y-6">
                {/* Tempo */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Horas</label>
                    <Select value={formData.hours} onValueChange={(val) => setFormData({ ...formData, hours: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 24 }, (_, i) => (
                          <SelectItem key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Minutos</label>
                    <Select value={formData.minutes} onValueChange={(val) => setFormData({ ...formData, minutes: val })}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 60 }, (_, i) => (
                          <SelectItem key={i} value={String(i).padStart(2, "0")}>
                            {String(i).padStart(2, "0")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Data</label>
                    <input
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                      className="w-full px-4 py-2 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    />
                  </div>
                </div>

                {/* Disciplina */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Disciplina</label>
                  <Select value={formData.volume} onValueChange={(val) => setFormData({ ...formData, volume: val })}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione uma disciplina" />
                    </SelectTrigger>
                    <SelectContent>
                      {fmeVolumes.map((vol) => (
                        <SelectItem key={vol.id} value={vol.id}>
                          {vol.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Assunto */}
                {selectedVolume && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Assunto</label>
                    <Select value={formData.chapter} onValueChange={(val) => setFormData({ ...formData, chapter: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um assunto" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedVolume.chapters.map((chap) => (
                          <SelectItem key={chap.id} value={chap.id}>
                            {chap.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Tópico */}
                {selectedChapter && (
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Tópico</label>
                    <Select value={formData.topic} onValueChange={(val) => setFormData({ ...formData, topic: val })}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um tópico" />
                      </SelectTrigger>
                      <SelectContent>
                        {selectedChapter.topics.map((top) => (
                          <SelectItem key={top.id} value={top.id}>
                            {top.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}

                {/* Status */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-3">Status</label>
                  <div className="space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="continuing"
                        checked={formData.status === "continuing"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Continuar estudando esse assunto
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Na sua próxima sessão de estudos dessa disciplina, mostraremos esse assunto novamente.
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="radio"
                        name="status"
                        value="completed"
                        checked={formData.status === "completed"}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-4 h-4"
                      />
                      <span className="text-sm font-medium text-foreground">
                        Finalizei toda a teoria desse assunto
                      </span>
                      <span className="text-xs text-muted-foreground">
                        Não mostraremos até que você tenha finalizado todos os assuntos dessa disciplina. Marcaremos a teoria como finalizada no seu edital.
                      </span>
                    </label>
                  </div>
                </div>

                {/* Gerar Revisões */}
                {formData.status === "completed" && (
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.generateReviews}
                      onChange={(e) => setFormData({ ...formData, generateReviews: e.target.checked })}
                      className="w-4 h-4"
                    />
                    <span className="text-sm font-medium text-foreground">
                      Gerar revisões automáticas
                    </span>
                    <span className="text-xs text-muted-foreground">
                      O sistema gerará lembretes de revisão para este assunto de acordo com os intervalos selecionados.
                    </span>
                  </label>
                )}

                {/* Observações */}
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Observações</label>
                  <textarea
                    value={formData.observations}
                    onChange={(e) => setFormData({ ...formData, observations: e.target.value })}
                    placeholder="Adicione observações sobre esta sessão de estudo..."
                    className="w-full px-4 py-3 border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    rows={4}
                  />
                </div>

                {/* Botões */}
                <div className="flex gap-4 pt-4">
                  <Button
                    onClick={handleRegisterStudy}
                    className="flex-1 bg-green-600 text-white hover:bg-green-700 transition-all duration-200 hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                  >
                    <Send size={18} />
                    Registrar Estudo
                  </Button>
                  <Button
                    onClick={() => {
                      setFormData({
                        hours: "00",
                        minutes: "00",
                        date: new Date().toISOString().split("T")[0],
                        volume: "",
                        chapter: "",
                        topic: "",
                        status: "continuing",
                        generateReviews: false,
                        observations: "",
                      });
                    }}
                    variant="outline"
                    className="transition-all duration-200 hover:shadow-md active:scale-95 flex items-center gap-2"
                  >
                    <RotateCcw size={18} />
                    Limpar
                  </Button>
                </div>
              </div>
            </Card>
          </TabsContent>

          {/* Aba: Histórico */}
          <TabsContent value="history">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Histórico de Estudos</h2>

              {studyLogs.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhum estudo registrado ainda</p>
              ) : (
                <div className="space-y-4">
                  {studyLogs.map((log) => (
                    <div
                      key={log.id}
                      className="p-4 border border-border rounded-lg hover:bg-slate-50 transition-colors"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                              {log.date}
                            </span>
                            <span className={`text-xs font-semibold px-2 py-1 rounded ${
                              log.status === "completed"
                                ? "bg-green-100 text-green-700"
                                : "bg-gray-100 text-gray-700"
                            }`}>
                              {log.status === "completed" ? "Concluído" : "Continuando"}
                            </span>
                            <span className="text-xs text-muted-foreground">
                              {log.hours}h {log.minutes}m
                            </span>
                          </div>
                          <h3 className="font-semibold text-foreground">{log.topic}</h3>
                          <p className="text-sm text-muted-foreground">
                            {log.volume} • {log.chapter}
                          </p>
                          {log.observations && (
                            <p className="text-sm text-muted-foreground mt-2 italic">"{log.observations}"</p>
                          )}
                        </div>
                        <button
                          onClick={() => deleteStudyLog(log.id)}
                          className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all duration-200 hover:shadow-md active:scale-95"
                          title="Deletar este registro"
                        >
                          <Trash2 size={20} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </TabsContent>

          {/* Aba: Revisões */}
          <TabsContent value="reviews">
            <Card className="p-6 bg-white shadow-sm">
              <h2 className="text-2xl font-bold text-foreground mb-6">Revisões Agendadas</h2>

              {reviews.length === 0 ? (
                <p className="text-muted-foreground text-center py-8">Nenhuma revisão agendada</p>
              ) : (
                <div className="space-y-4">
                  {reviews.map((review) => {
                    const isOverdue = new Date(review.scheduledDate) < new Date() && !review.completed;
                    return (
                      <div
                        key={review.id}
                        className={`p-4 border-2 rounded-lg transition-colors ${
                          review.completed
                            ? "bg-green-50 border-green-200"
                            : isOverdue
                            ? "bg-red-50 border-red-200"
                            : "bg-yellow-50 border-yellow-200"
                        }`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <span className="text-xs font-semibold px-2 py-1 bg-blue-100 text-blue-700 rounded">
                                {new Date(review.scheduledDate).toLocaleDateString("pt-BR")}
                              </span>
                              <span className="text-xs font-semibold px-2 py-1 bg-purple-100 text-purple-700 rounded">
                                {review.daysAfter}d
                              </span>
                              {isOverdue && (
                                <span className="text-xs font-semibold px-2 py-1 bg-red-100 text-red-700 rounded">
                                  VENCIDA
                                </span>
                              )}
                            </div>
                            <h3 className="font-semibold text-foreground">{review.topic}</h3>
                          </div>
                          <div className="flex items-center gap-2">
                            <button
                              onClick={() => toggleReviewCompletion(review.id)}
                              className={`px-4 py-2 rounded transition-all duration-200 hover:shadow-md active:scale-95 flex items-center gap-2 ${
                                review.completed
                                  ? "bg-green-600 text-white"
                                  : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                              }`}
                            >
                              <CheckCircle2 size={18} />
                              {review.completed ? "Concluída" : "Marcar"}
                            </button>
                            <button
                              onClick={() => deleteReview(review.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50 p-2 rounded transition-all duration-200 hover:shadow-md active:scale-95"
                              title="Deletar esta revisão"
                            >
                              <Trash2 size={20} />
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

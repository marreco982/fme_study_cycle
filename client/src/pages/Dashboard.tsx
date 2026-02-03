import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { fmeVolumes } from "@/data/fmeVolumes";
import { useState, useEffect } from "react";
import { TrendingUp, Clock, CheckCircle2, Target } from "lucide-react";

interface StudySession {
  id: string;
  volumeId: string;
  volumeName: string;
  topicName: string;
  duration: number;
  date: Date;
  type: "study" | "review";
}

interface CompletedReview {
  id: string;
  volumeId: string;
  volumeName: string;
  reviewType: string;
  completedDate: Date;
}

export default function Dashboard() {
  const [studySessions, setStudySessions] = useState<StudySession[]>(() => {
    const saved = localStorage.getItem("studySessions");
    return saved
      ? JSON.parse(saved).map((s: any) => ({
          ...s,
          date: new Date(s.date),
        }))
      : [];
  });

  const [completedReviews, setCompletedReviews] = useState<CompletedReview[]>(
    () => {
      const saved = localStorage.getItem("completedReviews");
      return saved
        ? JSON.parse(saved).map((r: any) => ({
            ...r,
            completedDate: new Date(r.completedDate),
          }))
        : [];
    }
  );

  // Calcular tempo total estudado
  const totalStudyTime = studySessions.reduce((acc, session) => acc + session.duration, 0);
  const totalStudyHours = Math.floor(totalStudyTime / 60);
  const totalStudyMinutes = totalStudyTime % 60;

  // Dados para gráfico de tempo por volume
  const timeByVolume = fmeVolumes.map((volume) => {
    const volumeTime = studySessions
      .filter((s) => s.volumeId === volume.id)
      .reduce((acc, s) => acc + s.duration, 0);
    return {
      name: `Vol ${volume.number}`,
      time: Math.round(volumeTime / 60 * 10) / 10, // em horas
      fullName: volume.title,
    };
  });

  // Dados para gráfico de progresso por volume
  const progressByVolume = fmeVolumes.map((volume) => {
    const totalTopics = volume.topics.length;
    const completedTopics = JSON.parse(localStorage.getItem("completedTopics") || "[]").filter(
      (t: any) => t.volumeId === volume.id
    ).length;
    return {
      name: `Vol ${volume.number}`,
      progress: totalTopics > 0 ? Math.round((completedTopics / totalTopics) * 100) : 0,
      fullName: volume.title,
    };
  });

  // Dados para gráfico de revisões concluídas
  const reviewStats = {
    completed: completedReviews.length,
    pending: JSON.parse(localStorage.getItem("futureReviews") || "[]").length,
  };

  const reviewData = [
    { name: "Concluídas", value: reviewStats.completed },
    { name: "Pendentes", value: reviewStats.pending },
  ];

  // Dados para progresso mensal
  const monthlyProgress = Array.from({ length: 12 }, (_, i) => {
    const month = new Date(new Date().getFullYear(), i, 1);
    const monthName = month.toLocaleString("pt-BR", { month: "short" });
    const sessionsThisMonth = studySessions.filter((s) => {
      const sessionMonth = new Date(s.date).getMonth();
      return sessionMonth === i;
    });
    return {
      month: monthName,
      sessões: sessionsThisMonth.length,
      horas: Math.round(
        (sessionsThisMonth.reduce((acc, s) => acc + s.duration, 0) / 60) * 10
      ) / 10,
    };
  });

  // Estatísticas gerais
  const totalVolumesCompleted = JSON.parse(localStorage.getItem("completedVolumes") || "[]")
    .length;
  const totalTopicsCompleted = JSON.parse(localStorage.getItem("completedTopics") || "[]")
    .length;
  const totalTopics = fmeVolumes.reduce((acc, v) => acc + v.topics.length, 0);
  const overallProgress = totalTopics > 0 ? Math.round((totalTopicsCompleted / totalTopics) * 100) : 0;

  const COLORS = ["#3b82f6", "#ef4444", "#10b981", "#f59e0b", "#8b5cf6", "#ec4899"];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-foreground mb-2">Dashboard de Estatísticas</h1>
        <p className="text-muted-foreground mb-8">
          Acompanhe seu progresso de estudos em tempo real
        </p>

        {/* Cards de Estatísticas Gerais */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tempo Total</p>
                <p className="text-3xl font-bold text-primary">
                  {totalStudyHours}h {totalStudyMinutes}m
                </p>
              </div>
              <Clock className="text-blue-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Volumes Completos</p>
                <p className="text-3xl font-bold text-green-600">{totalVolumesCompleted}</p>
              </div>
              <CheckCircle2 className="text-green-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Tópicos Concluídos</p>
                <p className="text-3xl font-bold text-purple-600">
                  {totalTopicsCompleted}/{totalTopics}
                </p>
              </div>
              <Target className="text-purple-500" size={32} />
            </div>
          </Card>

          <Card className="p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground mb-1">Progresso Geral</p>
                <p className="text-3xl font-bold text-orange-600">{overallProgress}%</p>
              </div>
              <TrendingUp className="text-orange-500" size={32} />
            </div>
          </Card>
        </div>

        {/* Gráficos */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Tempo Estudado por Volume */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Tempo Estudado por Volume</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={timeByVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "Horas", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value) => `${value}h`}
                  labelFormatter={(label) => {
                    const volume = timeByVolume.find((v) => v.name === label);
                    return volume?.fullName || label;
                  }}
                />
                <Bar dataKey="time" fill="#3b82f6" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          {/* Progresso por Volume */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Progresso por Volume (%)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={progressByVolume}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis label={{ value: "%", angle: -90, position: "insideLeft" }} />
                <Tooltip
                  formatter={(value) => `${value}%`}
                  labelFormatter={(label) => {
                    const volume = progressByVolume.find((v) => v.name === label);
                    return volume?.fullName || label;
                  }}
                />
                <Bar dataKey="progress" fill="#10b981" radius={[8, 8, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Gráficos Adicionais */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Taxa de Revisões */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Status de Revisões</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={reviewData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, value }) => `${name}: ${value}`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {reviewData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={(value) => `${value} revisões`} />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Progresso Mensal */}
          <Card className="p-6 bg-white shadow-sm">
            <h2 className="text-xl font-bold text-foreground mb-4">Progresso Mensal</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={monthlyProgress}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis yAxisId="left" label={{ value: "Sessões", angle: -90, position: "insideLeft" }} />
                <YAxis
                  yAxisId="right"
                  orientation="right"
                  label={{ value: "Horas", angle: 90, position: "insideRight" }}
                />
                <Tooltip />
                <Legend />
                <Line
                  yAxisId="left"
                  type="monotone"
                  dataKey="sessões"
                  stroke="#3b82f6"
                  name="Sessões"
                />
                <Line
                  yAxisId="right"
                  type="monotone"
                  dataKey="horas"
                  stroke="#10b981"
                  name="Horas"
                />
              </LineChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Insights e Recomendações */}
        <Card className="p-6 bg-gradient-to-r from-blue-50 to-purple-50 border-blue-200">
          <h2 className="text-xl font-bold text-foreground mb-4">Insights e Recomendações</h2>
          <div className="space-y-3 text-sm text-foreground">
            {overallProgress < 25 && (
              <p>
                💡 <strong>Dica:</strong> Você está começando sua jornada! Mantenha a consistência
                e estude um pouco todos os dias.
              </p>
            )}
            {overallProgress >= 25 && overallProgress < 50 && (
              <p>
                💡 <strong>Dica:</strong> Ótimo progresso! Você já completou {overallProgress}% dos
                tópicos. Continue assim!
              </p>
            )}
            {overallProgress >= 50 && overallProgress < 75 && (
              <p>
                💡 <strong>Dica:</strong> Você está na metade do caminho! Intensifique os estudos
                para completar os volumes essenciais.
              </p>
            )}
            {overallProgress >= 75 && (
              <p>
                💡 <strong>Dica:</strong> Excelente! Você está muito perto de completar o ciclo.
                Foque nas revisões para consolidar o aprendizado.
              </p>
            )}
            {reviewStats.pending > 0 && (
              <p>
                ⚠️ <strong>Lembrete:</strong> Você tem {reviewStats.pending} revisões pendentes.
                Não esqueça de fazer suas revisões espaçadas!
              </p>
            )}
            {totalStudyHours < 10 && (
              <p>
                📚 <strong>Sugestão:</strong> Aumente o tempo de estudo para consolidar melhor o
                conteúdo. Tente estudar pelo menos 1-2 horas por dia.
              </p>
            )}
          </div>
        </Card>
      </div>
    </div>
  );
}

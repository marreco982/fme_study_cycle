import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { strategicSchedule, ScheduleWeek } from '@/data/strategicSchedule';
import { ChevronRight, BookOpen, Zap, Target, Play, CheckCircle } from 'lucide-react';
import { useLocation } from 'wouter';
import { useState, useEffect, useMemo } from 'react';
import { usePreselection } from '@/contexts/PreselectionContext';

export default function StrategicSchedule() {
  const [selectedWeek, setSelectedWeek] = useState<number>(1);
  const [selectedPhase, setSelectedPhase] = useState<string>('FASE 1: Fundamentos');
  const [activeWeek, setActiveWeek] = useState<number | null>(null);
  const [, setLocation] = useLocation();
  const { setPreselectionData } = usePreselection();

  // Carregar semana ativa do localStorage
  useEffect(() => {
    const currentWeekNumber = localStorage.getItem('currentWeekNumber');
    if (currentWeekNumber) {
      setActiveWeek(parseInt(currentWeekNumber));
    }
  }, []);

  const phases = useMemo(() => {
    const uniquePhases = Array.from(new Set(strategicSchedule.map(s => s.phase)));
    return uniquePhases;
  }, []);

  const weeksByPhase = useMemo(() => {
    return phases.reduce((acc, phase) => {
      acc[phase] = strategicSchedule.filter(s => s.phase === phase);
      return acc;
    }, {} as Record<string, ScheduleWeek[]>);
  }, [phases]);

  const currentWeek = strategicSchedule.find(s => s.week === selectedWeek);

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800';
      case 'low':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'very_high':
        return 'bg-purple-100 text-purple-800';
      case 'high':
        return 'bg-blue-100 text-blue-800';
      case 'medium':
        return 'bg-cyan-100 text-cyan-800';
      case 'low':
        return 'bg-slate-100 text-slate-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getTotalHours = (topics: any[]) => {
    return topics.reduce((sum, topic) => sum + (topic.estimatedHours || 0), 0);
  };

  const getTotalQuestions = (topics: any[]) => {
    return topics.reduce((sum, topic) => sum + (topic.practiceQuestions || 0), 0);
  };

  const isWeekActive = (weekNumber: number) => {
    return activeWeek === weekNumber;
  };

  const handleStartWeek = () => {
    if (currentWeek && currentWeek.topics.length > 0) {
      // Salvar os tópicos da semana no sessionStorage
      const weekTopics = currentWeek.topics.map(topic => ({
        id: topic.id,
        name: topic.name,
        volumeId: topic.volumeId,
        estimatedHours: topic.estimatedHours,
        practiceQuestions: topic.practiceQuestions,
      }));
      sessionStorage.setItem('currentWeekTopics', JSON.stringify(weekTopics));
      sessionStorage.setItem('currentWeekNumber', String(currentWeek.week));
      sessionStorage.setItem('currentWeekTitle', currentWeek.title);
      
      // Salvar o primeiro tópico para pré-seleção automática
      const firstTopic = currentWeek.topics[0];
      
      // Salvar no localStorage para garantir persistência durante navegação
      localStorage.setItem('preselectionData', JSON.stringify({
        volumeId: firstTopic.volumeId,
        chapterId: firstTopic.chapterId,
        topicId: firstTopic.topicId,
      }));
      
      // Também atualizar o contexto
      setPreselectionData({
        volumeId: firstTopic.volumeId,
        chapterId: firstTopic.chapterId,
        topicId: firstTopic.topicId,
      });
      
      // Atualizar semana ativa
      setActiveWeek(currentWeek.week);
      
      // Navegar para o Registrador
      setLocation('/schedule');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Cronograma Estratégico - 6 Meses</h1>
          <p className="text-lg text-slate-600">Concurso de Professor de Matemática | 12h/semana | Nível Intermediário</p>
        </div>

        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Total de Semanas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-600">26</div>
              <p className="text-xs text-slate-500 mt-1">6 meses de estudo</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Horas Totais</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-600">312</div>
              <p className="text-xs text-slate-500 mt-1">12h/semana</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium text-slate-600">Questões Práticas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-purple-600">2.000+</div>
              <p className="text-xs text-slate-500 mt-1">Resolução integrada</p>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Tabs defaultValue="phases" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="phases">Fases</TabsTrigger>
            <TabsTrigger value="weekly">Semanas</TabsTrigger>
            <TabsTrigger value="details">Detalhes</TabsTrigger>
          </TabsList>

          {/* Phases Tab */}
          <TabsContent value="phases" className="space-y-4">
            {phases.map((phase, idx) => {
              const weeks = weeksByPhase[phase];
              const totalHours = weeks.reduce((sum, w) => sum + getTotalHours(w.topics), 0);
              const totalQuestions = weeks.reduce((sum, w) => sum + getTotalQuestions(w.topics), 0);

              return (
                <Card
                  key={phase}
                  className="cursor-pointer hover:shadow-lg transition-shadow"
                  onClick={() => {
                    setSelectedPhase(phase);
                    setSelectedWeek(weeks[0].week);
                  }}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{phase}</CardTitle>
                        <CardDescription>Semanas {weeks[0].week} - {weeks[weeks.length - 1].week}</CardDescription>
                      </div>
                      <Badge variant="outline">{weeks.length} semanas</Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-slate-600">Horas Totais</p>
                        <p className="text-2xl font-bold text-blue-600">{totalHours}h</p>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">Questões</p>
                        <p className="text-2xl font-bold text-purple-600">{totalQuestions}</p>
                      </div>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {weeks.map(w => (
                        <div key={w.week} className="relative">
                          {isWeekActive(w.week) && (
                            <div className="absolute -top-2 -right-2 bg-green-500 rounded-full p-1">
                              <CheckCircle size={16} className="text-white" />
                            </div>
                          )}
                          <Badge
                            variant={selectedWeek === w.week ? 'default' : 'secondary'}
                            className={`cursor-pointer ${isWeekActive(w.week) ? 'ring-2 ring-green-500' : ''}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedWeek(w.week);
                            }}
                          >
                            S{w.week}
                          </Badge>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </TabsContent>

          {/* Weekly Tab */}
          <TabsContent value="weekly" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Week Selector */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Selecione a Semana</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-4 gap-2">
                    {strategicSchedule.map(week => (
                      <button
                        key={week.week}
                        onClick={() => setSelectedWeek(week.week)}
                        className={`p-2 rounded text-sm font-medium transition-all ${
                          selectedWeek === week.week
                            ? 'bg-blue-600 text-white'
                            : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                        }`}
                      >
                        S{week.week}
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Phase Indicator */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-sm">Fase Atual</CardTitle>
                </CardHeader>
                <CardContent>
                  {currentWeek && (
                    <div>
                      <p className="text-sm text-slate-600 mb-2">{currentWeek.phase}</p>
                      <p className="text-lg font-bold text-slate-900">{currentWeek.title}</p>
                      <p className="text-xs text-slate-500 mt-2">{currentWeek.notes}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Details Tab */}
          <TabsContent value="details">
            {currentWeek && (
              <div className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle>Semana {currentWeek.week} - {currentWeek.title}</CardTitle>
                    <CardDescription>{currentWeek.phase}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg">
                        <p className="text-xs text-blue-600 font-medium">HORAS</p>
                        <p className="text-2xl font-bold text-blue-700">{getTotalHours(currentWeek.topics)}h</p>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg">
                        <p className="text-xs text-purple-600 font-medium">QUESTÕES</p>
                        <p className="text-2xl font-bold text-purple-700">{getTotalQuestions(currentWeek.topics)}</p>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        <p className="text-xs text-green-600 font-medium">TÓPICOS</p>
                        <p className="text-2xl font-bold text-green-700">{currentWeek.topics.length}</p>
                      </div>
                    </div>

                    <div className="border-t pt-4">
                      <p className="text-sm font-medium text-slate-900 mb-3">Notas:</p>
                      <p className="text-sm text-slate-600 italic">{currentWeek.notes}</p>
                    </div>

                    <div className="border-t pt-4 flex gap-2">
                      <Button
                        onClick={handleStartWeek}
                        className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 rounded-lg transition-all duration-200 flex items-center justify-center gap-2"
                      >
                        <Play className="w-4 h-4" />
                        Iniciar Semana
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Topics List */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-base">Tópicos a Estudar</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {currentWeek.topics.map((topic, idx) => (
                        <div key={topic.id} className="border rounded-lg p-4 hover:bg-slate-50 transition-colors">
                          <div className="flex items-start justify-between mb-2">
                            <div className="flex-1">
                              <p className="font-medium text-slate-900">{idx + 1}. {topic.name}</p>
                              <p className="text-xs text-slate-500 mt-1">{topic.volumeId.toUpperCase()}</p>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-600">{topic.estimatedHours}h</p>
                            </div>
                          </div>

                          <div className="flex flex-wrap gap-2 mt-3">
                            <Badge className={getPriorityColor(topic.priority)}>
                              {topic.priority === 'high' ? 'Alta Prioridade' : topic.priority === 'medium' ? 'Média Prioridade' : 'Baixa Prioridade'}
                            </Badge>
                            <Badge className={getFrequencyColor(topic.concourseFrequency)}>
                              {topic.concourseFrequency === 'very_high' ? 'Muito Frequente' : topic.concourseFrequency === 'high' ? 'Frequente' : topic.concourseFrequency === 'medium' ? 'Moderado' : 'Raro'}
                            </Badge>
                            <Badge variant="outline">{topic.practiceQuestions} questões</Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>

        {/* Footer Info */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-base flex items-center gap-2">
              <Zap className="w-5 h-5 text-blue-600" />
              Dicas para Máxima Eficiência
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm text-slate-700">
            <p>✓ Siga o cronograma sequencialmente - cada fase prepara para a próxima</p>
            <p>✓ Resolva todas as questões práticas - elas reforçam o aprendizado</p>
            <p>✓ Revise regularmente os tópicos de alta frequência em provas</p>
            <p>✓ Use os simulados das semanas 25-26 para autoavaliação</p>
            <p>✓ Adapte o ritmo conforme sua necessidade, mas mantenha as 12h/semana</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

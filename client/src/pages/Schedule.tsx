import { useState, useEffect, useRef } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { fmeVolumes } from '@/data/fmeVolumes';
import { usePreselection } from '@/contexts/PreselectionContext';
import { toast } from 'sonner';

interface StudyLog {
  id: string;
  date: string;
  volume: string;
  chapter: string;
  topic: string;
  hours: number;
  minutes: number;
  status: 'continuing' | 'completed';
  notes: string;
}

export default function Schedule() {
  const [studyLogs, setStudyLogs] = useState<StudyLog[]>(() => {
    const saved = localStorage.getItem('studyLogs');
    return saved ? JSON.parse(saved) : [];
  });

  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    volume: '',
    chapter: '',
    topic: '',
    hours: '0',
    minutes: '0',
    status: 'continuing' as const,
    notes: '',
  });

  const [selectedVolume, setSelectedVolume] = useState<any>(null);
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const { preselectionData, clearPreselectionData } = usePreselection();
  const contextPreselectionAppliedRef = useRef(false);

  // Limpar formulário quando a página carrega
  useEffect(() => {
    const timer = setTimeout(() => {
      setFormData(prev => ({
        ...prev,
        volume: '',
        chapter: '',
        topic: '',
        hours: '0',
        minutes: '0',
        status: 'continuing',
        notes: '',
      }));
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // Pre-selecionar o primeiro topico da semana usando o contexto ou localStorage
  useEffect(() => {
    // Evitar executar múltiplas vezes
    if (contextPreselectionAppliedRef.current) return;

    // Tentar obter dados do contexto primeiro
    let dataToUse = preselectionData;

    // Se o contexto estiver vazio, tentar obter do localStorage
    if (!dataToUse.volumeId || !dataToUse.chapterId || !dataToUse.topicId) {
      const storedData = localStorage.getItem('preselectionData');
      if (storedData) {
        try {
          dataToUse = JSON.parse(storedData);
        } catch (e) {
          // Ignorar erro de parse
        }
      }
    }

    if (dataToUse.volumeId && dataToUse.chapterId && dataToUse.topicId) {
      contextPreselectionAppliedRef.current = true;

      // Atualizar os estados de volume e capítulo selecionados PRIMEIRO
      const vol = fmeVolumes.find((v) => v.id === dataToUse.volumeId);
      if (vol) {
        setSelectedVolume(vol);
        const chap = vol.chapters.find((c) => c.id === dataToUse.chapterId);
        if (chap) {
          setSelectedChapter(chap);
        }
      }

      // Atualizar formData com os valores pré-selecionados
      setFormData(prev => ({
        ...prev,
        volume: dataToUse.volumeId!,
        chapter: dataToUse.chapterId!,
        topic: dataToUse.topicId!
      }));

      // Limpar os dados de pré-seleção do localStorage e contexto após um tempo
      setTimeout(() => {
        localStorage.removeItem('preselectionData');
        clearPreselectionData();
      }, 5000);
    }
  }, [preselectionData.volumeId, preselectionData.chapterId, preselectionData.topicId, clearPreselectionData]);

  // Auto-selecionar capítulo quando volume é selecionado
  useEffect(() => {
    if (formData.volume && selectedVolume) {
      // Se houver um capítulo pré-selecionado, não fazer nada
      if (formData.chapter) return;

      // Selecionar o primeiro capítulo automaticamente
      if (selectedVolume.chapters.length > 0) {
        setFormData(prev => ({
          ...prev,
          chapter: selectedVolume.chapters[0].id,
          topic: '' // Limpar tópico para forçar seleção
        }));
      }
    }
  }, [formData.volume, selectedVolume]);

  // Auto-selecionar tópico quando capítulo é selecionado
  useEffect(() => {
    if (formData.chapter && selectedChapter) {
      // Se houver um tópico pré-selecionado, não fazer nada
      if (formData.topic) return;

      // Selecionar o primeiro tópico automaticamente
      if (selectedChapter.topics.length > 0) {
        setFormData(prev => ({
          ...prev,
          topic: selectedChapter.topics[0].id
        }));
      }
    }
  }, [formData.chapter, selectedChapter]);

  // Salvar study logs
  useEffect(() => {
    localStorage.setItem("studyLogs", JSON.stringify(studyLogs));
  }, [studyLogs]);

  const handleVolumeChange = (volumeId: string) => {
    const vol = fmeVolumes.find((v) => v.id === volumeId);
    setSelectedVolume(vol);
    setFormData(prev => ({
      ...prev,
      volume: volumeId,
      chapter: '',
      topic: '',
    }));
    setSelectedChapter(null);
  };

  const handleChapterChange = (chapterId: string) => {
    const chap = selectedVolume?.chapters.find((c: any) => c.id === chapterId);
    setSelectedChapter(chap);
    setFormData(prev => ({
      ...prev,
      chapter: chapterId,
      topic: '',
    }));
  };

  const handleTopicChange = (topicId: string) => {
    setFormData(prev => ({
      ...prev,
      topic: topicId,
    }));
  };

  const handleSubmit = () => {
    if (!formData.volume || !formData.chapter || !formData.topic) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    const newLog: StudyLog = {
      id: Date.now().toString(),
      date: formData.date,
      volume: formData.volume,
      chapter: formData.chapter,
      topic: formData.topic,
      hours: parseInt(formData.hours),
      minutes: parseInt(formData.minutes),
      status: formData.status,
      notes: formData.notes,
    };

    setStudyLogs([...studyLogs, newLog]);
    toast.success('Estudo registrado com sucesso!');

    // Limpar formulário
    setFormData({
      date: new Date().toISOString().split('T')[0],
      volume: '',
      chapter: '',
      topic: '',
      hours: '0',
      minutes: '0',
      status: 'continuing',
      notes: '',
    });
    setSelectedVolume(null);
    setSelectedChapter(null);
  };

  const handleClear = () => {
    setFormData({
      date: new Date().toISOString().split('T')[0],
      volume: '',
      chapter: '',
      topic: '',
      hours: '0',
      minutes: '0',
      status: 'continuing',
      notes: '',
    });
    setSelectedVolume(null);
    setSelectedChapter(null);
  };

  const volumeOptions = fmeVolumes.map((vol) => ({
    id: vol.id,
    name: vol.title,
  }));

  const chapterOptions = selectedVolume?.chapters.map((chap: any): { id: string; name: string } => ({
    id: chap.id,
    name: chap.name,
  })) || [];

  const topicOptions = selectedChapter?.topics.map((topic: any): { id: string; name: string } => ({
    id: topic.id,
    name: topic.name,
  })) || [];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-6">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-slate-900 mb-2">Registrador de Estudos</h1>
          <p className="text-lg text-slate-600">Registre seu estudo e acompanhe seu progresso</p>
        </div>

        <Tabs defaultValue="register" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="register">Registrar Estudo</TabsTrigger>
            <TabsTrigger value="history">Histórico</TabsTrigger>
            <TabsTrigger value="reviews">Revisões</TabsTrigger>
          </TabsList>

          <TabsContent value="register">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Conceitos Básicos</h2>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Estatísticas */}
                <div className="grid grid-cols-4 gap-4">
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Teorias Concluídas</p>
                    <p className="text-2xl font-bold text-blue-600">0</p>
                  </div>
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Revisões Concluídas</p>
                    <p className="text-2xl font-bold text-purple-600">0/0</p>
                  </div>
                  <div className="bg-orange-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Revisões Pendentes</p>
                    <p className="text-2xl font-bold text-orange-600">0</p>
                  </div>
                  <div className="bg-red-50 p-4 rounded-lg">
                    <p className="text-sm text-slate-600">Revisões Vencidas</p>
                    <p className="text-2xl font-bold text-red-600">0</p>
                  </div>
                </div>

                {/* Formulário */}
                <div className="space-y-4">
                  {/* Tempo */}
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="hours">Horas</Label>
                      <Select value={formData.hours} onValueChange={(val) => setFormData(prev => ({ ...prev, hours: val }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 24 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {String(i).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="minutes">Minutos</Label>
                      <Select value={formData.minutes} onValueChange={(val) => setFormData(prev => ({ ...prev, minutes: val }))}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {Array.from({ length: 60 }, (_, i) => (
                            <SelectItem key={i} value={String(i)}>
                              {String(i).padStart(2, '0')}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Data */}
                  <div>
                    <Label htmlFor="date">Data</Label>
                    <Input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) => setFormData(prev => ({ ...prev, date: e.target.value }))}
                    />
                  </div>

                  {/* Volume */}
                  <div>
                    <Label htmlFor="volume">Volume</Label>
                    <Select value={formData.volume} onValueChange={handleVolumeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione um volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {volumeOptions.map((vol) => (
                          <SelectItem key={vol.id} value={vol.id}>
                            {vol.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Capítulo */}
                  {selectedVolume && (
                    <div>
                      <Label htmlFor="chapter">Assunto</Label>
                      <Select value={formData.chapter} onValueChange={handleChapterChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um assunto" />
                        </SelectTrigger>
                        <SelectContent>
                          {chapterOptions.map((chap: { id: string; name: string }) => (
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
                      <Label htmlFor="topic">Tópico</Label>
                      <Select value={formData.topic} onValueChange={handleTopicChange}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione um tópico" />
                        </SelectTrigger>
                        <SelectContent>
                          {topicOptions.map((topic: { id: string; name: string }) => (
                            <SelectItem key={topic.id} value={topic.id}>
                              {topic.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  )}

                  {/* Status */}
                  <div className="space-y-3">
                    <Label>Status</Label>
                    <RadioGroup value={formData.status} onValueChange={(val) => setFormData(prev => ({ ...prev, status: val as any }))}>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="continuing" id="continuing" />
                        <Label htmlFor="continuing" className="font-normal cursor-pointer">
                          Continuar estudando esse assunto
                          <p className="text-sm text-slate-600">Na sua próxima sessão de estudos dessa disciplina, mostraremos esse assunto novamente.</p>
                        </Label>
                      </div>
                      <div className="flex items-center space-x-2">
                        <RadioGroupItem value="completed" id="completed" />
                        <Label htmlFor="completed" className="font-normal cursor-pointer">
                          Finalizei toda a teoria desse assunto
                          <p className="text-sm text-slate-600">Não mostraremos até que você tenha finalizado todos os assuntos dessa disciplina.</p>
                        </Label>
                      </div>
                    </RadioGroup>
                  </div>

                  {/* Notas */}
                  <div>
                    <Label htmlFor="notes">Notas</Label>
                    <Textarea
                      id="notes"
                      placeholder="Adicione observações sobre esta sessão de estudo..."
                      value={formData.notes}
                      onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
                    />
                  </div>

                  {/* Botões */}
                  <div className="flex gap-4">
                    <Button onClick={handleSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
                      Registrar Estudo
                    </Button>
                    <Button onClick={handleClear} variant="outline" className="flex-1">
                      Limpar
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="history">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Histórico de Estudos</h2>
              </CardHeader>
              <CardContent>
                {studyLogs.length === 0 ? (
                  <p className="text-slate-600">Nenhum estudo registrado ainda.</p>
                ) : (
                  <div className="space-y-4">
                    {studyLogs.map((log) => (
                      <div key={log.id} className="border border-slate-200 rounded-lg p-4">
                        <p className="font-semibold">{log.date}</p>
                        <p className="text-sm text-slate-600">{log.hours}h {log.minutes}m</p>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="reviews">
            <Card>
              <CardHeader>
                <h2 className="text-2xl font-bold">Revisões</h2>
              </CardHeader>
              <CardContent>
                <p className="text-slate-600">Nenhuma revisão pendente.</p>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

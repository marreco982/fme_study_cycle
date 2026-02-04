import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, X, Calendar as CalendarIcon, Clock, BookOpen } from "lucide-react";
import { useEffect, useState } from "react";
import { fmeVolumes } from "@/data/fmeVolumes";
import { toast } from "sonner";

interface StudyEvent {
  id: string;
  date: string;
  title: string;
  type: "content" | "revision" | "exercise" | "rest";
  volume?: number;
  duration?: number; // in minutes
  notes?: string;
}

const activityTypes = [
  { value: "content", label: "Conteúdo Novo", color: "bg-blue-100 text-blue-900", bgColor: "bg-blue-500" },
  { value: "revision", label: "Revisão", color: "bg-green-100 text-green-900", bgColor: "bg-green-500" },
  { value: "exercise", label: "Exercícios", color: "bg-purple-100 text-purple-900", bgColor: "bg-purple-500" },
  { value: "rest", label: "Descanso", color: "bg-gray-100 text-gray-900", bgColor: "bg-gray-500" },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23));
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "content" as const,
    volume: "",
    duration: "120",
    notes: "",
  });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fmeStudyEvents");
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save events to localStorage and sync with other pages
  useEffect(() => {
    localStorage.setItem("fmeStudyEvents", JSON.stringify(events));
    // Trigger custom event for other pages to listen
    window.dispatchEvent(new CustomEvent("studyEventsUpdated", { detail: events }));
  }, [events]);

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const handlePrevMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));
  };

  const handleAddEvent = () => {
    if (!newEvent.title || !selectedDate) {
      toast.error("Preencha o título e selecione uma data");
      return;
    }

    const event: StudyEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title,
      type: newEvent.type,
      volume: newEvent.volume ? parseInt(newEvent.volume) : undefined,
      duration: newEvent.duration ? parseInt(newEvent.duration) : 120,
      notes: newEvent.notes,
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", type: "content", volume: "", duration: "120", notes: "" });
    setIsDialogOpen(false);
    toast.success("Atividade adicionada ao calendário!");
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
    toast.success("Atividade removida");
  };

  const getEventsForDate = (day: number): StudyEvent[] => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    return events.filter((e) => e.date === dateStr);
  };

  const handleDateClick = (day: number) => {
    const dateStr = new Date(currentDate.getFullYear(), currentDate.getMonth(), day)
      .toISOString()
      .split("T")[0];
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const renderCalendar = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before month starts
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-24 bg-gray-50"></div>);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
      const dayEvents = getEventsForDate(day);
      const isToday =
        day === new Date().getDate() &&
        currentDate.getMonth() === new Date().getMonth() &&
        currentDate.getFullYear() === new Date().getFullYear();

      days.push(
        <div
          key={day}
          onClick={() => handleDateClick(day)}
          className={`h-24 border border-gray-200 p-2 cursor-pointer hover:bg-blue-50 transition-colors ${
            isToday ? "bg-blue-100" : "bg-white"
          }`}
        >
          <div className={`font-semibold mb-1 ${isToday ? "text-blue-700" : "text-foreground"}`}>
            {day}
          </div>
          <div className="space-y-1">
            {dayEvents.slice(0, 2).map((event) => {
              const typeInfo = activityTypes.find((t) => t.value === event.type);
              return (
                <div
                  key={event.id}
                  className={`text-xs px-2 py-1 rounded truncate ${typeInfo?.color}`}
                  title={event.title}
                >
                  {event.title}
                </div>
              );
            })}
            {dayEvents.length > 2 && (
              <div className="text-xs text-muted-foreground px-2">+{dayEvents.length - 2} mais</div>
            )}
          </div>
        </div>
      );
    }

    return days;
  };

  const upcomingEvents = events
    .filter((e) => new Date(e.date) >= new Date())
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Calendário de Estudos</h1>
          <p className="text-muted-foreground">Organize suas atividades de estudo e revisões</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button onClick={handlePrevMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronLeft size={24} />
                </button>
                <h2 className="text-2xl font-bold text-foreground">
                  {currentDate.toLocaleString("pt-BR", { month: "long", year: "numeric" })}
                </h2>
                <button onClick={handleNextMonth} className="p-2 hover:bg-gray-100 rounded-lg">
                  <ChevronRight size={24} />
                </button>
              </div>

              {/* Day Headers */}
              <div className="grid grid-cols-7 gap-0 mb-2">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                  <div key={day} className="text-center font-semibold text-muted-foreground py-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-0 border border-gray-200 rounded-lg overflow-hidden">
                {renderCalendar()}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Add Event Button */}
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white">
                  <Plus size={20} className="mr-2" />
                  Adicionar Atividade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Adicionar Atividade de Estudo</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  {/* Date */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Data</label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>

                  {/* Title */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Título</label>
                    <Input
                      placeholder="Ex: Estudar Funções Quadráticas"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  {/* Type */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Tipo</label>
                    <Select value={newEvent.type} onValueChange={(value: any) => setNewEvent({ ...newEvent, type: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {activityTypes.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Volume */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Volume (opcional)</label>
                    <Select value={newEvent.volume} onValueChange={(value) => setNewEvent({ ...newEvent, volume: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {fmeVolumes.map((vol) => (
                          <SelectItem key={vol.id} value={vol.number.toString()}>
                            Volume {vol.number} - {vol.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Duration */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Duração (minutos)</label>
                    <Input
                      type="number"
                      value={newEvent.duration}
                      onChange={(e) => setNewEvent({ ...newEvent, duration: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  {/* Notes */}
                  <div>
                    <label className="text-sm font-medium text-foreground">Notas</label>
                    <Input
                      placeholder="Adicione notas sobre esta atividade"
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                      className="mt-1"
                    />
                  </div>

                  <Button onClick={handleAddEvent} className="w-full bg-blue-600 hover:bg-blue-700">
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Upcoming Events */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                <CalendarIcon size={20} className="text-blue-600" />
                Próximas Atividades
              </h3>
              <div className="space-y-3">
                {upcomingEvents.length > 0 ? (
                  upcomingEvents.map((event) => {
                    const typeInfo = activityTypes.find((t) => t.value === event.type);
                    return (
                      <div
                        key={event.id}
                        className={`p-3 rounded-lg border ${typeInfo?.color} flex items-start justify-between`}
                      >
                        <div className="flex-1">
                          <div className="font-medium text-sm">{event.title}</div>
                          <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                            <Clock size={14} />
                            {new Date(event.date).toLocaleDateString("pt-BR")}
                            {event.duration && ` • ${event.duration}min`}
                          </div>
                          {event.volume && (
                            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-1">
                              <BookOpen size={14} />
                              Volume {event.volume}
                            </div>
                          )}
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="p-1 hover:bg-red-100 rounded text-red-600"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Nenhuma atividade próxima
                  </p>
                )}
              </div>
            </Card>

            {/* Statistics */}
            <Card className="p-4">
              <h3 className="font-semibold text-foreground mb-4">Estatísticas</h3>
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Total de Atividades:</span>
                  <span className="font-semibold">{events.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Próximas:</span>
                  <span className="font-semibold">{upcomingEvents.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Tempo Total:</span>
                  <span className="font-semibold">
                    {Math.round(events.reduce((sum, e) => sum + (e.duration || 0), 0) / 60)}h
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

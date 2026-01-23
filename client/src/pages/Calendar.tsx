import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Plus, X } from "lucide-react";
import { useEffect, useState } from "react";

interface StudyEvent {
  id: string;
  date: string;
  title: string;
  type: "content" | "revision" | "exercise" | "rest";
  volume?: number;
  notes?: string;
}

const activityTypes = [
  { value: "content", label: "Conteúdo Novo", color: "bg-blue-100 text-blue-900" },
  { value: "revision", label: "Revisão", color: "bg-green-100 text-green-900" },
  { value: "exercise", label: "Exercícios", color: "bg-purple-100 text-purple-900" },
  { value: "rest", label: "Descanso", color: "bg-gray-100 text-gray-900" },
];

export default function Calendar() {
  const [currentDate, setCurrentDate] = useState(new Date(2026, 0, 23)); // Jan 23, 2026
  const [events, setEvents] = useState<StudyEvent[]>([]);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [newEvent, setNewEvent] = useState({
    title: "",
    type: "content" as const,
    volume: "",
    notes: "",
  });

  // Load events from localStorage
  useEffect(() => {
    const saved = localStorage.getItem("fmeStudyEvents");
    if (saved) {
      setEvents(JSON.parse(saved));
    }
  }, []);

  // Save events to localStorage
  useEffect(() => {
    localStorage.setItem("fmeStudyEvents", JSON.stringify(events));
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
    if (!newEvent.title || !selectedDate) return;

    const event: StudyEvent = {
      id: Date.now().toString(),
      date: selectedDate,
      title: newEvent.title,
      type: newEvent.type,
      volume: newEvent.volume ? parseInt(newEvent.volume) : undefined,
      notes: newEvent.notes,
    };

    setEvents([...events, event]);
    setNewEvent({ title: "", type: "content", volume: "", notes: "" });
    setIsDialogOpen(false);
  };

  const handleDeleteEvent = (id: string) => {
    setEvents(events.filter((e) => e.id !== id));
  };

  const handleDateClick = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    setIsDialogOpen(true);
  };

  const getEventForDate = (day: number) => {
    const dateStr = `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    return events.filter((e) => e.date === dateStr);
  };

  const daysInMonth = getDaysInMonth(currentDate);
  const firstDay = getFirstDayOfMonth(currentDate);
  const days = [];

  // Empty cells for days before month starts
  for (let i = 0; i < firstDay; i++) {
    days.push(null);
  }

  // Days of the month
  for (let i = 1; i <= daysInMonth; i++) {
    days.push(i);
  }

  const monthName = currentDate.toLocaleDateString("pt-BR", { month: "long", year: "numeric" });

  return (
    <div className="min-h-screen bg-background pt-20 lg:pt-0 lg:ml-64 p-4 lg:p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-3" style={{ fontFamily: "'Poppins', sans-serif" }}>
            Calendário de Estudos
          </h1>
          <p className="text-base lg:text-lg text-muted-foreground">
            Organize e acompanhe seu cronograma de estudos personalizado
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card className="p-6">
              {/* Month Navigation */}
              <div className="flex items-center justify-between mb-6">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ChevronLeft size={20} />
                </button>
                <h2 className="text-xl font-semibold text-foreground capitalize" style={{ fontFamily: "'Poppins', sans-serif" }}>
                  {monthName}
                </h2>
                <button
                  onClick={handleNextMonth}
                  className="p-2 hover:bg-secondary rounded-lg transition-colors"
                >
                  <ChevronRight size={20} />
                </button>
              </div>

              {/* Weekday Headers */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sab"].map((day) => (
                  <div
                    key={day}
                    className="text-center font-semibold text-sm text-muted-foreground py-2"
                    style={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Days */}
              <div className="grid grid-cols-7 gap-2">
                {days.map((day, index) => {
                  const dayEvents = day ? getEventForDate(day) : [];
                  const isToday =
                    day &&
                    day === new Date().getDate() &&
                    currentDate.getMonth() === new Date().getMonth() &&
                    currentDate.getFullYear() === new Date().getFullYear();

                  return (
                    <div
                      key={index}
                      onClick={() => day && handleDateClick(day)}
                      className={`min-h-24 p-2 rounded-lg border-2 transition-all ${
                        day
                          ? "border-border hover:border-primary cursor-pointer hover:bg-secondary/50"
                          : "border-transparent"
                      } ${isToday ? "bg-primary/10 border-primary" : "bg-card"}`}
                    >
                      {day && (
                        <>
                          <div
                            className={`text-sm font-semibold mb-1 ${isToday ? "text-primary" : "text-foreground"}`}
                            style={{ fontFamily: "'Poppins', sans-serif" }}
                          >
                            {day}
                          </div>
                          <div className="space-y-1">
                            {dayEvents.slice(0, 2).map((event) => {
                              const actType = activityTypes.find((t) => t.value === event.type);
                              return (
                                <div
                                  key={event.id}
                                  className={`text-xs px-2 py-1 rounded truncate ${actType?.color}`}
                                  style={{ fontFamily: "'Inter', sans-serif" }}
                                >
                                  {event.title}
                                </div>
                              );
                            })}
                            {dayEvents.length > 2 && (
                              <div className="text-xs text-muted-foreground px-2">
                                +{dayEvents.length - 2} mais
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  );
                })}
              </div>
            </Card>
          </div>

          {/* Sidebar - Add Event */}
          <div className="space-y-6">
            <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
              <DialogTrigger asChild>
                <Button
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  onClick={() => {
                    const today = new Date();
                    const dateStr = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
                    setSelectedDate(dateStr);
                    setIsDialogOpen(true);
                  }}
                >
                  <Plus size={20} className="mr-2" />
                  Adicionar Atividade
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle style={{ fontFamily: "'Poppins', sans-serif" }}>
                    Nova Atividade de Estudo
                  </DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Data
                    </label>
                    <Input
                      type="date"
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Título
                    </label>
                    <Input
                      placeholder="Ex: Estudar Conjuntos"
                      value={newEvent.title}
                      onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Tipo de Atividade
                    </label>
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
                  <div>
                    <label className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Volume FME (opcional)
                    </label>
                    <Select value={newEvent.volume} onValueChange={(value) => setNewEvent({ ...newEvent, volume: value })}>
                      <SelectTrigger className="mt-1">
                        <SelectValue placeholder="Selecione um volume" />
                      </SelectTrigger>
                      <SelectContent>
                        {Array.from({ length: 11 }, (_, i) => i + 1).map((vol) => (
                          <SelectItem key={vol} value={vol.toString()}>
                            Volume {vol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-semibold text-foreground" style={{ fontFamily: "'Poppins', sans-serif" }}>
                      Notas (opcional)
                    </label>
                    <Input
                      placeholder="Adicione observações..."
                      value={newEvent.notes}
                      onChange={(e) => setNewEvent({ ...newEvent, notes: e.target.value })}
                      className="mt-1"
                    />
                  </div>
                  <Button
                    onClick={handleAddEvent}
                    className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-semibold"
                  >
                    Adicionar
                  </Button>
                </div>
              </DialogContent>
            </Dialog>

            {/* Events List */}
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-foreground mb-4" style={{ fontFamily: "'Poppins', sans-serif" }}>
                Próximas Atividades
              </h3>
              <div className="space-y-3">
                {events
                  .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                  .slice(0, 5)
                  .map((event) => {
                    const actType = activityTypes.find((t) => t.value === event.type);
                    return (
                      <div key={event.id} className="flex items-start gap-3 p-3 bg-secondary/50 rounded-lg">
                        <div className="flex-grow">
                          <p className="font-semibold text-foreground text-sm" style={{ fontFamily: "'Poppins', sans-serif" }}>
                            {event.title}
                          </p>
                          <p className="text-xs text-muted-foreground" style={{ fontFamily: "'Inter', sans-serif" }}>
                            {new Date(event.date).toLocaleDateString("pt-BR")} • {actType?.label}
                          </p>
                        </div>
                        <button
                          onClick={() => handleDeleteEvent(event.id)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X size={16} />
                        </button>
                      </div>
                    );
                  })}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

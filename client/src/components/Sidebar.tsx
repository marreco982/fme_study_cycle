import { Home, BookOpen, Calendar, Clock, Menu, X, BarChart3, Zap } from "lucide-react";
import { useState } from "react";

interface SidebarProps {
  activeSection: string;
  onSectionChange: (section: string) => void;
}

export default function Sidebar({ activeSection, onSectionChange }: SidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const menuItems = [
    { id: "home", label: "Início", icon: Home },
    { id: "guide", label: "Guia de Estudos", icon: BookOpen },
    { id: "calendar", label: "Calendário", icon: Calendar },
    { id: "schedule", label: "Cronograma", icon: Clock },
    { id: "dashboard", label: "Estatísticas", icon: BarChart3 },
    { id: "study-planner", label: "Planejador", icon: Zap },
  ];

  const handleNavClick = (sectionId: string) => {
    onSectionChange(sectionId);
    setIsOpen(false);
  };

  return (
    <>
      {/* Mobile Menu Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 lg:hidden p-2 rounded-md bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-lg"
        aria-label="Menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed left-0 top-0 h-screen w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 lg:translate-x-0 z-40 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-sidebar-border">
          <h1 className="text-2xl font-bold text-primary" style={{ fontFamily: "'Poppins', sans-serif" }}>FME Study</h1>
          <p className="text-sm text-muted-foreground mt-1">Ciclo de Estudos</p>
        </div>

        <nav className="p-4 space-y-1 flex-1">
          {menuItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-md transition-all duration-200 text-left ${
                  isActive
                    ? "bg-primary text-primary-foreground font-semibold shadow-md"
                    : "text-sidebar-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <Icon size={20} className="flex-shrink-0" />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-sidebar-border bg-secondary/50">
          <p className="text-xs text-muted-foreground text-center">
            Prepare-se para concursos com a FME
          </p>
        </div>
      </aside>

      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-30 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}

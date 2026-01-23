import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Sidebar from "@/components/Sidebar";
import NotFound from "@/pages/NotFound";
import { useState } from "react";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Guide from "./pages/Guide";
import Calendar from "./pages/Calendar";
import Schedule from "./pages/Schedule";

function Router({ activeSection, onSectionChange }: { activeSection: string; onSectionChange: (section: string) => void }) {
  return (
    <Switch>
      <Route path={"/"}>
        {() => <Home onNavigate={onSectionChange} />}
      </Route>
      <Route path={"/guide"}>
        {() => <Guide />}
      </Route>
      <Route path={"/calendar"}>
        {() => <Calendar />}
      </Route>
      <Route path={"/schedule"}>
        {() => <Schedule />}
      </Route>
      <Route path={"/404"} component={NotFound} />
      {/* Final fallback route */}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  const [activeSection, setActiveSection] = useState("home");

  const handleSectionChange = (section: string) => {
    setActiveSection(section);
    // Navigate using window.location for simplicity
    if (section === "home") window.location.href = "/";
    if (section === "guide") window.location.href = "/guide";
    if (section === "calendar") window.location.href = "/calendar";
    if (section === "schedule") window.location.href = "/schedule";
  };

  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="light">
        <TooltipProvider>
          <Toaster />
          <Sidebar activeSection={activeSection} onSectionChange={handleSectionChange} />
          <Router activeSection={activeSection} onSectionChange={handleSectionChange} />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;

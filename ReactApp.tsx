import { useEffect, useState } from "react";
import DashboardPage from "./pages/DashboardPage";
import EvidencePage from "./pages/EvidencePage";
import PeoplePage from "./pages/PeoplePage";
import TimelinePage from "./pages/TimelinePage";
import WorkspacePage from "./pages/WorkspacePage";
import Header from "./components/Header";
import Navigation from "./components/Navigation";

type ViewName =
  | "dashboard"
  | "evidence"
  | "people"
  | "timeline"
  | "workspace";

const validViews: ViewName[] = [
  "dashboard",
  "evidence",
  "people",
  "timeline",
  "workspace",
];

function getViewFromHash(): ViewName {
  const hash = window.location.hash.replace("#", "");

  if (validViews.includes(hash as ViewName)) {
    return hash as ViewName;
  }

  return "dashboard";
}

export default function App() {
  const [currentView, setCurrentView] = useState<ViewName>(
    getViewFromHash()
  );

  useEffect(() => {
    function handleHashChange() {
      setCurrentView(getViewFromHash());
    }

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  function navigateTo(view: ViewName) {
    window.location.hash = view;
  }

  return (
    <div>
      <Header />

      <Navigation
        currentView={currentView}
        onNavigate={navigateTo}
      />

      <main>
        {currentView === "dashboard" && (
          <DashboardPage onNavigate={navigateTo} />
        )}

        {currentView === "evidence" && <EvidencePage />}

        {currentView === "people" && <PeoplePage />}

        {currentView === "timeline" && <TimelinePage />}

        {currentView === "workspace" && <WorkspacePage />}
      </main>
    </div>
  );
}
type ViewName =
  | "dashboard"
  | "evidence"
  | "people"
  | "timeline"
  | "workspace";

type NavigationProps = {
  currentView: ViewName;
  onNavigate: (view: ViewName) => void;
};

export default function Navigation({
  currentView,
  onNavigate,
}: NavigationProps) {
  return (
    <nav>
      <button
        onClick={() => onNavigate("dashboard")}
        disabled={currentView === "dashboard"}
      >
        Dashboard
      </button>

      <button
        onClick={() => onNavigate("evidence")}
        disabled={currentView === "evidence"}
      >
        Evidence
      </button>

      <button
        onClick={() => onNavigate("people")}
        disabled={currentView === "people"}
      >
        People & Locations
      </button>

      <button
        onClick={() => onNavigate("timeline")}
        disabled={currentView === "timeline"}
      >
        Timeline
      </button>

      <button
        onClick={() => onNavigate("workspace")}
        disabled={currentView === "workspace"}
      >
        Workspace
      </button>
    </nav>
  );
}
type ViewName = "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export function navigateTo(viewName: ViewName): void {
  window.location.hash = viewName;
}

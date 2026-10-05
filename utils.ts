export function formatDate(
  ts: string | number | Date | null | undefined,
): string {
  if (!ts) return "Unknown date";
  const d = new Date(ts);
  if (isNaN(d.getTime())) return String(ts);
  return (
    d.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    d.toLocaleTimeString(undefined, { hour: "2-digit", minute: "2-digit" })
  );
}

export function getStatusBadgeClass(status: string | null | undefined): string {
  const s = (status || "").toLowerCase();
  if (s === "reviewed") return "badge-reviewed";
  if (s === "flagged") return "badge-flagged";
  return "badge-unreviewed";
}

export function getRelevanceBadgeClass(
  relevance: string | null | undefined,
): string {
  const r = (relevance || "").toLowerCase();
  if (r === "relevant") return "badge-relevant";
  return "badge-unreviewed";
}

type TimelineEvent = {
  id?: string;
  time: string;
  title: string;
};

type RecentTimelineListProps = {
  timeline: TimelineEvent[];
};

function formatDate(timestamp: string): string {
  if (!timestamp) {
    return "Unknown date";
  }

  const date = new Date(timestamp);

  if (Number.isNaN(date.getTime())) {
    return timestamp;
  }

  return (
    date.toLocaleDateString(undefined, {
      year: "numeric",
      month: "short",
      day: "numeric",
    }) +
    " " +
    date.toLocaleTimeString(undefined, {
      hour: "2-digit",
      minute: "2-digit",
    })
  );
}

export default function RecentTimelineList({
  timeline,
}: RecentTimelineListProps) {
  const recentTimeline = timeline.slice(-5).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent timeline events</h3>

      {recentTimeline.length === 0 && (
        <p>No timeline events loaded yet.</p>
      )}

      {recentTimeline.map((event, index) => (
        <div
          className="mini-list-item"
          key={event.id ?? `${event.time}-${index}`}
        >
          <strong>{formatDate(event.time)}</strong>
          <br />
          {event.title}
        </div>
      ))}
    </div>
  );
}
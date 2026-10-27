import TimelineEventCard from "../components/timeline/TimelineEventCard";

type TimelineEvent = {
  id: string;
  title: string;
  description: string;
  time: string;
  certainty: string;
};


const events: TimelineEvent[] = [
  {
    id: "T01",
    title: "Example event",
    description: "Example timeline event for the React migration.",
    time: "2026-10-01 09:00",
    certainty: "confirmed",
  },
  {
    id: "T02",
    title: "Second event",
    description: "Another example timeline event.",
    time: "2026-10-01 10:00",
    certainty: "probable",
  },
];


export default function TimelinePage() {
  return (
    <div>
      <h2>Timeline</h2>

      {events.length === 0 && (
        <p>No timeline events match the current filters.</p>
      )}

      {events.map((event) => (
        <TimelineEventCard
          key={event.id}
          title={event.title}
          description={event.description}
          time={event.time}
          certainty={event.certainty}
        />
      ))}
    </div>
  );
}
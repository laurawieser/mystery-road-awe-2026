type TimelineEventCardProps = {
  title: string;
  description: string;
  time: string;
  certainty: string;
};


function getCertaintyBadgeClass(certainty: string): string {
  if (certainty === "confirmed") {
    return "badge badge-reviewed";
  }

  if (certainty === "probable") {
    return "badge badge-flagged";
  }

  return "badge badge-unreviewed";
}

export default function TimelineEventCard({
  title,
  description,
  time,
  certainty,
}: TimelineEventCardProps) {
  return (
    <div className="timeline-event">
      <div className="timeline-time">
        {time} ·{" "}
        <span className={getCertaintyBadgeClass(certainty)}>
          {certainty}
        </span>
      </div>

      <h3>{title}</h3>
      <p>{description}</p>
    </div>
  );
}
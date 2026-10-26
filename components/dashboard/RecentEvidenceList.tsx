type EvidenceItem = {
  id: string;
  title: string;
  status: string;
};

type RecentEvidenceListProps = {
  evidence: EvidenceItem[];
};

function getStatusBadgeClass(status: string): string {
  const normalizedStatus = status.toLowerCase();

  if (normalizedStatus === "reviewed") {
    return "badge-reviewed";
  }

  if (normalizedStatus === "flagged") {
    return "badge-flagged";
  }

  return "badge-unreviewed";
}

export default function RecentEvidenceList({
  evidence,
}: RecentEvidenceListProps) {
  const recentEvidence = evidence.slice(-5).reverse();

  return (
    <div className="dashboard-panel">
      <h3>Recent evidence</h3>

      {recentEvidence.length === 0 && (
        <p>No evidence loaded yet.</p>
      )}

      {recentEvidence.map((item) => (
        <div className="mini-list-item" key={item.id}>
          <strong>{item.id}</strong>
          {" — "}
          {item.title}{" "}
          <span
            className={`badge ${getStatusBadgeClass(item.status)}`}
          >
            {item.status}
          </span>
        </div>
      ))}
    </div>
  );
}
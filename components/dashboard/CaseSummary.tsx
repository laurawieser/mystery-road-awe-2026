type CaseSummaryProps = {
  title: string;
  status: string;
  summary: string;
};

export default function CaseSummary({
  title,
  status,
  summary,
}: CaseSummaryProps) {
  return (
    <div className="case-summary-card">
      <h3>{title || "Case"}</h3>

      <p>
        <span className="badge badge-flagged">
          {(status || "unknown").toUpperCase()}
        </span>
      </p>

      <p>{summary}</p>
    </div>
  );
}
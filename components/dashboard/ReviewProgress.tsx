type ReviewProgressProps = {
  reviewed: number;
  total: number;
};

export default function ReviewProgress({
  reviewed,
  total,
}: ReviewProgressProps) {
  const percentage =
    total === 0
      ? 0
      : Math.round((reviewed / total) * 100);

  return (
    <div className="dashboard-panel">
      <h3>Review progress</h3>

      <div className="progress-bar-outer">
        <div
          className="progress-bar-inner"
          style={{ width: `${percentage}%` }}
        />
      </div>

      <p>{percentage}% of evidence reviewed</p>
    </div>
  );
}
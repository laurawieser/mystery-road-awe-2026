
import { useEffect, useState } from "react";

import IntroCard from "../components/dashboard/IntroCard";
import CaseSummary from "../components/dashboard/CaseSummary";
import StatCard from "../components/dashboard/StatCard";
import ReviewProgress from "../components/dashboard/ReviewProgress";
import RecentEvidenceList from "../components/dashboard/RecentEvidenceList";
import RecentTimelineList from "../components/dashboard/RecentTimelineList";
import Panel from "../components/UI/Panel";

type ViewName =
  | "dashboard"
  | "evidence"
  | "people"
  | "timeline"
  | "workspace";

type DashboardPageProps = {
  onNavigate: (view: ViewName) => void;
};

type CaseData = {
  title: string;
  status: string;
  summary: string;
};

type EvidenceItem = {
  id: string;
  title: string;
  status: string;
};

type Person = {
  id: string;
};

type Location = {
  id: string;
};

type TimelineEvent = {
  id?: string;
  time: string;
  title: string;
};

export default function DashboardPage({
  onNavigate,
}: DashboardPageProps) {
  const [caseData, setCaseData] =
    useState<CaseData | null>(null);

  const [evidence, setEvidence] =
    useState<EvidenceItem[]>([]);

  const [people, setPeople] =
    useState<Person[]>([]);

  const [locations, setLocations] =
    useState<Location[]>([]);

  const [timeline, setTimeline] =
    useState<TimelineEvent[]>([]);

  const [bookmarkCount, setBookmarkCount] =
    useState(0);

  const [loading, setLoading] =
    useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      try {
        const [
          caseResponse,
          evidenceResponse,
          peopleResponse,
          locationsResponse,
          timelineResponse,
        ] = await Promise.all([
          fetch("data/case.json"),
          fetch("data/evidence.json"),
          fetch("data/people.json"),
          fetch("data/locations.json"),
          fetch("data/timeline.json"),
        ]);

        const [
          caseJson,
          evidenceJson,
          peopleJson,
          locationsJson,
          timelineJson,
        ] = await Promise.all([
          caseResponse.json(),
          evidenceResponse.json(),
          peopleResponse.json(),
          locationsResponse.json(),
          timelineResponse.json(),
        ]);

        setCaseData(caseJson as CaseData);
        setEvidence(evidenceJson as EvidenceItem[]);
        setPeople(peopleJson as Person[]);
        setLocations(locationsJson as Location[]);
        setTimeline(timelineJson as TimelineEvent[]);

        const storedBookmarks =
          localStorage.getItem("remotion_bookmarks");

        if (storedBookmarks) {
          const parsedBookmarks =
            JSON.parse(storedBookmarks) as string[];

          setBookmarkCount(parsedBookmarks.length);
        }
      } catch (error) {
        console.error(
          "Failed to load dashboard data",
          error
        );
      } finally {
        setLoading(false);
      }
    }

    loadDashboardData();
  }, []);

  if (loading) {
    return <p>Loading dashboard...</p>;
  }

  if (!caseData) {
    return <p>Case data could not be loaded.</p>;
  }

  const reviewedCount = evidence.filter(
    (item) =>
      item.status.toLowerCase() === "reviewed"
  ).length;

  return (
    <div>
      <h2>Case Dashboard</h2>

      <IntroCard onNavigate={onNavigate} />

      <CaseSummary
        title={caseData.title}
        status={caseData.status}
        summary={caseData.summary}
      />

      <div className="stat-grid">
        <StatCard
          value={evidence.length}
          label="Evidence items"
        />

        <StatCard
          value={people.length}
          label="People"
        />

        <StatCard
          value={locations.length}
          label="Locations"
        />

        <StatCard
          value={bookmarkCount}
          label="Bookmarked"
        />

        <StatCard
          value={reviewedCount}
          label="Reviewed"
        />
      </div>

      <ReviewProgress
        reviewed={reviewedCount}
        total={evidence.length}
      />

      <div className="dashboard-columns">
        <Panel title="Recent Evidence">
          <RecentEvidenceList evidence={evidence} />
        </Panel>

        <Panel title="Recent Timeline Events">
          <RecentTimelineList timeline={timeline} />
        </Panel>
      </div>
    </div>
  );
}

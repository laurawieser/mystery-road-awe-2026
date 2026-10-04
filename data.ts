import {
  setAllEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData,
} from "./state.js";

import { setEvidenceViewLoading } from "./evidence.js";

import type {
  CaseFile,
  Evidence,
  Person,
  Location,
  TimelineEvent,
} from "./types";

export async function loadCorePeopleAndLocations(): Promise<void> {
  const caseRes = await fetch("data/case.json");
  const caseData: CaseFile = await caseRes.json();
  setCaseData(caseData);

  const peopleRes = await fetch("data/people.json");
  const people: Person[] = await peopleRes.json();
  setAllPeople(people);

  const locationsRes = await fetch("data/locations.json");
  const locations: Location[] = await locationsRes.json();
  setAllLocations(locations);
}

export async function loadEvidenceData(): Promise<Evidence[]> {
  const res = await fetch("data/evidence.json");
  const evidence: Evidence[] = await res.json();

  setAllEvidence(evidence);
  setEvidenceViewLoading(false);

  return evidence;
}

export async function loadTimelineData(): Promise<TimelineEvent[]> {
  const res = await fetch("data/timeline.json")
  const timeline: TimelineEvent[] = await res.json();
  
  setAllTimeline(timeline);
  return timeline;
}

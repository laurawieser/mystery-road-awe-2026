export type PersonId = string;
export type LocationId = string;
export type EvidenceId = string;
export type TimelineEventId = string;
export type NotesStore = Record<EvidenceId, string>;
export type EvidenceStatus = "unreviewed" | "reviewed" | "flagged";
export type EvidenceRelevance = "unknown" | "relevant" | "irrelevant";

export interface CaseFile {
  caseId: string;
  title: string;
  subtitle: string;
  status: string;
  opened: string;
  summary: string;
  location: string;
  leadInvestigator: string;
  notes: string;
}

export interface Location {
  id: LocationId;
  name: string;
  description: string;
  contains: string[];
}

export interface Person {
  id: PersonId;
  name: string;
  role: string;
  speciality: string;
  responsibilities: string[];
  statement: string;
  background: string;
  avatar: string;
}

export interface Evidence {
  id: EvidenceId;
  type: string;
  title: string;
  timestamp: string;
  summary: string;
  content: string;
  personIds: PersonId[];
  locationIds: LocationId[];
  tags: string[];
  status: EvidenceStatus;
  relevance: EvidenceRelevance;
  bookmarked?: boolean;
}

export type TimelineCertainty = "confirmed" | "reported" | "contradictory";

export type TimelineEventType =
  | "report"
  | "decision"
  | "release"
  | "access"
  | "communication"
  | "software-change"
  | "observation"
  | "maintenance"
  | "infrastructure"
  | "system"
  | "incident";

export interface TimelineEvent {
  id: TimelineEventId;
  time: string;
  title: string;
  description: string;
  type: TimelineEventType;
  certainty: TimelineCertainty;
  personIds: PersonId[];
  locationIds: LocationId[];
  evidenceIds: EvidenceId[];
}

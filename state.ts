import type {
  CaseFile,
  Evidence,
  EvidenceId,
  Location,
  NotesStore,
  Person,
  TimelineEvent,
} from "./types.js";

export type ViewName =
  "dashboard" | "evidence" | "people" | "timeline" | "workspace";

export let allEvidence: Evidence[] = [];
export let allPeople: Person[] = [];
export let allLocations: Location[] = [];
export let allTimeline: TimelineEvent[] = [];

export let caseData: CaseFile | null = null;

export let bookmarks: EvidenceId[] = [];
export let notesStore: NotesStore = {};

export let currentPage: ViewName = "dashboard";

export const viewRendered: Record<ViewName, boolean> = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false,
};

export function setAllEvidence(value: Evidence[]): void {
  allEvidence = value;
}

export function setAllPeople(value: Person[]): void {
  allPeople = value;
}

export function setAllLocations(value: Location[]): void {
  allLocations = value;
}

export function setAllTimeline(value: TimelineEvent[]): void {
  allTimeline = value;
}

export function setCaseData(value: CaseFile): void {
  caseData = value;
}

export function setBookmarks(value: EvidenceId[]): void {
  bookmarks = value;
}

export function setNotesStore(value: NotesStore): void {
  notesStore = value;
}

export function setCurrentPage(value: ViewName): void {
  currentPage = value;
}

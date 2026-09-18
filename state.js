export let allEvidence = [];
export let allPeople = [];
export let allLocations = [];
export let allTimeline = [];
export let caseData = {};
export let bookmarks = [];
export let notesStore = {}; 
export let currentPage = "dashboard";
export let viewRendered = {
  dashboard: false,
  evidence: false,
  people: false,
  timeline: false,
  workspace: false
};


export function setAllEvidence(value) {
  allEvidence = value;
}

export function setAllPeople(value) {
  allPeople = value;
}

export function setAllLocations(value) {
  allLocations = value;
}

export function setAllTimeline(value) {
  allTimeline = value;
}

export function setCaseData(value) {
  caseData = value;
}

export function setBookmarks(value) {
  bookmarks = value;
}

export function setNotesStore(value) {
  notesStore = value;
}

export function setCurrentPage(value) {
  currentPage = value;
}
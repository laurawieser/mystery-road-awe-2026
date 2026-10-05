import {
  allEvidence,
  allPeople,
  allLocations,
  bookmarks,
  currentPage,
  setBookmarks,
  viewRendered,
} from "./state.js";

import {
  findEvidenceById,
  findPersonById,
  findLocationById,
  evidenceMentionsPerson,
} from "./lookup.js";

import {
  formatDate,
  getStatusBadgeClass,
  getRelevanceBadgeClass,
} from "./utils.js";

import {
  saveBookmarksToStorage,
  saveNoteForEvidence,
  loadNoteForEvidence,
} from "./storage.js";

import type {
  Evidence,
  EvidenceId,
  EvidenceStatus,
  EvidenceRelevance,
} from "./types.js";

declare global {
  interface Window {
    closeEvidenceDetail: () => void;
    saveCurrentNote: () => void;
    handleSortChange: () => void;
    renderEvidenceList: () => void;
  }
}

let filteredEvidence: Evidence[] = [];
let selectedEvidence: Evidence | null = null;
let evidenceViewLoading = true;
let latestSearchRequestId = 0;

export function setFilteredEvidence(value: Evidence[]): void {
  filteredEvidence = value;
}

export function setEvidenceViewLoading(value: boolean): void {
  evidenceViewLoading = value;
}

export function populateEvidenceDropdowns(): void {
  const typeSelect = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;

  const personSelect = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;

  const locationSelect = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;

  if (!typeSelect || !personSelect || !locationSelect) {
    return;
  }

  const types: string[] = [];

  for (let i = 0; i < allEvidence.length; i++) {
    const t = allEvidence[i].type.toLowerCase();

    if (types.indexOf(t) === -1) {
      types.push(t);
    }
  }

  typeSelect.innerHTML = '<option value="">All types</option>';

  for (let ti = 0; ti < types.length; ti++) {
    typeSelect.innerHTML +=
      '<option value="' + types[ti] + '">' + types[ti] + "</option>";
  }

  personSelect.innerHTML = '<option value="">All people</option>';

  for (let p = 0; p < allPeople.length; p++) {
    personSelect.innerHTML +=
      '<option value="' +
      allPeople[p].id +
      '">' +
      allPeople[p].name +
      "</option>";
  }

  locationSelect.innerHTML = '<option value="">All locations</option>';

  for (let l = 0; l < allLocations.length; l++) {
    locationSelect.innerHTML +=
      '<option value="' +
      allLocations[l].id +
      '">' +
      allLocations[l].id +
      " - " +
      allLocations[l].name +
      "</option>";
  }
}

function getFilteredEvidence(): Evidence[] {
  const searchBox = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;

  const typeSelect = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;

  const personSelect = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;

  const locationSelect = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;

  const statusSelect = document.getElementById(
    "filterStatus",
  ) as HTMLSelectElement | null;

  const relevanceSelect = document.getElementById(
    "filterRelevance",
  ) as HTMLSelectElement | null;

  const sortSelect = document.getElementById(
    "sortEvidence",
  ) as HTMLSelectElement | null;

  const searchTerm = searchBox ? searchBox.value.toLowerCase().trim() : "";

  const typeVal = typeSelect?.value ?? "";
  const personVal = personSelect?.value ?? "";
  const locationVal = locationSelect?.value ?? "";
  const statusVal = statusSelect?.value ?? "";
  const relevanceVal = relevanceSelect?.value ?? "";

  const results: Evidence[] = [];

  for (let i = 0; i < allEvidence.length; i++) {
    const item = allEvidence[i];

    let matches = true;

    if (searchTerm) {
      const haystack = (
        item.title +
        " " +
        item.summary +
        " " +
        item.tags.join(" ")
      ).toLowerCase();

      if (haystack.indexOf(searchTerm) === -1) {
        matches = false;
      }
    }

    if (matches && typeVal && item.type.toLowerCase() !== typeVal) {
      matches = false;
    }

    if (matches && personVal) {
      const person = findPersonById(personVal);

      if (!person || !evidenceMentionsPerson(item, person)) {
        matches = false;
      }
    }

    if (
      matches &&
      locationVal &&
      item.locationIds.indexOf(locationVal) === -1
    ) {
      matches = false;
    }

    if (matches && statusVal && item.status.toLowerCase() !== statusVal) {
      matches = false;
    }

    if (
      matches &&
      relevanceVal &&
      item.relevance.toLowerCase() !== relevanceVal
    ) {
      matches = false;
    }

    if (matches) {
      results.push(item);
    }
  }

  const sortValue = sortSelect?.value ?? "";

  if (sortValue === "title-asc") {
    results.sort((a, b) => {
      return a.title.localeCompare(b.title);
    });
  } else if (sortValue === "title-desc") {
    results.sort((a, b) => {
      return b.title.localeCompare(a.title);
    });
  } else if (sortValue === "date-asc") {
    results.sort((a, b) => {
      return new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime();
    });
  } else {
    results.sort((a, b) => {
      return new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime();
    });
  }

  filteredEvidence = results;

  return results;
}

export function renderEvidenceList(): void {
  const container = document.getElementById("evidenceList");

  if (!container) {
    return;
  }

  const loadingIndicator = document.getElementById("evidenceLoadingIndicator");

  if (evidenceViewLoading) {
    if (loadingIndicator) {
      loadingIndicator.classList.remove("hidden");
    }

    container.innerHTML = "";
    return;
  }

  if (loadingIndicator) {
    loadingIndicator.classList.add("hidden");
  }

  const results = getFilteredEvidence();

  let html = "";

  if (results.length === 0) {
    html = "<p>No evidence matches the current filters.</p>";
  }

  for (let i = 0; i < results.length; i++) {
    html += renderEvidenceCardHTML(results[i]);
  }

  container.innerHTML = html;

  // Event delegation for card clicks / bookmark button.
  container.addEventListener("click", handleEvidenceListClick);
}

function renderEvidenceCardHTML(ev: Evidence): string {
  const isBookmarked = bookmarks.indexOf(ev.id) !== -1;

  let html = '<div class="evidence-card" data-id="' + ev.id + '">';

  html +=
    '<button class="bookmark-btn ' +
    (isBookmarked ? "active" : "") +
    '" data-action="bookmark" data-id="' +
    ev.id +
    '" aria-label="Toggle bookmark for ' +
    ev.title +
    '"><span class="bookmark-icon">' +
    (isBookmarked ? "★" : "☆") +
    "</span></button>";

  html += "<h3>" + ev.title + "</h3>";

  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div>";

  html += '<div class="evidence-summary">' + ev.summary + "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html += '<span class="badge badge-critical">Critical</span>';
  }

  html +=
    '<span class="badge ' +
    getStatusBadgeClass(ev.status) +
    '">' +
    ev.status +
    "</span>";

  html +=
    '<span class="badge ' +
    getRelevanceBadgeClass(ev.relevance) +
    '">' +
    ev.relevance +
    "</span>";

  html += "<div>";

  for (let t = 0; t < ev.tags.length; t++) {
    html += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  html += "</div>";
  html += "</div>";

  return html;
}

function handleEvidenceListClick(event: Event): void {
  const target = event.target;

  if (!(target instanceof HTMLElement)) {
    return;
  }

  if (target.dataset && target.dataset.action === "bookmark") {
    event.stopPropagation();

    const evidenceId = target.dataset.id;

    if (evidenceId) {
      handleBookmarkClick(evidenceId);
    }

    return;
  }

  const card = target.closest(".evidence-card");

  if (card) {
    const evidenceId = card.getAttribute("data-id");

    if (evidenceId) {
      openEvidenceDetail(evidenceId);
    }
  }
}

function handleBookmarkClick(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);

  if (!ev) {
    return;
  }

  if (bookmarks.indexOf(evidenceId) === -1) {
    bookmarks.push(evidenceId);
    ev.bookmarked = true;
  } else {
    setBookmarks(bookmarks.filter((id) => id !== evidenceId));
    ev.bookmarked = false;
  }

  saveBookmarksToStorage();

  if (currentPage === "evidence") {
    renderEvidenceList();
  }
}

export function applyStoredBookmarkFlags(): void {
  for (let i = 0; i < allEvidence.length; i++) {
    allEvidence[i].bookmarked = bookmarks.indexOf(allEvidence[i].id) !== -1;
  }
}

function handleSortChange(): void {
  renderEvidenceList();
}

export function clearFilters(): void {
  const search = document.getElementById(
    "evidenceSearch",
  ) as HTMLInputElement | null;

  const type = document.getElementById(
    "filterType",
  ) as HTMLSelectElement | null;

  const person = document.getElementById(
    "filterPerson",
  ) as HTMLSelectElement | null;

  const location = document.getElementById(
    "filterLocation",
  ) as HTMLSelectElement | null;

  const status = document.getElementById(
    "filterStatus",
  ) as HTMLSelectElement | null;

  const relevance = document.getElementById(
    "filterRelevance",
  ) as HTMLSelectElement | null;

  if (search) search.value = "";
  if (type) type.value = "";
  if (person) person.value = "";
  if (location) location.value = "";
  if (status) status.value = "";
  if (relevance) relevance.value = "";

  renderEvidenceList();
}

function simulateAsyncSearch(term: string): Promise<string> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(term);
    }, 300);
  });
}

export function handleSearchInput(event: Event): void {
  const target = event.target;

  if (!(target instanceof HTMLInputElement)) {
    return;
  }

  const term = target.value;
  const requestId = ++latestSearchRequestId;

  simulateAsyncSearch(term).then(() => {
    // Only apply this response if nothing newer has been typed meanwhile.
    if (requestId !== latestSearchRequestId) {
      return;
    }

    renderEvidenceList();
  });
}

export function openEvidenceDetail(evidenceId: EvidenceId): void {
  const ev = findEvidenceById(evidenceId);

  if (!ev) {
    return;
  }

  selectedEvidence = ev;

  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    return;
  }

  section.classList.remove("hidden");

  renderEvidenceDetail(ev);

  section.scrollIntoView({
    behavior: "smooth",
    block: "start",
  });
}

function closeEvidenceDetail(): void {
  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    return;
  }

  section.classList.add("hidden");
  section.innerHTML = "";

  selectedEvidence = null;
}

function isEvidenceStatus(value: string): value is EvidenceStatus {
  return value === "unreviewed" || value === "reviewed" || value === "flagged";
}

function isEvidenceRelevance(value: string): value is EvidenceRelevance {
  return value === "unknown" || value === "relevant" || value === "irrelevant";
}

function renderEvidenceDetail(ev: Evidence): void {
  const section = document.getElementById("evidenceDetailSection");

  if (!section) {
    return;
  }

  const personNames: string[] = [];

  for (let p = 0; p < ev.personIds.length; p++) {
    const person = findPersonById(ev.personIds[p]);

    personNames.push(person ? person.name : ev.personIds[p]);
  }

  const locationNames: string[] = [];

  for (let l = 0; l < ev.locationIds.length; l++) {
    const loc = findLocationById(ev.locationIds[l]);

    locationNames.push(loc ? loc.id + " - " + loc.name : ev.locationIds[l]);
  }

  let tagsHtml = "";

  for (let t = 0; t < ev.tags.length; t++) {
    tagsHtml += '<span class="tag-chip">' + ev.tags[t] + "</span>";
  }

  const storedNote = loadNoteForEvidence(ev.id);

  let html = "";

  html += '<div class="evidence-detail-header">';
  html += "<div><h2>" + ev.title + "</h2>";

  html +=
    '<div class="evidence-meta">' +
    ev.id +
    " &middot; " +
    ev.type +
    " &middot; " +
    formatDate(ev.timestamp) +
    "</div></div>";

  html +=
    '<button type="button" class="btn btn-secondary btn-small" onclick="closeEvidenceDetail()">Close</button>';

  html += "</div>";

  if (ev.tags.indexOf("critical") !== -1) {
    html +=
      '<div class="warning-banner">This item is tagged as critical evidence.</div>';
  }

  html +=
    '<div class="detail-field"><strong>Summary</strong>' +
    ev.summary +
    "</div>";

  html += '<div class="evidence-detail-content">' + ev.content + "</div>";

  html +=
    '<div class="detail-field"><strong>Related people</strong>' +
    personNames.join(", ") +
    "</div>";

  html +=
    '<div class="detail-field"><strong>Related locations</strong>' +
    locationNames.join(", ") +
    "</div>";

  html +=
    '<div class="detail-field"><strong>Tags</strong>' + tagsHtml + "</div>";

  html += '<div class="detail-field"><strong>Review status</strong>';

  html += '<select id="detailStatusSelect">';

  html += statusOptionHTML(ev.status, "unreviewed", "Unreviewed");

  html += statusOptionHTML(ev.status, "reviewed", "Reviewed");

  html += statusOptionHTML(ev.status, "flagged", "Flagged");

  html += "</select></div>";

  html += '<div class="detail-field"><strong>Relevance</strong>';

  html += '<select id="detailRelevanceSelect">';

  html += statusOptionHTML(ev.relevance, "unknown", "Unknown");

  html += statusOptionHTML(ev.relevance, "relevant", "Relevant");

  html += statusOptionHTML(ev.relevance, "irrelevant", "Irrelevant");

  html += "</select></div>";

  html += '<div class="detail-field"><strong>Investigator note</strong>';

  html +=
    '<textarea id="evidenceNoteInput" class="note-textarea" rows="3" data-evidence-id="' +
    ev.id +
    '" placeholder="Add a private note about this evidence...">' +
    storedNote +
    "</textarea>";

  html +=
    '<button type="button" class="btn btn-primary btn-small" style="margin-top:6px;" onclick="saveCurrentNote()">Save note</button>';

  html += "</div>";

  html +=
    '<div class="detail-field"><strong>Note preview</strong><div id="notePreview">' +
    storedNote +
    "</div></div>";

  section.innerHTML = html;

  const statusSelect = document.getElementById(
    "detailStatusSelect",
  ) as HTMLSelectElement | null;

  statusSelect?.addEventListener("change", (event) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    if (!isEvidenceStatus(target.value)) {
      return;
    }

    ev.status = target.value;

    renderEvidenceDetail(ev);

    if (viewRendered.evidence) {
      renderEvidenceList();
    }
  });

  const relevanceSelect = document.getElementById(
    "detailRelevanceSelect",
  ) as HTMLSelectElement | null;

  relevanceSelect?.addEventListener("change", (event) => {
    const target = event.currentTarget;

    if (!(target instanceof HTMLSelectElement)) {
      return;
    }

    if (!isEvidenceRelevance(target.value)) {
      return;
    }

    ev.relevance = target.value;

    renderEvidenceDetail(ev);

    if (viewRendered.evidence) {
      renderEvidenceList();
    }
  });
}

function statusOptionHTML(
  current: string,
  value: string,
  label: string,
): string {
  const currentLower = current.toLowerCase();
  const selected = currentLower === value ? " selected" : "";

  return '<option value="' + value + '"' + selected + ">" + label + "</option>";
}

function saveCurrentNote(): void {
  const textarea = document.getElementById(
    "evidenceNoteInput",
  ) as HTMLTextAreaElement | null;

  if (!textarea) {
    return;
  }

  const evidenceId = textarea.getAttribute("data-evidence-id");

  if (!evidenceId) {
    return;
  }

  const text = textarea.value;

  saveNoteForEvidence(evidenceId, text);

  const preview = document.getElementById("notePreview");

  if (preview) {
    preview.innerHTML = text;
  }
}

window.closeEvidenceDetail = closeEvidenceDetail;
window.saveCurrentNote = saveCurrentNote;
window.handleSortChange = handleSortChange;
window.renderEvidenceList = renderEvidenceList;

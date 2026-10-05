import {
  loadCorePeopleAndLocations,
  loadEvidenceData,
  loadTimelineData,
} from "./data.js";

import {
  allEvidence,
  currentPage,
  setCurrentPage,
  viewRendered,
} from "./state.js";

import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  loadNoteAsync,
} from "./storage.js";

import { renderDashboard } from "./dashboard.js";
import { switchPeopleTab, renderPeople, renderLocations } from "./people.js";

import {
  populateEvidenceDropdowns,
  renderEvidenceList,
  applyStoredBookmarkFlags,
  clearFilters,
  handleSearchInput,
  setFilteredEvidence,
} from "./evidence.js";

import { populateTimelineDropdowns, renderTimeline } from "./timeline.js";

import { renderWorkspace, populateHypothesisDropdowns } from "./workspace.js";

import { navigateTo } from "./navigation.js";

import type { ViewName } from "./state.js";

declare global {
  interface Window {
    switchPeopleTab: typeof switchPeopleTab;
    navigateTo: typeof navigateTo;
  }
}

window.switchPeopleTab = switchPeopleTab;
window.navigateTo = navigateTo;

// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------

let loadingStepsRemaining = 2;

// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

function showLoadingOverlay(msg: string): void {
  const overlay = document.getElementById("loadingOverlay");
  const text = document.getElementById("loadingText");

  if (text) {
    text.textContent = msg;
  }

  if (overlay) {
    overlay.classList.remove("hidden");
  }
}

function hideLoadingStep(): void {
  loadingStepsRemaining--;

  if (loadingStepsRemaining <= 0) {
    const overlay = document.getElementById("loadingOverlay");

    if (overlay) {
      overlay.classList.add("hidden");
    }
  }
}

function loadAllData(): Promise<void> {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;

  return loadCorePeopleAndLocations().then(() => {
    hideLoadingStep();
    renderDashboard();
    populateAllDropdowns();

    loadEvidenceData()
      .then(() => {
        applyStoredBookmarkFlags();
        setFilteredEvidence(allEvidence);
        renderDashboard();
        populateAllDropdowns();

        if (currentPage === "evidence") {
          renderEvidenceList();
        }
      })
      .catch((err: unknown) => {
        console.error("Failed to load evidence.json", err);

        alert("Evidence could not be loaded. Some views may be incomplete.");
      });

    loadTimelineData()
      .then(() => {
        renderDashboard();

        if (currentPage === "timeline") {
          renderTimeline();
        }

        populateAllDropdowns();
      })
      .catch((err: unknown) => {
        console.log("timeline load error", err);
      })
      .finally(() => {
        hideLoadingStep();
      });
  });
}

// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------

function isViewName(value: string): value is ViewName {
  return (
    value === "dashboard" ||
    value === "evidence" ||
    value === "people" ||
    value === "timeline" ||
    value === "workspace"
  );
}

function handleHashChange(): void {
  const rawHash = window.location.hash.replace("#", "");

  const hash: ViewName = isViewName(rawHash) ? rawHash : "dashboard";

  setCurrentPage(hash);

  const sections = document.querySelectorAll(".view");

  for (let i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }

  const activeSection = document.getElementById("view-" + hash);

  if (activeSection) {
    activeSection.classList.add("active");
  }

  const navButtons = document.querySelectorAll(".nav-btn");

  for (let n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");

    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  if (hash === "dashboard") {
    renderDashboard();
    viewRendered.dashboard = true;
  } else if (hash === "evidence" && !viewRendered.evidence) {
    renderEvidenceList();
    viewRendered.evidence = true;
  } else if (hash === "people" && !viewRendered.people) {
    renderPeople();
    renderLocations();
    viewRendered.people = true;
  } else if (hash === "timeline" && !viewRendered.timeline) {
    renderTimeline();
    viewRendered.timeline = true;
  } else if (hash === "workspace") {
    renderWorkspace();
  }
}

// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

function populateAllDropdowns(): void {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}

// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

function setupEventListeners(): void {
  window.addEventListener("hashchange", handleHashChange);

  const navButtons = document.querySelectorAll<HTMLElement>(".nav-btn");

  for (let i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", () => {
      const targetView = navButtons[i].getAttribute("data-view");

      console.log("nav clicked:", targetView);
    });
  }

  const evidenceSearch = document.getElementById("evidenceSearch");

  if (evidenceSearch) {
    evidenceSearch.addEventListener("input", handleSearchInput);
  }

  const filterType = document.getElementById("filterType");

  if (filterType) {
    filterType.addEventListener("change", renderEvidenceList);
  }

  const filterPerson = document.getElementById("filterPerson");

  if (filterPerson) {
    filterPerson.addEventListener("change", renderEvidenceList);
  }

  const filterLocation = document.getElementById("filterLocation");

  if (filterLocation) {
    filterLocation.addEventListener("change", renderEvidenceList);
  }

  const filterStatus = document.getElementById("filterStatus");

  if (filterStatus) {
    filterStatus.addEventListener("change", renderEvidenceList);
  }

  const filterRelevance = document.getElementById("filterRelevance");

  if (filterRelevance) {
    filterRelevance.addEventListener("change", renderEvidenceList);
  }

  const clearFiltersBtn = document.getElementById("clearFiltersBtn");

  if (clearFiltersBtn) {
    clearFiltersBtn.addEventListener("click", clearFilters);
  }

  const timelineOrder = document.getElementById("timelineOrder");

  if (timelineOrder) {
    timelineOrder.addEventListener("change", renderTimeline);
  }

  const timelinePersonFilter = document.getElementById("timelinePersonFilter");

  if (timelinePersonFilter) {
    timelinePersonFilter.addEventListener("change", renderTimeline);
  }

  const timelineLocationFilter = document.getElementById(
    "timelineLocationFilter",
  );

  if (timelineLocationFilter) {
    timelineLocationFilter.addEventListener("change", renderTimeline);
  }

  const timelineTypeFilter = document.getElementById("timelineTypeFilter");

  if (timelineTypeFilter) {
    timelineTypeFilter.addEventListener("change", renderTimeline);
  }

  const hypConfidence = document.getElementById(
    "hypConfidence",
  ) as HTMLInputElement | null;

  const hypConfidenceValue = document.getElementById("hypConfidenceValue");

  if (hypConfidence && hypConfidenceValue) {
    hypConfidence.addEventListener("input", (event) => {
      const target = event.currentTarget;

      if (!(target instanceof HTMLInputElement)) {
        return;
      }

      hypConfidenceValue.textContent = target.value;
    });
  }
}

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp(): void {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(() => {
    handleHashChange();

    loadNoteAsync("E01").then((firstNote) => {
      console.log("First note preview:", firstNote);
    });
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);
const formatTest={foo:"bar",baz:[1,2,3]}
import { 
  loadCorePeopleAndLocations,
  loadEvidenceData,
  loadTimelineData
} from "./data.js";

import {
  allEvidence,
  currentPage,
  setCurrentPage,
  viewRendered
} from "./state.js";


import {
  loadBookmarksFromStorage,
  loadNotesFromStorage,
  loadNoteAsync
} from "./storage.js";

import { renderDashboard } from "./dashboard.js";

import {
  switchPeopleTab,
  renderPeople,
  renderLocations
} from "./people.js";

window.switchPeopleTab = switchPeopleTab;

import {
  populateEvidenceDropdowns,
  renderEvidenceList,
  applyStoredBookmarkFlags,
  clearFilters,
  handleSearchInput,
  setFilteredEvidence
} from "./evidence.js";

import {
  populateTimelineDropdowns,
  renderTimeline
} from "./timeline.js";

import {
  renderWorkspace,
  populateHypothesisDropdowns
} from "./workspace.js";

import {
  navigateTo
} from "./navigation.js";

window.navigateTo = navigateTo;

// ---------------------------------------------------------------------
// GLOBAL STATE
// ---------------------------------------------------------------------


var loadingStepsRemaining = 2; 


// ---------------------------------------------------------------------
// DATA LOADING
// ---------------------------------------------------------------------

function showLoadingOverlay(msg) {
  var overlay = document.getElementById("loadingOverlay");
  var text = document.getElementById("loadingText");
  if (text) text.textContent = msg;
  if (overlay) overlay.classList.remove("hidden");
}

function hideLoadingStep() {
  loadingStepsRemaining--;
  if (loadingStepsRemaining <= 0) {
    var overlay = document.getElementById("loadingOverlay");
    if (overlay) overlay.classList.add("hidden");
  }
}


function loadAllData() {
  showLoadingOverlay("Loading case file…");
  loadingStepsRemaining = 2;

  return loadCorePeopleAndLocations().then(function () {
    hideLoadingStep();
    renderDashboard();
    populateAllDropdowns();

    loadEvidenceData()
      .then(function () {
        applyStoredBookmarkFlags();
        setFilteredEvidence(allEvidence);
        renderDashboard();
        populateAllDropdowns();

        if (currentPage === "evidence") {
          renderEvidenceList();
        }
      })
      .catch(function (err) {
        console.error("Failed to load evidence.json", err);
        alert("Evidence could not be loaded. Some views may be incomplete.");
      });

    loadTimelineData()
      .then(function () {
        renderDashboard();

        if (currentPage === "timeline") {
          renderTimeline();
        }

        populateAllDropdowns();
      })
      .catch(function (err) {
        console.log("timeline load error", err);
      })
      .finally(function () {
        hideLoadingStep();
      });
  });
}



// ---------------------------------------------------------------------
// NAVIGATION / HASH ROUTING
// ---------------------------------------------------------------------


function handleHashChange() {
  var hash = window.location.hash.replace("#", "");
  var validViews = ["dashboard", "evidence", "people", "timeline", "workspace"];
  if (validViews.indexOf(hash) === -1) {
    hash = "dashboard";
  }
  setCurrentPage(hash);

  var sections = document.querySelectorAll(".view");
  for (var i = 0; i < sections.length; i++) {
    sections[i].classList.remove("active");
  }
  document.getElementById("view-" + hash).classList.add("active");

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var n = 0; n < navButtons.length; n++) {
    navButtons[n].classList.remove("active");
    if (navButtons[n].getAttribute("data-view") === hash) {
      navButtons[n].classList.add("active");
    }
  }

  if (hash === "dashboard" && !viewRendered.dashboard) {
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
    // workspace is cheap enough that it always re-renders
    renderWorkspace();
  }
}


// ---------------------------------------------------------------------
// EVIDENCE CATALOGUE
// ---------------------------------------------------------------------

function populateAllDropdowns() {
  populateEvidenceDropdowns();
  populateTimelineDropdowns();
  populateHypothesisDropdowns();
}


// ---------------------------------------------------------------------
// EVENT LISTENER SETUP
// ---------------------------------------------------------------------

function setupEventListeners() {
  window.addEventListener("hashchange", handleHashChange);

  var navButtons = document.querySelectorAll(".nav-btn");
  for (var i = 0; i < navButtons.length; i++) {
    navButtons[i].addEventListener("click", function () {
      var targetView = navButtons[i].getAttribute("data-view");
      console.log("nav clicked:", targetView);
    });
  }

  document.getElementById("evidenceSearch").addEventListener("input", handleSearchInput);

  document.getElementById("filterType").addEventListener("change", renderEvidenceList);
  document.getElementById("filterPerson").addEventListener("change", renderEvidenceList);
  document.getElementById("filterLocation").addEventListener("change", renderEvidenceList);

  document.getElementById("filterStatus").addEventListener("change", renderEvidenceList);
  document.getElementById("filterStatus").setAttribute("onchange", "renderEvidenceList()");

  document.getElementById("filterRelevance").addEventListener("change", renderEvidenceList);

  document.getElementById("clearFiltersBtn").addEventListener("click", clearFilters);

  document.getElementById("timelineOrder").addEventListener("change", renderTimeline);
  document.getElementById("timelinePersonFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineLocationFilter").addEventListener("change", renderTimeline);
  document.getElementById("timelineTypeFilter").addEventListener("change", renderTimeline);

  document.getElementById("hypConfidence").addEventListener("input", function (e) {
    document.getElementById("hypConfidenceValue").textContent = e.target.value;
  });
}

// ---------------------------------------------------------------------
// INIT
// ---------------------------------------------------------------------

function initApp() {
  loadBookmarksFromStorage();
  loadNotesFromStorage();
  setupEventListeners();

  loadAllData().then(function () {
    handleHashChange();
    var firstNote = loadNoteAsync("E01");
    console.log("First note preview:", firstNote);
  });
}

window.addEventListener("DOMContentLoaded", initApp);
window.addEventListener("hashchange", handleHashChange);

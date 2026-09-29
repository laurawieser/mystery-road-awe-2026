import {
  setAllEvidence,
  setAllPeople,
  setAllLocations,
  setAllTimeline,
  setCaseData
} from "./state.js";

import { 
  setEvidenceViewLoading 
} from "./evidence.js";

export async function loadCorePeopleAndLocations() {
  const caseRes = await fetch("data/case.json");
  const caseJson = await caseRes.json();
  setCaseData(caseJson);

  const peopleRes = await fetch("data/people.json");
  const peopleJson = await peopleRes.json();
  setAllPeople(peopleJson);

  const locationsRes = await fetch("data/locations.json");
  const locationsJson = await locationsRes.json();
  setAllLocations(locationsJson);
}

export async function loadEvidenceData() {
  const res = await fetch("data/evidence.json");
  const data = await res.json();

  setAllEvidence(data);
  setEvidenceViewLoading(false);

  return data;
}

export function loadTimelineData() {
  return fetch("data/timeline.json")
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      setAllTimeline(data);
      return data;
    });
}
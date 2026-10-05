import { allEvidence, allPeople, allLocations } from "./state.js";

import type {
  Evidence,
  EvidenceId,
  Person,
  PersonId,
  Location,
  LocationId,
} from "./types.js";

export function findEvidenceById(id: EvidenceId): Evidence | null {
  for (let i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) {
      return allEvidence[i];
    }
  }

  return null;
}

export function findPersonById(id: PersonId): Person | null {
  for (let i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) {
      return allPeople[i];
    }
  }

  return null;
}

export function findLocationById(id: LocationId): Location | null {
  for (let i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) {
      return allLocations[i];
    }
  }

  return null;
}

export function evidenceMentionsPerson(ev: Evidence, person: Person): boolean {
  return ev.personIds.includes(person.id);
}

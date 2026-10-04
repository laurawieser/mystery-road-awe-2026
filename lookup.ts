import { allEvidence, allPeople, allLocations } from "./state.js";

type EntityId = string | number;

type Evidence = {
  id: EntityId;
  personIds?: Array<string | number>;
};

type Person = {
  id: EntityId;
  name: string;
};

type Location = {
  id: EntityId;
};


export function findEvidenceById(id: EntityId): Evidence | null {
  for (let i = 0; i < allEvidence.length; i++) {
    if (allEvidence[i].id === id) return allEvidence[i];
  }
  return null;
}

export function findPersonById(id: EntityId): Person | null {
  for (let i = 0; i < allPeople.length; i++) {
    if (allPeople[i].id === id) return allPeople[i];
  }
  return null;
}

export function findLocationById(id: EntityId): Location | null {
  for (let i = 0; i < allLocations.length; i++) {
    if (allLocations[i].id === id) return allLocations[i];
  }
  return null;
}

export function evidenceMentionsPerson(ev: Evidence, person: Person,) {
  if (!ev.personIds) return false;
  return (
  ev.personIds.includes(person.id)  );
}

import { bookmarks, notesStore, setBookmarks, setNotesStore } from "./state.js";
import type { EvidenceId, NotesStore } from "./types.js";

const STORAGE_KEY_BOOKMARKS = "remotion_bookmarks";
const STORAGE_KEY_NOTES = "remotion_notes";

export function saveBookmarksToStorage(): void {
  localStorage.setItem(STORAGE_KEY_BOOKMARKS, JSON.stringify(bookmarks));
}

export function loadBookmarksFromStorage(): void {
  try {
    const raw = localStorage.getItem(STORAGE_KEY_BOOKMARKS);
    const parsed = raw ? JSON.parse(raw) : [];
    setBookmarks(Array.isArray(parsed) ? parsed : []);
  } catch (err) {
    console.warn("Could not read stored bookmarks, starting empty", err);
    setBookmarks([]);
  }
}

export function saveNoteForEvidence(
  evidenceId: EvidenceId,
  text: string,
): void {
  notesStore[evidenceId] = text;
  localStorage.setItem(STORAGE_KEY_NOTES, JSON.stringify(notesStore));
}

export function loadNoteForEvidence(evidenceId: EvidenceId): string {
  return notesStore[evidenceId] || "";
}

export function loadNotesFromStorage(): void {
  const raw = localStorage.getItem(STORAGE_KEY_NOTES);
  if (!raw) {
    setNotesStore({});
    return;
  }

  try {
    const parsed = JSON.parse(raw);
    setNotesStore(parsed);
  } catch (err) {
    console.warn("Could not read stored notes, starting empty", err);
    setNotesStore({});
  }
}

export function loadNoteAsync(evidenceId: EvidenceId): Promise<string> {
  return new Promise((resolve) => {
    resolve(notesStore[evidenceId] || "");
  });
}

import { EventData, EventsSnapshot } from "./types";

const EVENTS_KEY = "splitmate_events_v1";
const LEGACY_KEY = "splitmate_event_v1";

export function saveSnapshot(snapshot: EventsSnapshot) {
  if (typeof window === "undefined") return;
  localStorage.setItem(EVENTS_KEY, JSON.stringify(snapshot));
}

export function loadSnapshot(): EventsSnapshot | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(EVENTS_KEY);
  return raw ? (JSON.parse(raw) as EventsSnapshot) : null;
}

export function loadLegacyEvent(): EventData | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem(LEGACY_KEY);
  return raw ? (JSON.parse(raw) as EventData) : null;
}

export function clearLegacyEvent() {
  if (typeof window === "undefined") return;
  localStorage.removeItem(LEGACY_KEY);
}

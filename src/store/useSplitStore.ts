"use client";

import { create } from "zustand";
import { EventData, Participant, Expense } from "@/lib/types";
import {
  clearLegacyEvent,
  loadLegacyEvent,
  loadSnapshot,
  saveSnapshot,
} from "@/lib/storage";

function id() {
  return Math.random().toString(36).slice(2, 9);
}

function createEventData(
  title: string = "New Event",
  currency?: string,
): EventData {
  const safeTitle = title.trim() || "New Event";
  const safeCurrency = currency?.trim() || "USD";
  return {
    id: id(),
    title: safeTitle,
    currency: safeCurrency,
    participants: [],
    expenses: [],
  };
}

type State = {
  events: EventData[];
  activeEventId: string | null;
  event: EventData | null;
  loadFromStorage: () => void;
  createEvent: (title: string, currency: string) => void;
  setActiveEvent: (eventId: string) => void;
  deleteEvent: (eventId: string) => void;
  setMeta: (title: string, currency: string) => void;
  addParticipant: (name: string) => void;
  removeParticipant: (id: string) => void;
  addExpense: (input: Omit<Expense, "id" | "createdAt">) => void;
  removeExpense: (id: string) => void;
};

const initialEvent = createEventData("Trip to Hualien", "NTD");

const persist = (events: EventData[], activeEventId: string | null) => {
  saveSnapshot({ events, activeEventId });
};

const getActiveEvent = (
  events: EventData[],
  activeEventId: string | null,
): EventData | null => {
  if (events.length === 0) return null;
  const found = activeEventId
    ? events.find((event) => event.id === activeEventId) ?? null
    : null;
  return found ?? events[0] ?? null;
};

export const useSplitStore = create<State>((set, get) => ({
  events: [initialEvent],
  activeEventId: initialEvent.id,
  event: initialEvent,
  loadFromStorage: () => {
    const snapshot = loadSnapshot();
    if (snapshot && snapshot.events.length) {
      const activeEvent = getActiveEvent(
        snapshot.events,
        snapshot.activeEventId,
      );
      set({
        events: snapshot.events,
        activeEventId: activeEvent?.id ?? null,
        event: activeEvent,
      });
      return;
    }

    const legacy = loadLegacyEvent();
    if (legacy) {
      const events = [{ ...legacy }];
      persist(events, legacy.id);
      clearLegacyEvent();
      set({ events, activeEventId: legacy.id, event: legacy });
      return;
    }

    persist([initialEvent], initialEvent.id);
    set({ events: [initialEvent], activeEventId: initialEvent.id, event: initialEvent });
  },
  createEvent: (title, currency) => {
    const nextEvent = createEventData(title, currency);
    const events = [nextEvent, ...get().events];
    persist(events, nextEvent.id);
    set({ events, activeEventId: nextEvent.id, event: nextEvent });
  },
  setActiveEvent: (eventId) => {
    const events = get().events;
    const next = events.find((event) => event.id === eventId);
    if (!next) return;
    persist(events, next.id);
    set({ activeEventId: next.id, event: next });
  },
  deleteEvent: (eventId) => {
    const events = get().events.filter((event) => event.id !== eventId);
    let nextEvents = events;
    if (events.length === 0) {
      const fallback = createEventData("New Event", "USD");
      nextEvents = [fallback];
    }
    const activeEvent = getActiveEvent(
      nextEvents,
      get().activeEventId === eventId ? null : get().activeEventId,
    );
    persist(nextEvents, activeEvent?.id ?? null);
    set({
      events: nextEvents,
      activeEventId: activeEvent?.id ?? null,
      event: activeEvent,
    });
  },
  setMeta: (title, currency) => {
    const current = get().event;
    if (!current) return;
    const updated: EventData = {
      ...current,
      title,
      currency,
    };
    const events = get().events.map((event) =>
      event.id === updated.id ? updated : event,
    );
    persist(events, updated.id);
    set({ events, event: updated, activeEventId: updated.id });
  },
  addParticipant: (name) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    const current = get().event;
    if (!current) return;
    const participant: Participant = { id: id(), name: trimmed };
    const updated: EventData = {
      ...current,
      participants: [...current.participants, participant],
    };
    const events = get().events.map((event) =>
      event.id === updated.id ? updated : event,
    );
    persist(events, updated.id);
    set({ events, event: updated, activeEventId: updated.id });
  },
  removeParticipant: (participantId) => {
    const current = get().event;
    if (!current) return;
    const updated: EventData = {
      ...current,
      participants: current.participants.filter(
        (participant) => participant.id !== participantId,
      ),
      expenses: current.expenses.map((expense) => ({
        ...expense,
        splits: expense.splits.filter(
          (split) => split.participantId !== participantId,
        ),
      })),
    };
    const events = get().events.map((event) =>
      event.id === updated.id ? updated : event,
    );
    persist(events, updated.id);
    set({ events, event: updated, activeEventId: updated.id });
  },
  addExpense: (input) => {
    const current = get().event;
    if (!current) return;
    const expense: Expense = {
      ...input,
      id: id(),
      createdAt: Date.now(),
    };
    const updated: EventData = {
      ...current,
      expenses: [expense, ...current.expenses],
    };
    const events = get().events.map((event) =>
      event.id === updated.id ? updated : event,
    );
    persist(events, updated.id);
    set({ events, event: updated, activeEventId: updated.id });
  },
  removeExpense: (expenseId) => {
    const current = get().event;
    if (!current) return;
    const updated: EventData = {
      ...current,
      expenses: current.expenses.filter((expense) => expense.id !== expenseId),
    };
    const events = get().events.map((event) =>
      event.id === updated.id ? updated : event,
    );
    persist(events, updated.id);
    set({ events, event: updated, activeEventId: updated.id });
  },
}));

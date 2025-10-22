"use client";

import { FormEvent, useEffect, useState } from "react";
import { useSplitStore } from "@/store/useSplitStore";
import { CURRENCY_OPTIONS } from "@/lib/currencies";

const DEFAULT_CURRENCY = CURRENCY_OPTIONS[0]?.code ?? "USD";

export default function EventManager() {
  const events = useSplitStore((state) => state.events);
  const activeEventId = useSplitStore((state) => state.activeEventId);
  const createEvent = useSplitStore((state) => state.createEvent);
  const setActiveEvent = useSplitStore((state) => state.setActiveEvent);
  const deleteEvent = useSplitStore((state) => state.deleteEvent);
  const activeEvent = useSplitStore((state) => state.event);

  const [title, setTitle] = useState("");
  const [currency, setCurrency] = useState(DEFAULT_CURRENCY);
  const [confirmDelete, setConfirmDelete] = useState<string | null>(null);

  useEffect(() => {
    if (activeEvent && title.trim() === "") {
      const matched = CURRENCY_OPTIONS.find(
        (option) => option.code === activeEvent.currency,
      );
      setCurrency(matched?.code ?? DEFAULT_CURRENCY);
    }
  }, [activeEvent, title]);

  const handleCreate = (event: FormEvent) => {
    event.preventDefault();
    const trimmed = title.trim();
    createEvent(trimmed || "New Event", currency);
    setTitle("");
  };

  return (
    <section className="flex flex-col gap-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h2 className="text-lg font-semibold text-gray-800">Your events</h2>
        <p className="text-sm text-slate-600">
          Create a new dinner, trip, or team outing. Switch between events to keep each split
          separate.
        </p>
      </div>

      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-2 rounded-xl border border-gray-100 bg-gray-50/70 p-3 sm:flex-row sm:items-center"
      >
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Name your next event (e.g. Barcelona Trip)"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="flex gap-2 sm:w-auto">
          <select
            className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            value={currency}
            onChange={(e) => {
              const next = e.target.value;
              const matched = CURRENCY_OPTIONS.find(
                (option) => option.code === next,
              );
              setCurrency(matched?.code ?? DEFAULT_CURRENCY);
            }}
          >
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
            disabled={!title.trim()}
          >
            Create
          </button>
        </div>
      </form>

      <div className="flex flex-wrap gap-2">
        {events.map((event) => {
          const isActive = event.id === activeEventId;
          return (
            <div
              key={event.id}
              className={`flex items-center gap-2 rounded-full border px-3 py-1 text-sm shadow-sm transition ${
                isActive
                  ? "border-emerald-500 bg-emerald-500/10 text-emerald-700"
                  : "border-gray-200 bg-white text-gray-600 hover:border-emerald-400"
              }`}
            >
              <button
                type="button"
                onClick={() => setActiveEvent(event.id)}
                className="flex items-center gap-2"
              >
                <span className="font-medium">{event.title}</span>
                <span className="text-xs text-gray-400">
                  {event.participants.length} people · {event.expenses.length} expenses
                </span>
              </button>
              <button
                type="button"
                className="rounded-full bg-transparent px-2 text-gray-400 transition hover:text-rose-500"
                onClick={() => {
                  if (confirmDelete === event.id) {
                    deleteEvent(event.id);
                    setConfirmDelete(null);
                    return;
                  }
                  setConfirmDelete(event.id);
                }}
                aria-label={`Delete ${event.title}`}
                disabled={events.length <= 1}
              >
                {confirmDelete === event.id ? "Confirm?" : "×"}
              </button>
            </div>
          );
        })}
      </div>

      {events.length === 0 && (
        <p className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          You have no events yet. Use the form above to create your first split.
        </p>
      )}
    </section>
  );
}

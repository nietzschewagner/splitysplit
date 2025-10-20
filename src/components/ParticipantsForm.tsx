"use client";

import { useState } from "react";
import { useSplitStore } from "@/store/useSplitStore";

export default function ParticipantsForm() {
  const event = useSplitStore((state) => state.event);
  const addParticipant = useSplitStore((state) => state.addParticipant);
  const removeParticipant = useSplitStore((state) => state.removeParticipant);
  const [name, setName] = useState("");

  if (!event) return null;

  return (
    <div className="space-y-4 rounded-2xl border border-dashed border-gray-200 bg-white/80 p-4 shadow-sm">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <input
          className="flex-1 rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Add participant, e.g. Aadil"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(event) => {
            if (event.key === "Enter" && name.trim()) {
              event.preventDefault();
              addParticipant(name);
              setName("");
            }
          }}
        />
        <button
          className="rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60"
          disabled={!name.trim()}
          onClick={() => {
            if (name.trim()) {
              addParticipant(name);
              setName("");
            }
          }}
        >
          Add
        </button>
      </div>

      {event.participants.length === 0 ? (
        <p className="rounded-lg border border-gray-100 bg-gray-50 px-3 py-2 text-sm text-slate-600">
          No participants yet. Add everyone joining so expenses can be split correctly.
        </p>
      ) : (
        <ul className="flex flex-wrap gap-2">
          {event.participants.map((participant) => (
            <li
              key={participant.id}
              className="group flex items-center gap-2 rounded-full border border-gray-200 bg-white px-3 py-1 text-sm shadow-sm"
            >
              <span className="font-medium text-gray-700">{participant.name}</span>
              <button
                className="text-gray-400 transition group-hover:text-red-500"
                onClick={() => removeParticipant(participant.id)}
                aria-label={`Remove ${participant.name}`}
              >
                ×
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

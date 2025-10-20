"use client";

import { useEffect } from "react";
import EventHeader from "@/components/EventHeader";
import ParticipantsForm from "@/components/ParticipantsForm";
import ExpenseForm from "@/components/ExpenseForm";
import ExpensesTable from "@/components/ExpensesTable";
import SettlementTable from "@/components/SettlementTable";
import ShareBar from "@/components/ShareBar";
import StatsBar from "@/components/StatsBar";
import EventManager from "@/components/EventManager";
import { useSplitStore } from "@/store/useSplitStore";
import { EventData } from "@/lib/types";
import { decompressFromEncodedURIComponent } from "lz-string";

export default function Page() {
  const { loadFromStorage } = useSplitStore();

  useEffect(() => {
    if (typeof window === "undefined") return;

    const params = new URLSearchParams(window.location.search);
    const encoded = params.get("s");
    if (encoded) {
      try {
        const raw = decompressFromEncodedURIComponent(
          decodeURIComponent(encoded),
        );
        if (raw) {
          const parsed = JSON.parse(raw) as EventData;
          window.localStorage.setItem(
            "splitmate_event_v1",
            JSON.stringify(parsed),
          );
        }
      } catch {
        // ignore malformed share strings
      }
    }

    loadFromStorage();
  }, [loadFromStorage]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-8 p-4 pb-12 sm:p-8">
      <EventManager />
      <EventHeader />
      <StatsBar />

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Participants</h2>
          <p className="text-sm text-slate-600">
            Add everyone who should be part of the split. You can remove or rename them
            anytime.
          </p>
        </div>
        <ParticipantsForm />
      </section>

      <section className="space-y-4">
        <div>
          <h2 className="text-lg font-semibold text-gray-800">Add an expense</h2>
          <p className="text-sm text-slate-600">
            Splitysplit supports equal splits, percentage-based, and custom amounts. We handle
            the math so you do not have to.
          </p>
        </div>
        <ExpenseForm />
        <ExpensesTable />
      </section>

      <SettlementTable />
      <ShareBar />

      <footer className="text-center text-xs text-gray-400">
        Built with Next.js · Data saved in your browser · Deploy on Vercel or Netlify
      </footer>
    </main>
  );
}

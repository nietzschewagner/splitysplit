"use client";

import { useMemo } from "react";
import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { useSplitStore } from "@/store/useSplitStore";

export default function StatsBar() {
  const event = useSplitStore((state) => state.event);

  const {
    totalSpent,
    perPerson,
    lastExpense,
    participantCount,
    expenseCount,
  } = useMemo(() => {
    if (!event) {
      return {
        totalSpent: 0,
        perPerson: 0,
        lastExpense: null,
        participantCount: 0,
        expenseCount: 0,
      };
    }
    const total = event.expenses.reduce((acc, expense) => acc + expense.amount, 0);
    const perMember =
      event.participants.length > 0 ? total / event.participants.length : 0;
    const latest = event.expenses[0]?.createdAt ?? null;

    return {
      totalSpent: total,
      perPerson: perMember,
      lastExpense: latest,
      participantCount: event.participants.length,
      expenseCount: event.expenses.length,
    };
  }, [event]);

  if (!event) {
    return null;
  }

  return (
    <section className="grid gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-sm sm:grid-cols-2 md:grid-cols-4">
      <StatCard
        label="Total logged"
        value={formatCurrency(totalSpent, event.currency)}
        hint={`${expenseCount} ${expenseCount === 1 ? "expense" : "expenses"}`}
      />
      <StatCard
        label="Per person"
        value={
          participantCount === 0
            ? formatCurrency(0, event.currency)
            : formatCurrency(perPerson, event.currency)
        }
        hint={
          participantCount === 0
            ? "Add participants to distribute cost"
            : `${participantCount} participant${participantCount === 1 ? "" : "s"}`
        }
      />
      <StatCard
        label="Last update"
        value={lastExpense ? formatRelativeTime(lastExpense) : "No expenses yet"}
        hint={lastExpense ? "Most recent expense" : "Start logging to see activity"}
      />
      <StatCard
        label="Currency"
        value={event.currency}
        hint="Change in event settings"
      />
    </section>
  );
}

function StatCard({
  label,
  value,
  hint,
}: {
  label: string;
  value: string;
  hint: string;
}) {
  return (
    <div className="flex flex-col gap-1 rounded-lg border border-gray-100 bg-gray-50/70 p-3">
      <span className="text-xs font-medium uppercase tracking-wide text-slate-600">
        {label}
      </span>
      <span className="text-lg font-semibold text-gray-800">{value}</span>
      <span className="text-xs text-slate-600">{hint}</span>
    </div>
  );
}

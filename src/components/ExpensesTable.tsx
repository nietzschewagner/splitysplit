"use client";

import { formatCurrency, formatRelativeTime } from "@/lib/utils";
import { useSplitStore } from "@/store/useSplitStore";

export default function ExpensesTable() {
  const event = useSplitStore((state) => state.event);
  const removeExpense = useSplitStore((state) => state.removeExpense);

  if (!event) {
    return null;
  }

  if (event.expenses.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-gray-200 bg-white/40 p-6 text-sm text-slate-600">
        No expenses yet. Once you start logging them, they will show up here with
        who paid and when.
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <h3 className="text-lg font-semibold text-gray-800">Expense history</h3>
      <ul className="space-y-3">
        {event.expenses.map((expense) => {
          const payer =
            event.participants.find((p) => p.id === expense.payerId)?.name ??
            "Unknown";
          return (
            <li
              key={expense.id}
              className="flex flex-col gap-2 rounded-2xl border border-gray-200 bg-white px-4 py-3 shadow-sm sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  {expense.description}
                </p>
                <p className="text-xs text-slate-600">
                  Paid by {payer} • {formatRelativeTime(expense.createdAt)}
                </p>
              </div>
              <div className="flex items-center gap-4 sm:gap-6">
                <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-medium text-emerald-700">
                  {formatCurrency(expense.amount, event.currency)}
                </span>
                <button
                  className="text-sm font-medium text-rose-600 transition hover:text-rose-500"
                  onClick={() => removeExpense(expense.id)}
                >
                  Delete
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

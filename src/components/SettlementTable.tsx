"use client";

import { computeBalances, simplify } from "@/lib/settlement";
import { formatCurrency } from "@/lib/utils";
import { useSplitStore } from "@/store/useSplitStore";

export default function SettlementTable() {
  const event = useSplitStore((state) => state.event);

  if (!event) return null;

  const balances = computeBalances(event);
  const transfers = simplify(balances);

  const nameFor = (id: string) =>
    event.participants.find((participant) => participant.id === id)?.name ??
    "Unknown";

  return (
    <section className="space-y-3 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-gray-800">Who owes whom</h3>
        <p className="text-sm text-slate-600">
          We simplify debts so everyone makes the fewest number of transfers possible.
        </p>
      </div>

      {transfers.length === 0 ? (
        <div className="rounded-xl border border-emerald-200 bg-emerald-50/80 px-3 py-3 text-sm text-emerald-700">
          All settled 🎉 Everyone is even.
        </div>
      ) : (
        <ul className="space-y-3">
          {transfers.map((transfer, index) => (
            <li
              key={`${transfer.fromId}-${transfer.toId}-${index}`}
              className="flex items-center justify-between gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm shadow-sm"
            >
              <span className="font-medium text-gray-700">
                {nameFor(transfer.fromId)}
                <span className="mx-2 text-gray-400">→</span>
                {nameFor(transfer.toId)}
              </span>
              <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-sm font-semibold text-emerald-700">
                {formatCurrency(transfer.amount, event.currency)}
              </span>
            </li>
          ))}
        </ul>
      )}

      {balances.length > 0 && (
        <div className="rounded-xl border border-gray-100 bg-gray-50/60 p-4">
          <h4 className="text-xs font-semibold uppercase tracking-wide text-slate-600">
            Net balances
          </h4>
          <ul className="mt-2 grid gap-2 sm:grid-cols-2">
            {balances.map((balance) => {
              const positive = balance.amount > 0;
              return (
                <li
                  key={balance.participantId}
                  className="flex items-center justify-between rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                >
                  <span className="font-medium text-gray-700">
                    {nameFor(balance.participantId)}
                  </span>
                  <span
                    className={
                      positive ? "text-emerald-600 font-semibold" : "text-rose-600 font-semibold"
                    }
                  >
                    {positive ? "+" : ""}
                    {formatCurrency(balance.amount, event.currency)}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      )}
    </section>
  );
}

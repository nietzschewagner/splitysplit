"use client";

import { CURRENCY_OPTIONS } from "@/lib/currencies";
import { useSplitStore } from "@/store/useSplitStore";

export default function EventHeader() {
  const event = useSplitStore((state) => state.event);
  const setMeta = useSplitStore((state) => state.setMeta);

  if (!event) return null;

  const hasCurrentCurrency = CURRENCY_OPTIONS.some(
    (option) => option.code === event.currency,
  );

  return (
    <div className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white via-slate-50 to-emerald-50 p-6 shadow-sm">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-medium text-emerald-700">
              Splitysplit
            </span>
            <span className="text-xs text-slate-600">
              Keep tabs on every shared expense
            </span>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-600" htmlFor="event-title">
              Event name
            </label>
            <input
              id="event-title"
              className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-lg font-semibold text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
              value={event.title}
              onChange={(e) => setMeta(e.target.value, event.currency)}
              placeholder="Team retreat, dinner club, city trip..."
            />
          </div>
        </div>

        <div className="w-full max-w-[240px]">
          <label className="text-sm font-medium text-gray-600" htmlFor="event-currency">
            Currency
          </label>
          <select
            id="event-currency"
            className="mt-1 w-full rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
            value={event.currency}
            onChange={(e) => setMeta(event.title, e.target.value)}
          >
            {!hasCurrentCurrency && (
              <option value={event.currency}>{event.currency}</option>
            )}
            {CURRENCY_OPTIONS.map((option) => (
              <option key={option.code} value={option.code}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-sm text-slate-600">
        Add everyone on the trip, log expenses as they happen, and Splitysplit will
        keep the balances tidy for you.
      </p>
    </div>
  );
}

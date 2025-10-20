"use client";

import { useEffect, useMemo, useState } from "react";
import { useSplitStore } from "@/store/useSplitStore";
import { ExpenseSplit, SplitMethod } from "@/lib/types";

export default function ExpenseForm() {
  const event = useSplitStore((state) => state.event);
  const addExpense = useSplitStore((state) => state.addExpense);
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState<string>("");
  const [payerId, setPayerId] = useState<string>("");
  const [method, setMethod] = useState<SplitMethod>("equal");
  const [splits, setSplits] = useState<ExpenseSplit[]>([]);
  const [hasInteracted, setHasInteracted] = useState(false);

  const participants = event?.participants ?? [];
  const total = Number(amount) || 0;

  const percentTotal = useMemo(
    () =>
      method === "percent"
        ? splits.reduce((acc, split) => acc + (split.percent ?? 0), 0)
        : 0,
    [method, splits],
  );
  const customTotal = useMemo(
    () =>
      method === "custom"
        ? splits.reduce((acc, split) => acc + (split.amount ?? 0), 0)
        : 0,
    [method, splits],
  );

  const readyCommon =
    description.trim().length > 0 &&
    total > 0 &&
    payerId !== "" &&
    participants.length > 0;
  const readyPercent =
    method !== "percent" ||
    (percentTotal > 0 && Math.abs(percentTotal - 100) < 0.5);
  const readyCustom =
    method !== "custom" ||
    (customTotal > 0 && Math.abs(customTotal - total) < 0.5);

  const isSubmitDisabled = !(readyCommon && readyPercent && readyCustom);

  useEffect(() => {
    const currentParticipants = event?.participants ?? [];
    if (method === "equal") {
      setSplits([]);
      return;
    }
    setSplits((prev) =>
      currentParticipants.map((participant) => {
        const existing = prev.find(
          (split) => split.participantId === participant.id,
        );
        if (method === "percent") {
          return {
            participantId: participant.id,
            percent:
              existing?.percent ??
              Math.round(100 / Math.max(currentParticipants.length, 1)),
          };
        }
        return {
          participantId: participant.id,
          amount:
            existing?.amount ??
            (total > 0
              ? Number((total / Math.max(currentParticipants.length, 1)).toFixed(2))
              : undefined),
        };
      }),
    );
  }, [event, method, total]);

  const hydrateSplits = () => {
    if (splits.length === participants.length) return splits;
    return participants.map((participant) => {
      const existing = splits.find(
        (split) => split.participantId === participant.id,
      );
      return {
        participantId: participant.id,
        amount: existing?.amount,
        percent: existing?.percent,
      };
    });
  };

  if (!event) {
    return (
      <div className="rounded-2xl border border-gray-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
        Select or create an event to start logging expenses.
      </div>
    );
  }

  return (
    <div className="space-y-4 rounded-2xl border border-gray-200 bg-white p-6 shadow-sm">
      <div className="flex flex-col gap-1">
        <h3 className="text-lg font-semibold text-gray-800">Log an expense</h3>
        <p className="text-sm text-slate-600">
          Track what was paid, who covered it, and how you want to split it.
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <input
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          placeholder="Description (e.g. Dinner)"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          onBlur={() => setHasInteracted(true)}
        />
        <input
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          type="number"
          step="0.01"
          placeholder="Amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          onBlur={() => setHasInteracted(true)}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={payerId}
          onChange={(e) => setPayerId(e.target.value)}
        >
          <option value="">Select payer</option>
          {participants.map((participant) => (
            <option key={participant.id} value={participant.id}>
              {participant.name}
            </option>
          ))}
        </select>

        <select
          className="rounded-lg border border-gray-200 px-3 py-2 text-sm text-slate-900 shadow-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-200"
          value={method}
          onChange={(e) => {
            setMethod(e.target.value as SplitMethod);
            setSplits(hydrateSplits());
          }}
        >
          <option value="equal">Split equally</option>
          <option value="percent">Split by percent</option>
          <option value="custom">Split by amount</option>
        </select>
      </div>

      {method !== "equal" && (
        <div className="space-y-2 rounded-lg border border-gray-100 bg-gray-50 p-4">
          <div className="flex items-center justify-between text-xs text-slate-600">
            <span>
              {method === "percent"
                ? `Share split total: ${percentTotal.toFixed(1)}%`
                : `Assigned total: ${customTotal.toFixed(2)} / ${total.toFixed(2)}`}
            </span>
            {method === "percent" && (
              <span
                className={
                  Math.abs(percentTotal - 100) < 0.5
                    ? "text-emerald-600"
                    : "text-amber-600"
                }
              >
                {Math.abs(percentTotal - 100) < 0.5
                  ? "Ready to go"
                  : `${(percentTotal - 100).toFixed(1)}% remaining`}
              </span>
            )}
            {method === "custom" && total > 0 && (
              <span
                className={
                  Math.abs(customTotal - total) < 0.5
                    ? "text-emerald-600"
                    : "text-amber-600"
                }
              >
                {Math.abs(customTotal - total) < 0.5
                  ? "Ready to go"
                  : `${(total - customTotal).toFixed(2)} left to assign`}
              </span>
            )}
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            {participants.map((participant) => {
              const current = splits.find(
                (split) => split.participantId === participant.id,
              );
              return (
                <div
                  key={participant.id}
                  className="flex items-center justify-between gap-2 rounded-lg bg-white px-3 py-2 text-sm shadow-sm"
                >
                  <span className="font-medium text-gray-700">
                    {participant.name}
                  </span>
                  {method === "percent" ? (
                    <input
                      className="w-24 rounded border border-gray-200 px-2 py-1 text-right text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                      type="number"
                      step="1"
                      placeholder="%"
                      value={current?.percent ?? ""}
                      onChange={(e) => {
                        const value = Number(e.target.value || 0);
                        const hydrated = hydrateSplits();
                        setSplits(
                          hydrated.map((split) =>
                            split.participantId === participant.id
                              ? {
                                  participantId: participant.id,
                                  percent: value,
                                }
                              : split,
                          ),
                        );
                      }}
                    />
                  ) : (
                    <input
                      className="w-24 rounded border border-gray-200 px-2 py-1 text-right text-slate-900 shadow-sm placeholder:text-slate-400 focus:border-emerald-500 focus:outline-none focus:ring-1 focus:ring-emerald-200"
                      type="number"
                      step="0.01"
                      placeholder="Amount"
                      value={current?.amount ?? ""}
                      onChange={(e) => {
                        const value = Number(e.target.value || 0);
                        const hydrated = hydrateSplits();
                        setSplits(
                          hydrated.map((split) =>
                            split.participantId === participant.id
                              ? {
                                  participantId: participant.id,
                                  amount: value,
                                }
                              : split,
                          ),
                        );
                      }}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {hasInteracted && !readyCommon && (
        <p className="text-sm text-amber-600">
          Double-check the description, amount, payer, and participants before
          submitting.
        </p>
      )}
      {method === "percent" && readyCommon && !readyPercent && (
        <p className="text-sm text-amber-600">
          Percentages should total 100% (currently{" "}
          {percentTotal.toFixed(1)}
          %).
        </p>
      )}
      {method === "custom" && readyCommon && !readyCustom && (
        <p className="text-sm text-amber-600">
          Assigned amounts should match the total ({customTotal.toFixed(2)} of{" "}
          {total.toFixed(2)}).
        </p>
      )}

      <button
        className="w-full rounded-lg bg-emerald-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition hover:bg-emerald-400 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
        disabled={isSubmitDisabled}
        onClick={() => {
          const splitPayload =
            method === "equal"
              ? participants.map((participant) => ({
                  participantId: participant.id,
                }))
              : splits.length
                ? splits
                : participants.map((participant) => ({
                    participantId: participant.id,
                  }));

          addExpense({
            description,
            amount: total,
            payerId,
            splitMethod: method,
            splits: splitPayload,
          });
          setDescription("");
          setAmount("");
          setPayerId("");
          setMethod("equal");
          setSplits([]);
          setHasInteracted(false);
        }}
      >
        Add Expense
      </button>
    </div>
  );
}

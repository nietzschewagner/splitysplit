import { Expense, EventData } from "./types";

export type Balance = { participantId: string; amount: number }; // +ve = is owed; -ve = owes
export type Transfer = { fromId: string; toId: string; amount: number };

const EPS = 0.005; // round to cents (or NTD dollars if you prefer)

function round2(n: number) {
  return Math.round((n + 1e-9) * 100) / 100;
}

export function computeBalances(event: EventData): Balance[] {
  const map: Record<string, number> = {};
  event.participants.forEach((p) => (map[p.id] = 0));

  event.expenses.forEach((e: Expense) => {
    // Payer fronted the total:
    map[e.payerId] += e.amount;

    // Compute each participant's share
    if (e.splitMethod === "equal") {
      const share = e.amount / e.splits.length;
      e.splits.forEach((s) => (map[s.participantId] -= share));
    } else if (e.splitMethod === "percent") {
      let totalPercent = e.splits.reduce((a, b) => a + (b.percent ?? 0), 0);
      if (totalPercent === 0) totalPercent = 100;
      e.splits.forEach((s) => {
        const share = e.amount * ((s.percent ?? 0) / totalPercent);
        map[s.participantId] -= share;
      });
    } else {
      // custom amounts
      const sum = e.splits.reduce((a, b) => a + (b.amount ?? 0), 0);
      const factor = sum === 0 ? 1 : e.amount / sum;
      e.splits.forEach((s) => {
        const share = (s.amount ?? 0) * factor;
        map[s.participantId] -= share;
      });
    }
  });

  return Object.entries(map)
    .map(([participantId, amount]) => ({
      participantId,
      amount: round2(amount),
    }))
    .filter((b) => Math.abs(b.amount) > EPS);
}

/** Greedy settle: match the biggest debtor to the biggest creditor, repeat */
export function simplify(balances: Balance[]): Transfer[] {
  const debtors = balances.filter((b) => b.amount < -EPS).map((b) => ({ ...b }));
  const creditors = balances.filter((b) => b.amount > EPS).map((b) => ({ ...b }));

  debtors.sort((a, b) => a.amount - b.amount); // most negative first
  creditors.sort((a, b) => b.amount - a.amount); // most positive first

  const transfers: Transfer[] = [];
  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const owe = -debtors[i].amount; // positive
    const get = creditors[j].amount; // positive
    const pay = round2(Math.min(owe, get));

    if (pay > EPS) {
      transfers.push({
        fromId: debtors[i].participantId,
        toId: creditors[j].participantId,
        amount: pay,
      });
      debtors[i].amount += pay; // less negative
      creditors[j].amount -= pay; // less positive
    }
    if (Math.abs(debtors[i].amount) <= EPS) i++;
    if (Math.abs(creditors[j].amount) <= EPS) j++;
  }
  return transfers;
}

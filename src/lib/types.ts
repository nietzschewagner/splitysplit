export type Participant = { id: string; name: string };
export type SplitMethod = "equal" | "percent" | "custom";

export type ExpenseSplit = {
  participantId: string;
  amount?: number; // used when method = "custom"
  percent?: number; // used when method = "percent"
};

export type Expense = {
  id: string;
  description: string;
  amount: number; // total
  payerId: string;
  splitMethod: SplitMethod;
  splits: ExpenseSplit[];
  createdAt: number;
};

export type EventData = {
  id: string;
  title: string;
  currency: string; // e.g. "USD" or "NTD"
  participants: Participant[];
  expenses: Expense[];
};

export type EventsSnapshot = {
  events: EventData[];
  activeEventId: string | null;
};

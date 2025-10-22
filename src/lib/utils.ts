import { currencyIsoMap } from "@/lib/currencies";

export function formatCurrency(amount: number, currency: string): string {
  const iso = currencyIsoMap[currency] ?? currency;
  try {
    return new Intl.NumberFormat(undefined, {
      style: "currency",
      currency: iso,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function formatRelativeTime(timestamp: number | null | undefined): string {
  if (!timestamp) return "—";
  const diff = Date.now() - timestamp;
  const formatter = new Intl.RelativeTimeFormat(undefined, { numeric: "auto" });

  const minute = 60 * 1000;
  const hour = 60 * minute;
  const day = 24 * hour;

  if (diff < minute) {
    return formatter.format(-Math.round(diff / 1000), "seconds");
  }
  if (diff < hour) {
    return formatter.format(-Math.round(diff / minute), "minutes");
  }
  if (diff < day) {
    return formatter.format(-Math.round(diff / hour), "hours");
  }
  return formatter.format(-Math.round(diff / day), "days");
}

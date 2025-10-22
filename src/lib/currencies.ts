export type CurrencyOption = {
  code: string;
  label: string;
  isoCode?: string;
};

export const CURRENCY_OPTIONS: CurrencyOption[] = [
  { code: "USD", label: "US Dollar (USD)" },
  { code: "EUR", label: "Euro (EUR)" },
  { code: "GBP", label: "British Pound (GBP)" },
  { code: "AUD", label: "Australian Dollar (AUD)" },
  { code: "CAD", label: "Canadian Dollar (CAD)" },
  { code: "JPY", label: "Japanese Yen (JPY)" },
  { code: "CNY", label: "Chinese Yuan (CNY)" },
  { code: "HKD", label: "Hong Kong Dollar (HKD)" },
  { code: "SGD", label: "Singapore Dollar (SGD)" },
  { code: "CHF", label: "Swiss Franc (CHF)" },
  { code: "INR", label: "Indian Rupee (INR)" },
  { code: "KRW", label: "South Korean Won (KRW)" },
  { code: "NZD", label: "New Zealand Dollar (NZD)" },
  { code: "SEK", label: "Swedish Krona (SEK)" },
  { code: "NOK", label: "Norwegian Krone (NOK)" },
  { code: "DKK", label: "Danish Krone (DKK)" },
  { code: "PLN", label: "Polish Zloty (PLN)" },
  { code: "BRL", label: "Brazilian Real (BRL)" },
  { code: "MXN", label: "Mexican Peso (MXN)" },
  { code: "ZAR", label: "South African Rand (ZAR)" },
  { code: "AED", label: "UAE Dirham (AED)" },
  { code: "SAR", label: "Saudi Riyal (SAR)" },
  { code: "PHP", label: "Philippine Peso (PHP)" },
  { code: "THB", label: "Thai Baht (THB)" },
  { code: "NTD", label: "New Taiwan Dollar (NTD)", isoCode: "TWD" },
  { code: "IDR", label: "Indonesian Rupiah (IDR)" },
  { code: "MYR", label: "Malaysian Ringgit (MYR)" },
  { code: "ILS", label: "Israeli New Shekel (ILS)" },
  { code: "TRY", label: "Turkish Lira (TRY)" },
  { code: "ARS", label: "Argentine Peso (ARS)" },
  { code: "CLP", label: "Chilean Peso (CLP)" },
  { code: "COP", label: "Colombian Peso (COP)" },
];

export const currencyIsoMap: Record<string, string> = CURRENCY_OPTIONS.reduce(
  (acc, option) => {
    acc[option.code] = option.isoCode ?? option.code;
    return acc;
  },
  {} as Record<string, string>,
);

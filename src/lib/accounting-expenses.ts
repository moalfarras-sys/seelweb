export const EXPENSE_CATEGORY_OPTIONS = [
  { value: "fuel", label: "Tanken / Diesel / Benzin" },
  { value: "vehicle", label: "Fahrzeug & Wartung" },
  { value: "material", label: "Material & Reinigung" },
  { value: "office", label: "Büro & Verwaltung" },
  { value: "equipment", label: "Werkzeuge & Geräte" },
  { value: "rent", label: "Miete & Lager" },
  { value: "insurance", label: "Versicherung" },
  { value: "marketing", label: "Marketing" },
  { value: "contract", label: "Verträge & Fremdleistungen" },
  { value: "payroll", label: "Personal" },
  { value: "other", label: "Sonstiges" },
] as const;

export const EXPENSE_DOCUMENT_TYPE_OPTIONS = [
  { value: "RECHNUNG", label: "Rechnung" },
  { value: "KASSENBON", label: "Kassenbon" },
  { value: "TANKBELEG", label: "Tankbeleg" },
  { value: "VERTRAG", label: "Vertrag" },
  { value: "BESTELLUNG", label: "Bestellung" },
  { value: "SONSTIGES", label: "Sonstiges" },
] as const;

export const EXPENSE_PAYMENT_METHOD_OPTIONS = [
  { value: "BANK_TRANSFER", label: "Überweisung" },
  { value: "CARD", label: "Karte" },
  { value: "CASH", label: "Bar" },
  { value: "SEPA", label: "SEPA / Lastschrift" },
  { value: "OTHER", label: "Sonstiges" },
] as const;

export const EXPENSE_PAYMENT_STATUS_OPTIONS = [
  { value: "OPEN", label: "Offen" },
  { value: "PAID", label: "Bezahlt" },
  { value: "SUBMITTED", label: "An Buchhaltung übergeben" },
] as const;

export function getExpenseCategoryLabel(value?: string | null) {
  return EXPENSE_CATEGORY_OPTIONS.find((option) => option.value === value)?.label || value || "Ohne Kategorie";
}

export function getExpenseDocumentTypeLabel(value?: string | null) {
  return EXPENSE_DOCUMENT_TYPE_OPTIONS.find((option) => option.value === value)?.label || value || "Beleg";
}

export function getExpensePaymentMethodLabel(value?: string | null) {
  return EXPENSE_PAYMENT_METHOD_OPTIONS.find((option) => option.value === value)?.label || value || "Nicht angegeben";
}

export function getExpensePaymentStatusLabel(value?: string | null) {
  return EXPENSE_PAYMENT_STATUS_OPTIONS.find((option) => option.value === value)?.label || value || "Unbekannt";
}

export function sanitizeFloat(value: unknown, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? Number(parsed.toFixed(2)) : fallback;
}

export function calculateExpenseAmounts(input: {
  grossAmount?: unknown;
  netAmount?: unknown;
  taxAmount?: unknown;
  taxRate?: unknown;
}) {
  const grossAmount = sanitizeFloat(input.grossAmount);
  const netAmount = sanitizeFloat(input.netAmount);
  const taxAmount = sanitizeFloat(input.taxAmount);
  const taxRate = sanitizeFloat(input.taxRate, 19);

  if (grossAmount > 0 && netAmount <= 0 && taxAmount <= 0) {
    const derivedNet = sanitizeFloat(grossAmount / (1 + taxRate / 100));
    return {
      amount: grossAmount,
      netAmount: derivedNet,
      taxAmount: sanitizeFloat(grossAmount - derivedNet),
      taxRate,
    };
  }

  if (grossAmount <= 0 && netAmount > 0) {
    const derivedTax = taxAmount > 0 ? taxAmount : sanitizeFloat(netAmount * (taxRate / 100));
    return {
      amount: sanitizeFloat(netAmount + derivedTax),
      netAmount,
      taxAmount: derivedTax,
      taxRate,
    };
  }

  if (grossAmount > 0 && netAmount > 0 && taxAmount <= 0) {
    return {
      amount: grossAmount,
      netAmount,
      taxAmount: sanitizeFloat(grossAmount - netAmount),
      taxRate,
    };
  }

  return {
    amount: grossAmount,
    netAmount,
    taxAmount,
    taxRate,
  };
}

export function getQuarterKey(dateLike?: string | Date | null) {
  if (!dateLike) return "";
  const date = typeof dateLike === "string" ? new Date(dateLike) : dateLike;
  if (Number.isNaN(date.getTime())) return "";
  const quarter = Math.floor(date.getMonth() / 3) + 1;
  return `Q${quarter}/${date.getFullYear()}`;
}

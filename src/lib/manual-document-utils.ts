export type ManualDocumentItem = {
  id?: string;
  title: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  totalPrice?: number;
};

function round(value: number) {
  return Number(value.toFixed(2));
}

export function normalizeManualItems(items: ManualDocumentItem[]) {
  return items.map((item, index) => {
    const quantity = Number(item.quantity || 0);
    const unitPrice = Number(item.unitPrice || 0);
    const totalPrice = item.totalPrice !== undefined ? Number(item.totalPrice) : quantity * unitPrice;

    return {
      id: item.id || `item-${index + 1}`,
      title: String(item.title || "Position"),
      description: item.description ? String(item.description) : null,
      quantity,
      unitPrice,
      totalPrice: round(totalPrice),
    };
  });
}

export function calculateManualDocumentTotals(items: ManualDocumentItem[], taxRate = 19) {
  const normalizedItems = normalizeManualItems(items);
  const subtotal = round(normalizedItems.reduce((sum, item) => sum + item.totalPrice, 0));
  const rate = Number.isFinite(taxRate) ? Number(taxRate) : 19;
  const taxAmount = round(subtotal * (rate / 100));
  const totalAmount = round(subtotal + taxAmount);

  return { items: normalizedItems, subtotal, taxRate: rate, taxAmount, totalAmount };
}

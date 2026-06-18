export function generateInvoice(stats, feeStructure) {
  let remaining = stats.paymentsReceived;
  let total = 0;

  const tier1 = Math.min(remaining, feeStructure.tier1.limit);
  total += tier1 * feeStructure.tier1.rate;
  remaining -= tier1;

  const tier2 = Math.min(remaining, feeStructure.tier2.limit);
  total += tier2 * feeStructure.tier2.rate;
  remaining -= tier2;

  total += remaining * feeStructure.tier3.rate;

  const accountingFee = feeStructure.accountingFee.amount * (1 - feeStructure.accountingFee.discount);
  total += accountingFee;

  const vat = total * 0.15;
  const grandTotal = total + vat;

  return {
    items: [
      { label: "Tier 1", amount: tier1 * feeStructure.tier1.rate },
      { label: "Tier 2", amount: tier2 * feeStructure.tier2.rate },
      { label: "Tier 3", amount: remaining * feeStructure.tier3.rate },
      { label: "Accounting Fee", amount: accountingFee }
    ],
    vat,
    total: grandTotal
  };
}
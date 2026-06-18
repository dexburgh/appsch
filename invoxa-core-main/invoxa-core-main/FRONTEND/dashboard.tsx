import { generateInvoice } from '../lib/invoiceEngine';
import clients from '../data/clients.json';
import stats from '../data/stats.json';

export default function Dashboard() {
  const clientId = "CL001";
  const invoice = generateInvoice(stats[clientId], clients[clientId].feeStructure);

  return (
    <div className="p-6">
      <h1 className="text-xl font-bold">Invoice Preview</h1>
      <ul className="mt-4">
        {invoice.items.map((item, idx) => (
          <li key={idx}>{item.label}: R{item.amount.toFixed(2)}</li>
        ))}
      </ul>
      <p className="mt-4">VAT: R{invoice.vat.toFixed(2)}</p>
      <p className="font-bold">Total: R{invoice.total.toFixed(2)}</p>
    </div>
  );
}
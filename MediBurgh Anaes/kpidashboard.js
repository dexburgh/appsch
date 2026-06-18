const KPIs = [
  { label: 'Revenue Cycle Time', value: '28 days', trend: '↓ 2 days', color: 'blue' },
  { label: 'Denial Rate', value: '4.2%', trend: '↑ 0.3%', color: 'red' },
  { label: 'First Pass Rate', value: '91%', trend: '↑ 1%', color: 'green' },
  { label: 'Net Collection Rate', value: '96.5%', trend: '↑ 0.5%', color: 'green' },
  { label: 'Clean Claim %', value: '98.2%', trend: '→', color: 'gray' },
];

const KPIDashboard = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 p-4">
    {KPIs.map((kpi, idx) => (
      <div key={idx} className={`bg-white p-4 rounded shadow border-l-4 border-${kpi.color}-500`}>
        <h4 className="text-lg font-semibold">{kpi.label}</h4>
        <p className="text-2xl font-bold">{kpi.value}</p>
        <p className="text-sm text-gray-600">Trend: {kpi.trend}</p>
      </div>
    ))}
  </div>
);
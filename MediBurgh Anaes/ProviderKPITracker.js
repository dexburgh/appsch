const ProviderKPITracker = ({ providers }) => (
  <div className="space-y-4">
    {providers.map((p) => (
      <div key={p.providerId} className="bg-white p-4 rounded shadow">
        <h4 className="font-bold">{p.name}</h4>
        <p className="text-sm text-gray-600">RCM: {p.kpis.rcm} | Denials: {p.kpis.denialRate}</p>
        <button className="text-blue-600 underline text-sm mt-2">View Full Metrics</button>
      </div>
    ))}
  </div>
);
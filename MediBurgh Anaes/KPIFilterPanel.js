const KPIFilterPanel = ({ filters, setFilters }) => (
  <div className="space-y-4 p-4 bg-gray-50 rounded shadow">
    <select onChange={(e) => setFilters({ ...filters, provider: e.target.value })} className="border p-2 rounded w-full">
      <option value="">All Providers</option>
      <option value="PROV7890">Dr. Naidoo</option>
      <option value="PROV4567">Dr. Smith</option>
    </select>
    <select onChange={(e) => setFilters({ ...filters, range: e.target.value })} className="border p-2 rounded w-full">
      <option value="30">Last 30 Days</option>
      <option value="90">Last 90 Days</option>
      <option value="all">All Time</option>
    </select>
  </div>
);
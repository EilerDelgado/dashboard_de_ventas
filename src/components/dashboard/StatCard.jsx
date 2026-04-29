export const StatCard = ({ label, value, sub, accent = false }) => (
  <div className={`rounded-2xl border p-5 flex flex-col gap-2 ${accent ? 'bg-accent/10 border-accent/30' : 'bg-surface-900 border-white/5'}`}>
    <p className="text-xs font-medium text-gray-500 uppercase tracking-wider">{label}</p>
    <p className={`font-display font-bold text-2xl ${accent ? 'text-accent-light' : 'text-white'}`}>{value}</p>
    {sub && <p className="text-xs text-gray-500">{sub}</p>}
  </div>
)

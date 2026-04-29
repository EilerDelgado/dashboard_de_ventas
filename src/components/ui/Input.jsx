export const Input = ({ label, error, className = '', ...props }) => (
  <div className="flex flex-col gap-1.5">
    {label && <label className="text-xs font-medium text-gray-400 uppercase tracking-wider">{label}</label>}
    <input
      className={`w-full bg-surface-900 border border-white/10 rounded-lg px-3 py-2.5 text-sm text-gray-100 placeholder-gray-600 focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent/50 transition-all ${error ? 'border-red-500/60' : ''} ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-400">{error}</span>}
  </div>
)

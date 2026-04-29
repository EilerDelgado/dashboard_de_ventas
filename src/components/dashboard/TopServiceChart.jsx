import { salesByService, formatCurrency } from '../../utils/calculations'

export const TopServiceChart = ({ sales }) => {
  const data = salesByService(sales).slice(0, 6)
  const max = data[0]?.count || 1

  if (!data.length)
    return <p className="text-gray-600 text-sm text-center py-6">Sin datos</p>

  return (
    <div className="space-y-3">
      {data.map((item) => (
        <div key={item.name} className="space-y-1">
          <div className="flex justify-between text-xs">
            <span className="text-gray-300 font-medium">{item.name}</span>
            <span className="text-gray-500">{item.count} ventas · <span className="text-emerald-400">{formatCurrency(item.profit)}</span></span>
          </div>
          <div className="w-full h-2 bg-surface-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-accent to-accent-light rounded-full transition-all duration-500"
              style={{ width: `${(item.count / max) * 100}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}

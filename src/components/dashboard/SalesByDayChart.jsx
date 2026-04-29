import { salesByDay } from '../../utils/calculations'

export const SalesByDayChart = ({ sales }) => {
  const data = salesByDay(sales, 14)
  const maxRevenue = Math.max(...data.map((d) => d.revenue), 1)
  const W = 480
  const H = 120
  const padL = 8
  const padR = 8
  const padT = 10
  const padB = 24

  const xStep = (W - padL - padR) / (data.length - 1)

  const toX = (i) => padL + i * xStep
  const toY = (val) => padT + (1 - val / maxRevenue) * (H - padT - padB)

  const revenuePoints = data.map((d, i) => `${toX(i)},${toY(d.revenue)}`).join(' ')
  const profitPoints = data.map((d, i) => `${toX(i)},${toY(d.profit)}`).join(' ')

  const areaRevenue = `${padL},${H - padB} ` + revenuePoints + ` ${W - padR},${H - padB}`
  const areaProfit = `${padL},${H - padB} ` + profitPoints + ` ${W - padR},${H - padB}`

  return (
    <div className="w-full overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ minWidth: 280 }}>
        <defs>
          <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7c3aed" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#7c3aed" stopOpacity="0" />
          </linearGradient>
          <linearGradient id="gradProfit" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>

        {/* Areas */}
        <polygon points={areaRevenue} fill="url(#gradRev)" />
        <polygon points={areaProfit} fill="url(#gradProfit)" />

        {/* Lines */}
        <polyline points={revenuePoints} fill="none" stroke="#a78bfa" strokeWidth="1.5" strokeLinejoin="round" />
        <polyline points={profitPoints} fill="none" stroke="#34d399" strokeWidth="1.5" strokeLinejoin="round" />

        {/* X axis labels (every 2 days) */}
        {data.map((d, i) => {
          if (i % 2 !== 0) return null
          return (
            <text key={i} x={toX(i)} y={H - 6} textAnchor="middle" fontSize="8" fill="#4b5563">
              {d.date.slice(5)}
            </text>
          )
        })}

        {/* Dots */}
        {data.map((d, i) =>
          d.count > 0 ? (
            <circle key={i} cx={toX(i)} cy={toY(d.revenue)} r="2.5" fill="#a78bfa" />
          ) : null
        )}
      </svg>

      <div className="flex gap-4 mt-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 inline-block" />Ingresos</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block" />Ganancia</span>
      </div>
    </div>
  )
}

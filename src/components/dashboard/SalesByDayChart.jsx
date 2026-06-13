import { useState } from 'react'
import { salesByDay, formatCurrency } from '../../utils/calculations'

const MONTH_NAMES = [
  'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
  'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre',
]

const formatDateES = (dateStr) => {
  const [, month, day] = dateStr.split('-')
  return `${day} ${MONTH_NAMES[parseInt(month, 10) - 1]}`
}

export const SalesByDayChart = ({ sales }) => {
  const [hoveredIdx, setHoveredIdx] = useState(null)

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

  // Tooltip position as percentage of the SVG width/height
  const tooltipLeft = hoveredIdx !== null ? (toX(hoveredIdx) / W) * 100 : 0
  const tooltipTop = hoveredIdx !== null ? (toY(data[hoveredIdx].revenue) / H) * 100 : 0

  return (
    <div className="w-full overflow-x-auto relative">
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

        {/* Visible dots */}
        {data.map((d, i) =>
          d.count > 0 ? (
            <circle
              key={`dot-${i}`}
              cx={toX(i)}
              cy={toY(d.revenue)}
              r={hoveredIdx === i ? 4 : 2.5}
              fill="#a78bfa"
              className="transition-all duration-150"
            />
          ) : null
        )}

        {/* Invisible larger hover targets */}
        {data.map((d, i) =>
          d.count > 0 ? (
            <circle
              key={`hover-${i}`}
              cx={toX(i)}
              cy={toY(d.revenue)}
              r="12"
              fill="transparent"
              onMouseEnter={() => setHoveredIdx(i)}
              onMouseLeave={() => setHoveredIdx(null)}
              className="cursor-pointer"
            />
          ) : null
        )}
      </svg>

      {/* Tooltip */}
      {hoveredIdx !== null && data[hoveredIdx] && (
        <div
          className="absolute pointer-events-none bg-surface-900 border border-white/10 rounded-xl shadow-xl px-3 py-2 text-xs z-50"
          style={{
            left: `${tooltipLeft}%`,
            top: `${tooltipTop}%`,
            transform: `translate(${tooltipLeft > 75 ? '-100%' : tooltipLeft < 25 ? '0%' : '-50%'}, -110%)`,
          }}
        >
          <p className="font-semibold text-white mb-1">{formatDateES(data[hoveredIdx].date)}</p>
          <p className="text-gray-400">
            Ventas: <span className="text-white">{data[hoveredIdx].count}</span>
          </p>
          <p className="text-gray-400">
            Ingresos: <span className="text-violet-400">{formatCurrency(data[hoveredIdx].revenue)}</span>
          </p>
          <p className="text-gray-400">
            Ganancia: <span className="text-emerald-400">{formatCurrency(data[hoveredIdx].profit)}</span>
          </p>
        </div>
      )}

      <div className="flex gap-4 mt-1 text-xs text-gray-500">
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-violet-400 inline-block" />Ingresos</span>
        <span className="flex items-center gap-1.5"><span className="w-3 h-0.5 bg-emerald-400 inline-block" />Ganancia</span>
      </div>
    </div>
  )
}

import { useState } from 'react'
import { useSales } from '../context/SalesContext'
import { calcTotals, topService, topDay, salesByService, formatCurrency } from '../utils/calculations'
import { StatCard } from '../components/dashboard/StatCard'
import { TopServiceChart } from '../components/dashboard/TopServiceChart'
import { SalesByDayChart } from '../components/dashboard/SalesByDayChart'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

const generateInsights = (sales, totals, best, bestDay) => {
  const insights = []
  if (!sales.length) return insights

  const active = sales.filter((s) => s.status !== 'cancelada')

  // Top service insight
  if (best && totals.totalSales > 0) {
    const pct = ((best.count / active.length) * 100).toFixed(0)
    insights.push(`📈 ${best.name} genera más de la mitad de las ventas (${pct}%)`)
  }

  // Best day insight
  if (bestDay) {
    const months = ['enero','febrero','marzo','abril','mayo','junio','julio','agosto','septiembre','octubre','noviembre','diciembre']
    const d = new Date(bestDay.date + 'T12:00:00')
    const dayStr = `${d.getDate()} de ${months[d.getMonth()]}`
    insights.push(`🔥 El ${dayStr} fue el día con más ventas (${bestDay.count})`)
  }

  // Margin insight
  if (totals.totalRevenue > 0) {
    const margin = ((totals.totalProfit / totals.totalRevenue) * 100).toFixed(1)
    insights.push(`💰 El margen promedio del negocio es del ${margin}%`)
  }

  // Total sales count
  insights.push(`🚀 Se registraron ${totals.totalSales} ventas durante el período analizado`)

  return insights.slice(0, 4)
}

export const Dashboard = () => {
  const { sales, clearAllSales } = useSales()
  const [confirmClear, setConfirmClear] = useState(false)

  const totals = calcTotals(sales)
  const { totalSales, totalRevenue, totalCost, totalProfit } = totals
  const best = topService(sales)
  const bestDay = topDay(sales)
  const active = sales.filter((s) => s.status !== 'cancelada')

  // Datos secundarios para las tarjetas
  const avgTicket = active.length > 0 ? formatCurrency(totalRevenue / active.length) : '—'
  const margin = totalRevenue > 0 ? `${((totalProfit / totalRevenue) * 100).toFixed(1)}% margen` : '—'
  const bestPct = best && active.length > 0 ? `${((best.count / active.length) * 100).toFixed(0)}% de las ventas` : undefined
  const bestDaySub = bestDay ? `${bestDay.count} ventas` : undefined

  const insights = generateInsights(sales, totals, best, bestDay)

  return (
    <div className="p-6 space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total ventas" value={totalSales} />
        <StatCard label="Ingresos" value={formatCurrency(totalRevenue)} sub={`${avgTicket} por venta`} />
        <StatCard label="Costos" value={formatCurrency(totalCost)} />
        <StatCard label="Ganancias" value={formatCurrency(totalProfit)} sub={margin} accent={totalProfit > 0} />
        <StatCard label="Top servicio" value={best?.name || '—'} sub={bestPct} />
        <StatCard label="Mejor día" value={bestDay?.date?.slice(5) || '—'} sub={bestDaySub} />
      </div>

      {/* Insights */}
      {insights.length > 0 && (
        <div className="bg-surface-900 rounded-2xl border border-white/5 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-300 mb-3">Resumen del negocio</h3>
          <div className="grid sm:grid-cols-2 gap-2">
            {insights.map((text, i) => (
              <p key={i} className="text-sm text-gray-400 leading-relaxed">{text}</p>
            ))}
          </div>
        </div>
      )}

      {/* Charts */}
      <div className="grid lg:grid-cols-2 gap-6">
        <div className="bg-surface-900 rounded-2xl border border-white/5 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-300 mb-4">Últimos 14 días</h3>
          <SalesByDayChart sales={sales} />
        </div>
        <div className="bg-surface-900 rounded-2xl border border-white/5 p-5">
          <h3 className="font-display font-semibold text-sm text-gray-300 mb-4">Por servicio</h3>
          <TopServiceChart sales={sales} />
        </div>
      </div>
      
      {/*POR EL MOMENTO NO BORRAR:  para limpiar datos 
      <div className="border border-red-500/20 rounded-2xl p-5 flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-red-400">Zona peligrosa</p>
          <p className="text-xs text-gray-500 mt-0.5">Elimina todas las ventas del almacenamiento local</p>
        </div>
        <Button variant="danger" size="sm" onClick={() => setConfirmClear(true)}>
          Limpiar todos los datos
        </Button>
      </div>
      */}
      <Modal open={confirmClear} onClose={() => setConfirmClear(false)} title="¿Eliminar todo?">
        <p className="text-gray-400 text-sm mb-5">
          Se eliminarán <strong className="text-white">{totalSales} ventas</strong> permanentemente. No se puede deshacer.
        </p>
        <div className="flex justify-end gap-3">
          <Button variant="secondary" onClick={() => setConfirmClear(false)}>Cancelar</Button>
          <Button variant="danger" onClick={() => { clearAllSales(); setConfirmClear(false) }}>Sí, eliminar todo</Button>
        </div>
      </Modal>
    </div>
  )
}

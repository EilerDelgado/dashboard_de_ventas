import { useState } from 'react'
import { useSales } from '../context/SalesContext'
import { calcTotals, topService, topDay, formatCurrency } from '../utils/calculations'
import { StatCard } from '../components/dashboard/StatCard'
import { TopServiceChart } from '../components/dashboard/TopServiceChart'
import { SalesByDayChart } from '../components/dashboard/SalesByDayChart'
import { Modal } from '../components/ui/Modal'
import { Button } from '../components/ui/Button'

export const Dashboard = () => {
  const { sales, clearAllSales } = useSales()
  const [confirmClear, setConfirmClear] = useState(false)

  const { totalSales, totalRevenue, totalCost, totalProfit } = calcTotals(sales)
  const best = topService(sales)
  const bestDay = topDay(sales)

  return (
    <div className="p-6 space-y-6">
      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <StatCard label="Total ventas" value={totalSales} />
        <StatCard label="Ingresos" value={formatCurrency(totalRevenue)} />
        <StatCard label="Costos" value={formatCurrency(totalCost)} />
        <StatCard label="Ganancias" value={formatCurrency(totalProfit)} accent={totalProfit > 0} />
        <StatCard label="Top servicio" value={best?.name || '—'} sub={best ? `${best.count} ventas` : undefined} />
        <StatCard label="Mejor día" value={bestDay?.date?.slice(5) || '—'} sub={bestDay ? `${bestDay.count} ventas` : undefined} />
      </div>

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

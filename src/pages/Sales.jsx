import { useState } from 'react'
import { useSales } from '../context/SalesContext'
import { SaleFilters } from '../components/sales/SaleFilters'
import { SaleTable } from '../components/sales/SaleTable'
import { Button } from '../components/ui/Button'
import { exportToCSV } from '../utils/exportCSV'

const initFilters = { service: 'Todos', status: 'Todos', dateFrom: '', dateTo: '', client: '' }

const applyFilters = (sales, f) =>
  sales.filter((s) => {
    if (f.service !== 'Todos' && s.service !== f.service) return false
    if (f.status !== 'Todos' && s.status !== f.status) return false
    if (f.dateFrom && s.date < f.dateFrom) return false
    if (f.dateTo && s.date > f.dateTo + 'T23:59:59') return false
    if (f.client && !s.clientName.toLowerCase().includes(f.client.toLowerCase())) return false
    return true
  })

export const Sales = () => {
  const { sales } = useSales()
  const [filters, setFilters] = useState(initFilters)

  const filtered = applyFilters(sales, filters)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SaleFilters filters={filters} onChange={setFilters} onClear={() => setFilters(initFilters)} />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportToCSV(filtered)}
          disabled={!filtered.length}
        >
          ↓ Exportar CSV ({filtered.length})
        </Button>
      </div>

      <SaleTable sales={filtered} />
    </div>
  )
}

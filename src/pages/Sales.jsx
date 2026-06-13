import { useSales } from '../context/SalesContext'
import { useFilters } from '../hooks/useFilters'
import { SaleFilters } from '../components/sales/SaleFilters'
import { SaleTable } from '../components/sales/SaleTable'
import { Button } from '../components/ui/Button'
import { exportToCSV } from '../utils/exportCSV'

import { Download } from 'lucide-react'

export const Sales = () => {
  const { sales, loading } = useSales()
  const { filters, setFilters, filtered, clearFilters } = useFilters(sales)

  return (
    <div className="p-6 space-y-5">
      <div className="flex items-end justify-between gap-4 flex-wrap">
        <SaleFilters filters={filters} onChange={setFilters} onClear={clearFilters} />
        <Button
          variant="secondary"
          size="sm"
          onClick={() => exportToCSV(filtered)}
          disabled={!filtered.length}
          className="flex items-center gap-1.5"
        >
          <Download className="w-4 h-4" />
          <span>Exportar CSV ({filtered.length})</span>
        </Button>
      </div>

      <SaleTable sales={filtered} loading={loading} />
    </div>
  )
}

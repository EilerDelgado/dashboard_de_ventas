import { useSales } from '../context/SalesContext'
import { useFilters } from '../hooks/useFilters'
import { SaleFilters } from '../components/sales/SaleFilters'
import { SaleTable } from '../components/sales/SaleTable'
import { Button } from '../components/ui/Button'
import { exportToCSV } from '../utils/exportCSV'

export const Sales = () => {
  const { sales } = useSales()
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
        >
          ↓ Exportar CSV ({filtered.length})
        </Button>
      </div>

      <SaleTable sales={filtered} />
    </div>
  )
}

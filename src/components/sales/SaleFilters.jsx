import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { SERVICES, STATUSES } from '../../utils/constants'
import { Button } from '../ui/Button'

const ALL = 'Todos'

export const SaleFilters = ({ filters, onChange, onClear }) => {
  const set = (field, value) => onChange({ ...filters, [field]: value })

  return (
    <div className="flex flex-wrap gap-3 items-end">
      <div className="w-40">
        <Select
          label="Servicio"
          options={[ALL, ...SERVICES]}
          value={filters.service}
          onChange={(e) => set('service', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Select
          label="Estado"
          options={[ALL, ...STATUSES]}
          value={filters.status}
          onChange={(e) => set('status', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Input
          label="Desde"
          type="date"
          value={filters.dateFrom}
          onChange={(e) => set('dateFrom', e.target.value)}
        />
      </div>
      <div className="w-36">
        <Input
          label="Hasta"
          type="date"
          value={filters.dateTo}
          onChange={(e) => set('dateTo', e.target.value)}
        />
      </div>
      <div className="flex-1 min-w-40">
        <Input
          label="Buscar cliente"
          placeholder="Nombre..."
          value={filters.client}
          onChange={(e) => set('client', e.target.value)}
        />
      </div>
      <Button variant="ghost" size="sm" onClick={onClear} className="mb-px">
        Limpiar
      </Button>
    </div>
  )
}

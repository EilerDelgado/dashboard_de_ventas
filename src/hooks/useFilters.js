import { useState, useMemo } from 'react'

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

export const useFilters = (sales) => {
  const [filters, setFilters] = useState(initFilters)
  const filtered = useMemo(() => applyFilters(sales, filters), [sales, filters])
  const clearFilters = () => setFilters(initFilters)

  return { filters, setFilters, filtered, clearFilters }
}

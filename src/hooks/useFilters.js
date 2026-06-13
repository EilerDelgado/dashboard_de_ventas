import { useState, useMemo } from 'react'
import { useSales } from '../context/SalesContext'

const initFilters = { service: 'Todos', status: 'Todos', dateFrom: '', dateTo: '', client: '' }

const applyFilters = (sales, f, searchQuery) =>
  sales.filter((s) => {
    if (f.service !== 'Todos' && s.service !== f.service) return false
    if (f.status !== 'Todos' && s.status !== f.status) return false
    if (f.dateFrom && s.date < f.dateFrom) return false
    if (f.dateTo && s.date > f.dateTo + 'T23:59:59') return false
    if (f.client && !s.clientName.toLowerCase().includes(f.client.toLowerCase())) return false

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      const match =
        (s.clientName || '').toLowerCase().includes(q) ||
        (s.service || '').toLowerCase().includes(q) ||
        (s.accountType || '').toLowerCase().includes(q) ||
        (s.paymentMethod || '').toLowerCase().includes(q)
      if (!match) return false
    }

    return true
  })

export const useFilters = (sales) => {
  const { searchQuery } = useSales()
  const [filters, setFilters] = useState(initFilters)
  const filtered = useMemo(() => applyFilters(sales, filters, searchQuery), [sales, filters, searchQuery])
  const clearFilters = () => setFilters(initFilters)

  return { filters, setFilters, filtered, clearFilters }
}

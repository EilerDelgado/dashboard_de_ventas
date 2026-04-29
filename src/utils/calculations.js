// Ganancia por venta individual
export const calcProfit = (salePrice, purchasePrice) =>
  Number(salePrice) - Number(purchasePrice)

// Totales de una lista de ventas (puede ser filtrada)
export const calcTotals = (sales) => {
  const active = sales.filter((s) => s.status !== 'cancelada')
  return {
    totalSales: sales.length,
    totalRevenue: active.reduce((acc, s) => acc + s.salePrice, 0),
    totalCost: active.reduce((acc, s) => acc + s.purchasePrice, 0),
    totalProfit: active.reduce((acc, s) => acc + s.profit, 0),
  }
}

// Servicio más vendido (excluyendo canceladas)
export const topService = (sales) => {
  const counts = {}
  sales
    .filter((s) => s.status !== 'cancelada')
    .forEach((s) => { counts[s.service] = (counts[s.service] || 0) + 1 })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0] ? { name: sorted[0][0], count: sorted[0][1] } : null
}

// Día con más ventas
export const topDay = (sales) => {
  const counts = {}
  sales
    .filter((s) => s.status !== 'cancelada')
    .forEach((s) => {
      const day = s.date.slice(0, 10)
      counts[day] = (counts[day] || 0) + 1
    })
  const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1])
  return sorted[0] ? { date: sorted[0][0], count: sorted[0][1] } : null
}

// Ventas agrupadas por servicio 
export const salesByService = (sales) => {
  const map = {}
  sales
    .filter((s) => s.status !== 'cancelada')
    .forEach((s) => {
      if (!map[s.service]) map[s.service] = { revenue: 0, profit: 0, count: 0 }
      map[s.service].revenue += s.salePrice
      map[s.service].profit += s.profit
      map[s.service].count += 1
    })
  return Object.entries(map)
    .map(([name, vals]) => ({ name, ...vals }))
    .sort((a, b) => b.count - a.count)
}

// Ventas por día en un rango (últimos 14 días por defecto)
export const salesByDay = (sales, days = 14) => {
  const result = {}
  const today = new Date()
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    result[key] = { date: key, revenue: 0, profit: 0, count: 0 }
  }
  sales
    .filter((s) => s.status !== 'cancelada')
    .forEach((s) => {
      const key = s.date.slice(0, 10)
      if (result[key]) {
        result[key].revenue += s.salePrice
        result[key].profit += s.profit
        result[key].count += 1
      }
    })
  return Object.values(result)
}

export const formatCurrency = (n) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n)

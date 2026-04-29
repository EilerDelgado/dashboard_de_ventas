// Exporta un array de ventas a CSV y descarga el archivo
export const exportToCSV = (sales) => {
  if (!sales.length) return

  const headers = [
    'ID', 'Servicio', 'Tipo', 'Cliente', 'Compra', 'Venta', 'Ganancia',
    'Pago', 'Fecha', 'Estado'
  ]

  const rows = sales.map((s) => [
    s.id,
    s.service,
    s.accountType,
    s.clientName,
    s.purchasePrice,
    s.salePrice,
    s.profit,
    s.paymentMethod,
    s.date.slice(0, 10),
    s.status,
  ])

  const csv = [headers, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
    .join('\n')

  const blob = new Blob(['\uFEFF' + csv], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `ventas_streaming_${new Date().toISOString().slice(0, 10)}.csv`
  link.click()
  URL.revokeObjectURL(url)
}

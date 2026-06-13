import { useState } from 'react'
import { useSales } from '../../context/SalesContext'
import { Button } from '../ui/Button'
import { Modal } from '../ui/Modal'
import { SaleForm } from './SaleForm'
import { formatCurrency } from '../../utils/calculations'
import { STATUSES } from '../../utils/constants'

export const SaleTable = ({ sales }) => {
  const { updateSale, deleteSale, updateStatus } = useSales()
  const [editing, setEditing] = useState(null)
  const [deleting, setDeleting] = useState(null)

  // Local state for pagination
  const [currentPage, setCurrentPage] = useState(1)
  const [rowsPerPage, setRowsPerPage] = useState(10)

  // Reset currentPage to 1 whenever sales array length or rowsPerPage changes
  const [prevSalesLength, setPrevSalesLength] = useState(sales.length)
  const [prevRowsPerPage, setPrevRowsPerPage] = useState(rowsPerPage)

  if (sales.length !== prevSalesLength || rowsPerPage !== prevRowsPerPage) {
    setPrevSalesLength(sales.length)
    setPrevRowsPerPage(rowsPerPage)
    setCurrentPage(1)
  }

  if (!sales.length)
    return (
      <div className="text-center py-16 text-gray-600">
        <div className="text-4xl mb-3">◈</div>
        <p>Sin ventas registradas</p>
      </div>
    )

  // Calculations
  const totalPages = Math.ceil(sales.length / rowsPerPage)
  const paginatedSales = sales.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage)

  const startRow = (currentPage - 1) * rowsPerPage + 1
  const endRow = Math.min(currentPage * rowsPerPage, sales.length)

  return (
    <>
      <div className="overflow-x-auto rounded-xl border border-white/5">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/5 bg-surface-900/50">
              {['Servicio', 'Tipo', 'Cliente', 'Compra', 'Venta', 'Ganancia', 'Pago', 'Fecha', 'Estado', ''].map((h) => (
                <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider whitespace-nowrap">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {paginatedSales.map((sale, i) => (
              <tr
                key={sale.id}
                className={`border-b border-white/5 transition-colors hover:bg-white/3 ${i % 2 === 0 ? 'bg-surface-900/20' : ''}`}
              >
                <td className="px-4 py-3 font-medium text-white whitespace-nowrap">{sale.service}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{sale.accountType}</td>
                <td className="px-4 py-3 text-gray-300 whitespace-nowrap">{sale.clientName}</td>
                <td className="px-4 py-3 font-mono-custom text-gray-400 whitespace-nowrap">{formatCurrency(sale.purchasePrice)}</td>
                <td className="px-4 py-3 font-mono-custom text-gray-200 whitespace-nowrap">{formatCurrency(sale.salePrice)}</td>
                <td className={`px-4 py-3 font-mono-custom font-bold whitespace-nowrap ${sale.profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {formatCurrency(sale.profit)}
                </td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{sale.paymentMethod}</td>
                <td className="px-4 py-3 text-gray-400 whitespace-nowrap">{sale.date.slice(0, 10)}</td>
                <td className="px-4 py-3">
                  <select
                    value={sale.status}
                    onChange={(e) => updateStatus(sale.id, e.target.value)}
                    className="bg-transparent text-xs border border-white/10 rounded-md px-2 py-1 focus:outline-none focus:border-accent cursor-pointer"
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditing(sale)}
                      className="text-gray-500 hover:text-accent-light transition-colors text-xs"
                    >
                      ✎
                    </button>
                    <button
                      onClick={() => setDeleting(sale)}
                      className="text-gray-500 hover:text-red-400 transition-colors text-xs"
                    >
                      ✕
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-4 px-1 py-2 text-sm text-gray-400">
        <div className="flex items-center gap-2">
          <span>Filas por página:</span>
          <select
            value={rowsPerPage}
            onChange={(e) => setRowsPerPage(Number(e.target.value))}
            className="bg-surface-900 border border-white/10 rounded-md px-2 py-1 focus:outline-none focus:border-accent cursor-pointer text-white"
          >
            <option value={10}>10</option>
            <option value={25}>25</option>
            <option value={50}>50</option>
          </select>
        </div>

        <div>
          <span>
            Mostrando {startRow}-{endRow} de {sales.length} ventas
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 rounded-md bg-surface-900 border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
          >
            Anterior
          </button>
          <button
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 rounded-md bg-surface-900 border border-white/10 hover:bg-white/5 disabled:opacity-50 disabled:cursor-not-allowed transition-colors text-white"
          >
            Siguiente
          </button>
        </div>
      </div>

      {/* Edit modal */}
      <Modal open={!!editing} onClose={() => setEditing(null)} title="Editar venta">
        {editing && (
          <SaleForm
            initial={editing}
            onSubmit={(data) => {
              updateSale(editing.id, data)
              setEditing(null)
            }}
            onCancel={() => setEditing(null)}
          />
        )}
      </Modal>

      {/* Delete confirm modal */}
      <Modal open={!!deleting} onClose={() => setDeleting(null)} title="¿Eliminar venta?">
        {deleting && (
          <div className="space-y-4">
            <p className="text-gray-400 text-sm">
              Se eliminará la venta de <strong className="text-white">{deleting.service}</strong> para <strong className="text-white">{deleting.clientName}</strong>. Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-end gap-3">
              <Button variant="secondary" onClick={() => setDeleting(null)}>Cancelar</Button>
              <Button variant="danger" onClick={() => { deleteSale(deleting.id); setDeleting(null) }}>Eliminar</Button>
            </div>
          </div>
        )}
      </Modal>
    </>
  )
}


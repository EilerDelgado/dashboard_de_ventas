import { useSales } from '../context/SalesContext'
import { SaleForm } from '../components/sales/SaleForm'

export const NewSale = ({ onAfterSave }) => {
  const { addSale } = useSales()

  const handleSubmit = async (data) => {
    await addSale(data)
    onAfterSave()
  }

  return (
    <div className="p-6 max-w-2xl">
      <div className="bg-surface-900 rounded-2xl border border-white/5 p-6">
        <h2 className="font-display font-bold text-white mb-5">Registrar nueva venta</h2>
        <SaleForm onSubmit={handleSubmit} />
      </div>
    </div>
  )
}

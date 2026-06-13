import { useNavigate } from 'react-router-dom'
import { useSales } from '../context/SalesContext'
import { SaleForm } from '../components/sales/SaleForm'

export const NewSale = () => {
  const { addSale } = useSales()
  const navigate = useNavigate()

  const handleSubmit = async (data) => {
    await addSale(data)
    navigate('/ventas')
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

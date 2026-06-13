import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { supabase } from '../lib/supabase'

const SalesContext = createContext(null)

const fromDB = (row) => ({
  id:            row.id,
  service:       row.service,
  accountType:   row.account_type,
  purchasePrice: Number(row.purchase_price),
  salePrice:     Number(row.sale_price),
  profit:        Number(row.profit),
  clientName:    row.client_name,
  paymentMethod: row.payment_method,
  date:          row.sale_date,
  status:        row.status,
  createdBy:     row.created_by,
})

const toDB = (data, userId) => ({
  service:        data.service,
  account_type:   data.accountType,
  purchase_price: data.purchasePrice,
  sale_price:     data.salePrice,
  profit:         data.salePrice - data.purchasePrice,
  client_name:    data.clientName,
  payment_method: data.paymentMethod,
  sale_date:      data.date,
  status:         data.status,
  created_by:     userId,
})

export const SalesProvider = ({ children }) => {
  const [sales, setSales]     = useState([])
  const [loading, setLoading] = useState(true)
  const [user, setUser]       = useState(null)
  const [toast, setToast]     = useState(null)

  const showToast = (message, type = 'success') => {
    setToast({ message, type, id: Date.now() })
    setTimeout(() => setToast(null), 3000)
  }

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null)
    })
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => {
      setUser(session?.user ?? null)
    })
    return () => subscription.unsubscribe()
  }, [])

  const fetchSales = useCallback(async () => {
    if (!user) { setSales([]); setLoading(false); return }
    setLoading(true)
    const { data, error } = await supabase
      .from('sales')
      .select('*')
      .order('sale_date', { ascending: false })
    if (error) showToast('Error al cargar ventas', 'error')
    else setSales(data.map(fromDB))
    setLoading(false)
  }, [user])

  useEffect(() => { fetchSales() }, [fetchSales])

  const addSale = async (data) => {
    if (!user) return
    const { data: inserted, error } = await supabase
      .from('sales').insert(toDB(data, user.id)).select().single()
    if (error) { showToast('Error al guardar venta', 'error'); return }
    setSales((prev) => [fromDB(inserted), ...prev])
    showToast('Venta registrada correctamente')
  }

  const updateSale = async (id, data) => {
    const { data: updated, error } = await supabase
      .from('sales')
      .update({
        service: data.service, account_type: data.accountType,
        purchase_price: data.purchasePrice, sale_price: data.salePrice,
        profit: data.salePrice - data.purchasePrice,
        client_name: data.clientName, payment_method: data.paymentMethod,
        sale_date: data.date, status: data.status,
      })
      .eq('id', id).select().single()
    if (error) { showToast('Error al actualizar', 'error'); return }
    setSales((prev) => prev.map((s) => (s.id === id ? fromDB(updated) : s)))
    showToast('Venta actualizada')
  }

  const deleteSale = async (id) => {
    const { error } = await supabase.from('sales').delete().eq('id', id)
    if (error) { showToast('Error al eliminar', 'error'); return }
    setSales((prev) => prev.filter((s) => s.id !== id))
    showToast('Venta eliminada', 'success')
  }

  const updateStatus = async (id, status) => {
    const { data: updated, error } = await supabase
      .from('sales').update({ status }).eq('id', id).select().single()
    if (error) { showToast('Error al cambiar estado', 'error'); return }
    setSales((prev) => prev.map((s) => (s.id === id ? fromDB(updated) : s)))
    showToast(`Estado cambiado a "${status}"`)
  }

  const clearAllSales = async () => {
    if (!user) return
    const { error } = await supabase.from('sales').delete().eq('created_by', user.id)
    if (error) { showToast('Error al limpiar datos', 'error'); return }
    setSales([])
    showToast('Todos los datos eliminados', 'success')
  }

  return (
    <SalesContext.Provider value={{ sales, loading, user, addSale, updateSale, deleteSale, updateStatus, clearAllSales, toast }}>
      {children}
    </SalesContext.Provider>
  )
}

export const useSales = () => {
  const ctx = useContext(SalesContext)
  if (!ctx) throw new Error('useSales debe usarse dentro de SalesProvider')
  return ctx
}

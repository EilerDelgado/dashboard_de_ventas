import { useState } from 'react'
import { Input } from '../ui/Input'
import { Select } from '../ui/Select'
import { Button } from '../ui/Button'
import { SERVICES, ACCOUNT_TYPES, PAYMENT_METHODS, STATUSES } from '../../utils/constants'
import { calcProfit, formatCurrency } from '../../utils/calculations'

const today = () => new Date().toISOString().slice(0, 10)

const initForm = {
  service: SERVICES[0],
  serviceCustom: '',
  accountType: ACCOUNT_TYPES[0],
  accountTypeCustom: '',
  purchasePrice: '',
  salePrice: '',
  clientName: '',
  paymentMethod: PAYMENT_METHODS[0],
  date: today(),
  status: 'vendida',
}

export const SaleForm = ({ initial = null, onSubmit, onCancel }) => {
  const [form, setForm] = useState(
    initial
      ? {
          ...initForm,
          ...initial,
          service: SERVICES.includes(initial.service) ? initial.service : 'Otro',
          serviceCustom: SERVICES.includes(initial.service) ? '' : initial.service,
          accountType: ACCOUNT_TYPES.includes(initial.accountType) ? initial.accountType : 'Otro',
          accountTypeCustom: ACCOUNT_TYPES.includes(initial.accountType) ? '' : initial.accountType,
          purchasePrice: String(initial.purchasePrice),
          salePrice: String(initial.salePrice),
        }
      : initForm
  )
  const [errors, setErrors] = useState({})

  const set = (field, value) => setForm((p) => ({ ...p, [field]: value }))

  const profit = calcProfit(Number(form.salePrice) || 0, Number(form.purchasePrice) || 0)

  const validate = () => {
    const e = {}
    if (!form.clientName.trim()) e.clientName = 'Requerido'
    if (!form.purchasePrice || Number(form.purchasePrice) <= 0) e.purchasePrice = 'Debe ser > 0'
    if (!form.salePrice || Number(form.salePrice) <= 0) e.salePrice = 'Debe ser > 0'
    if (!form.date) e.date = 'Requerido'
    if (form.service === 'Otro' && !form.serviceCustom.trim()) e.serviceCustom = 'Escribe el servicio'
    if (form.accountType === 'Otro' && !form.accountTypeCustom.trim()) e.accountTypeCustom = 'Escribe el tipo'
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = () => {
    if (!validate()) return
    onSubmit({
      service: form.service === 'Otro' ? form.serviceCustom : form.service,
      accountType: form.accountType === 'Otro' ? form.accountTypeCustom : form.accountType,
      purchasePrice: Number(form.purchasePrice),
      salePrice: Number(form.salePrice),
      clientName: form.clientName.trim(),
      paymentMethod: form.paymentMethod,
      date: form.date,
      status: form.status,
    })
  }

  return (
    <div className="space-y-4">
      {/* Servicio */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Servicio"
          options={SERVICES}
          value={form.service}
          onChange={(e) => set('service', e.target.value)}
        />
        {form.service === 'Otro' && (
          <Input
            label="Nombre del servicio"
            placeholder="ej. Canva Pro"
            value={form.serviceCustom}
            onChange={(e) => set('serviceCustom', e.target.value)}
            error={errors.serviceCustom}
          />
        )}
      </div>

      {/* Tipo */}
      <div className="grid grid-cols-2 gap-3">
        <Select
          label="Tipo de cuenta"
          options={ACCOUNT_TYPES}
          value={form.accountType}
          onChange={(e) => set('accountType', e.target.value)}
        />
        {form.accountType === 'Otro' && (
          <Input
            label="Tipo personalizado"
            placeholder="ej. Familiar"
            value={form.accountTypeCustom}
            onChange={(e) => set('accountTypeCustom', e.target.value)}
            error={errors.accountTypeCustom}
          />
        )}
      </div>

      {/* Cliente */}
      <Input
        label="Cliente"
        placeholder="Nombre del cliente"
        value={form.clientName}
        onChange={(e) => set('clientName', e.target.value)}
        error={errors.clientName}
      />

      {/* Precios */}
      <div className="grid grid-cols-2 gap-3">
        <Input
          label="Precio de compra"
          type="number"
          min="0"
          placeholder="0"
          value={form.purchasePrice}
          onChange={(e) => set('purchasePrice', e.target.value)}
          error={errors.purchasePrice}
        />
        <Input
          label="Precio de venta"
          type="number"
          min="0"
          placeholder="0"
          value={form.salePrice}
          onChange={(e) => set('salePrice', e.target.value)}
          error={errors.salePrice}
        />
      </div>

      {/* Ganancia en tiempo real */}
      <div className={`flex items-center justify-between px-4 py-3 rounded-xl border ${profit >= 0 ? 'bg-emerald-500/10 border-emerald-500/20' : 'bg-red-500/10 border-red-500/20'}`}>
        <span className="text-sm text-gray-400">Ganancia calculada</span>
        <span className={`font-mono-custom font-bold text-lg ${profit >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
          {formatCurrency(profit)}
        </span>
      </div>

      {/* Pago, fecha, estado */}
      <div className="grid grid-cols-3 gap-3">
        <Select
          label="Método de pago"
          options={PAYMENT_METHODS}
          value={form.paymentMethod}
          onChange={(e) => set('paymentMethod', e.target.value)}
        />
        <Input
          label="Fecha"
          type="date"
          value={form.date}
          onChange={(e) => set('date', e.target.value)}
          error={errors.date}
        />
        <Select
          label="Estado"
          options={STATUSES}
          value={form.status}
          onChange={(e) => set('status', e.target.value)}
        />
      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 pt-2">
        {onCancel && <Button variant="secondary" onClick={onCancel}>Cancelar</Button>}
        <Button onClick={handleSubmit}>{initial ? 'Guardar cambios' : 'Registrar venta'}</Button>
      </div>
    </div>
  )
}

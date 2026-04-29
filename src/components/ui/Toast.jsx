import { useSales } from '../../context/SalesContext'

const icons = {
  success: '✓',
  error: '✕',
  info: 'ℹ',
}

const colors = {
  success: 'border-emerald-500/40 bg-emerald-500/10 text-emerald-300',
  error: 'border-red-500/40 bg-red-500/10 text-red-300',
  info: 'border-accent/40 bg-accent/10 text-accent-light',
}

export const Toast = () => {
  const { toast } = useSales()
  if (!toast) return null

  const type = toast.type || 'success'

  return (
    <div
      key={toast.id}
      className={`fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 rounded-xl border shadow-xl backdrop-blur-sm text-sm font-medium transition-all ${colors[type]}`}
      style={{ animation: 'slideUp 0.25s ease' }}
    >
      <span className="font-bold">{icons[type]}</span>
      {toast.message}
    </div>
  )
}

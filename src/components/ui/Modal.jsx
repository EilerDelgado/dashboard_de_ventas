import { useEffect } from 'react'

export const Modal = ({ open, onClose, title, children }) => {
  useEffect(() => {
    const handler = (e) => e.key === 'Escape' && onClose()
    if (open) document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [open, onClose])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-surface-850 border border-white/10 rounded-2xl shadow-2xl w-full max-w-md p-6">
        {title && (
          <div className="flex items-center justify-between mb-5">
            <h2 className="font-display font-semibold text-lg text-white">{title}</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-white transition-colors text-xl leading-none">✕</button>
          </div>
        )}
        {children}
      </div>
    </div>
  )
}

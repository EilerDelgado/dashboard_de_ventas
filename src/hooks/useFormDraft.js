import { useState, useEffect, useRef, useCallback } from 'react'
import { useBlocker } from 'react-router-dom'

/**
 * Hook para guardar borradores de formulario en localStorage.
 * - Guarda automáticamente cuando cambia el formulario (debounced 10s)
 * - Restaura el borrador al montar el componente
 * - Limpia el borrador al llamar clearDraft()
 * - Detecta cambios sin guardar (isDirty)
 */
export const useFormDraft = (key, initialValues) => {
  const storageKey = `form_draft_${key}`

  // Intenta restaurar borrador del localStorage
  const getSavedDraft = () => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsed = JSON.parse(saved)
        // Verificar que el borrador tiene las mismas keys que initialValues
        const initialKeys = Object.keys(initialValues).sort().join(',')
        const savedKeys = Object.keys(parsed).sort().join(',')
        if (initialKeys === savedKeys) return parsed
      }
    } catch {
      // Si hay error parseando, ignorar
    }
    return null
  }

  const savedDraft = getSavedDraft()
  const [form, setForm] = useState(savedDraft || initialValues)
  const [isDirty, setIsDirty] = useState(!!savedDraft)
  const [restoredFromDraft, setRestoredFromDraft] = useState(!!savedDraft)
  const timerRef = useRef(null)
  const initialRef = useRef(initialValues)

  // Guardar en localStorage (debounced)
  const saveDraft = useCallback((formData) => {
    try {
      localStorage.setItem(storageKey, JSON.stringify(formData))
    } catch {
      // localStorage lleno o no disponible
    }
  }, [storageKey])

  // Actualizar campo individual
  const setField = useCallback((field, value) => {
    setForm((prev) => {
      const next = { ...prev, [field]: value }
      setIsDirty(true)
      setRestoredFromDraft(false)

      // Guardar inmediatamente al cambiar campo
      saveDraft(next)

      // También programar guardado con debounce de 10s (por si hay cambios rápidos)
      if (timerRef.current) clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => saveDraft(next), 10000)

      return next
    })
  }, [saveDraft])

  // Limpiar borrador (llamar después de guardar exitosamente)
  const clearDraft = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch {
      // Ignorar
    }
    setIsDirty(false)
    setRestoredFromDraft(false)
  }, [storageKey])

  // Resetear formulario a valores iniciales
  const resetForm = useCallback((newInitial) => {
    const values = newInitial || initialRef.current
    setForm(values)
    clearDraft()
  }, [clearDraft])

  // Advertencia antes de cerrar la pestaña
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      if (isDirty) {
        e.preventDefault()
        e.returnValue = ''
      }
    }
    window.addEventListener('beforeunload', handleBeforeUnload)
    return () => window.removeEventListener('beforeunload', handleBeforeUnload)
  }, [isDirty])

  // Interceptar navegación por React Router si hay cambios sin guardar
  const blocker = useBlocker(
    ({ currentLocation, nextLocation }) =>
      isDirty && currentLocation.pathname !== nextLocation.pathname
  )

  useEffect(() => {
    if (blocker.state === 'blocked') {
      const hasConfirmed = window.confirm("Tienes cambios sin guardar. ¿Deseas salir?")
      if (hasConfirmed) {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        clearDraft()
        blocker.proceed()
      } else {
        blocker.reset()
      }
    }
  }, [blocker.state, clearDraft, blocker])

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return {
    form,
    setForm,
    setField,
    isDirty,
    restoredFromDraft,
    clearDraft,
    resetForm,
  }
}

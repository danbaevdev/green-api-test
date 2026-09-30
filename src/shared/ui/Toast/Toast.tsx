import { createContext, use, useCallback, useMemo, useState, type ReactNode } from 'react'
import styles from './Toast.module.css'

type ToastKind = 'error' | 'info'

interface ToastItem {
  id: number
  kind: ToastKind
  text: string
}

interface ToastApi {
  show: (text: string, kind?: ToastKind) => void
}

const AUTO_DISMISS_MS = 4000

const ToastContext = createContext<ToastApi | null>(null)

let nextId = 0

export const ToastProvider = ({ children }: { children: ReactNode }) => {
  const [toasts, setToasts] = useState<ToastItem[]>([])

  const show = useCallback((text: string, kind: ToastKind = 'info') => {
    const id = nextId++
    setToasts((current) => [...current, { id, kind, text }])
    setTimeout(() => setToasts((current) => current.filter((t) => t.id !== id)), AUTO_DISMISS_MS)
  }, [])

  const api = useMemo(() => ({ show }), [show])

  return (
    <ToastContext value={api}>
      {children}
      <div className={styles.region} role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`${styles.toast} ${t.kind === 'error' ? styles.error : ''}`}>
            {t.text}
          </div>
        ))}
      </div>
    </ToastContext>
  )
}

export const useToast = () => {
  const ctx = use(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

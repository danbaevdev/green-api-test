import { createContext, use, useMemo, useState, type ReactNode } from 'react'
import { createGreenApi, type Credentials, type GreenApi } from '@/shared/api'
import { readJson, removeKey, writeJson } from '@/shared/lib'

const STORAGE_KEY = 'max-chat:credentials'

interface SessionValue {
  credentials: Credentials | null
  api: GreenApi | null
  login: (credentials: Credentials) => void
  logout: () => void
}

const SessionContext = createContext<SessionValue | null>(null)

export const SessionProvider = ({ children }: { children: ReactNode }) => {
  const [credentials, setCredentials] = useState(() => readJson<Credentials>(STORAGE_KEY))

  const value = useMemo<SessionValue>(
    () => ({
      credentials,
      api: credentials ? createGreenApi(credentials) : null,
      login: (next) => {
        writeJson(STORAGE_KEY, next)
        setCredentials(next)
      },
      logout: () => {
        removeKey(STORAGE_KEY)
        setCredentials(null)
      },
    }),
    [credentials],
  )

  return <SessionContext value={value}>{children}</SessionContext>
}

export const useSession = () => {
  const ctx = use(SessionContext)
  if (!ctx) throw new Error('useSession must be used within SessionProvider')
  return ctx
}

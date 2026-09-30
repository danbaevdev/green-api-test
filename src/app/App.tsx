import { ChatProvider } from '@/entities/chat'
import { SessionProvider, useSession } from '@/entities/session'
import { ChatPage } from '@/pages/chat/ChatPage'
import { LoginPage } from '@/pages/login/LoginPage'

const Router = () => {
  const { credentials } = useSession()
  if (!credentials) return <LoginPage />

  // key: switching instance must remount provider so history is loaded from the right storage key
  const storageKey = `max-chat:history:${credentials.idInstance}`
  return (
    <ChatProvider key={storageKey} storageKey={storageKey}>
      <ChatPage />
    </ChatProvider>
  )
}

export const App = () => (
  <SessionProvider>
    <Router />
  </SessionProvider>
)

import { useState } from 'react'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'

export const useSendMessage = (chatId: string) => {
  const { api } = useSession()
  const { dispatch } = useChats()
  const [isSending, setIsSending] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const send = async (text: string) => {
    if (!api) return false
    setIsSending(true)
    setError(null)
    try {
      const { idMessage } = await api.sendMessage({ chatId, message: text })
      dispatch({
        type: 'message/added',
        message: {
          id: idMessage,
          chatId,
          text,
          direction: 'out',
          timestamp: Math.floor(Date.now() / 1000),
        },
      })
      return true
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Не удалось отправить сообщение')
      return false
    } finally {
      setIsSending(false)
    }
  }

  return { send, isSending, error }
}

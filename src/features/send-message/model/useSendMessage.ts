import { useState } from 'react'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'
import { useToast } from '@/shared/ui'

export const useSendMessage = (chatId: string) => {
  const { api } = useSession()
  const { dispatch } = useChats()
  const toast = useToast()
  const [isSending, setIsSending] = useState(false)

  const send = async (text: string) => {
    if (!api) return false
    setIsSending(true)
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
      toast.show(e instanceof Error ? e.message : 'Не удалось отправить сообщение', 'error')
      return false
    } finally {
      setIsSending(false)
    }
  }

  return { send, isSending }
}

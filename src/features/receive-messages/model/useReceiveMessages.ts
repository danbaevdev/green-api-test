import { useEffect } from 'react'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'
import { parseNotification } from '../lib/parseNotification'

const RETRY_DELAY_MS = 3000

const sleep = (ms: number, signal: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })

/** Polls GREEN-API HTTP notification queue and feeds text messages into the chat store. */
export const useReceiveMessages = () => {
  const { api } = useSession()
  const { dispatch } = useChats()

  useEffect(() => {
    if (!api) return
    const controller = new AbortController()
    const { signal } = controller

    const poll = async () => {
      while (!signal.aborted) {
        try {
          const notification = await api.receiveNotification(signal)
          if (!notification) continue

          const parsed = parseNotification(notification.body)
          if (parsed) dispatch({ type: 'message/added', ...parsed })
          await api.deleteNotification(notification.receiptId)
        } catch {
          if (!signal.aborted) await sleep(RETRY_DELAY_MS, signal)
        }
      }
    }

    void poll()
    return () => controller.abort()
  }, [api, dispatch])
}

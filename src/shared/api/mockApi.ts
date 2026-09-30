import type { GreenApi, Notification } from './types'

const REPLY_DELAY_MS = 1500
const POLL_TIMEOUT_MS = 5000

const wait = (ms: number, signal?: AbortSignal) =>
  new Promise<void>((resolve) => {
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => {
      clearTimeout(timer)
      resolve()
    })
  })

/** Offline GREEN-API stand-in: every sent message gets an echo reply through the notification queue. */
export const createMockApi = (): GreenApi => {
  const queue: Notification[] = []
  let counter = 0

  const nextId = () => ++counter

  return {
    sendMessage: async ({ chatId, message }) => {
      const idMessage = `demo-${nextId()}`
      setTimeout(() => {
        queue.push({
          receiptId: nextId(),
          body: {
            typeWebhook: 'incomingMessageReceived',
            idMessage: `demo-in-${nextId()}`,
            timestamp: Math.floor(Date.now() / 1000),
            senderData: { chatId, senderName: chatId.split('@')[0] },
            messageData: {
              typeMessage: 'textMessage',
              textMessageData: { textMessage: `Эхо: ${message}` },
            },
          },
        })
      }, REPLY_DELAY_MS)
      return { idMessage }
    },

    getContactInfo: async (chatId) => ({
      name: `Демо ${chatId.split('@')[0].slice(-4)}`,
      contactName: '',
      avatar: '',
    }),

    receiveNotification: async (signal) => {
      const deadline = Date.now() + POLL_TIMEOUT_MS
      while (!queue.length && Date.now() < deadline && !signal?.aborted) {
        await wait(200, signal)
      }
      return queue[0] ?? null
    },

    deleteNotification: async (receiptId) => {
      const index = queue.findIndex((n) => n.receiptId === receiptId)
      if (index !== -1) queue.splice(index, 1)
      return { result: true }
    },
  }
}

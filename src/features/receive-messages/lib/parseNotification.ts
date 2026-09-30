import type { Message } from '@/entities/chat'
import type { NotificationBody } from '@/shared/api'

export interface ParsedMessage {
  message: Message
  chatTitle?: string
}

const DIRECTIONS: Record<string, Message['direction']> = {
  incomingMessageReceived: 'in',
  // sent from the phone/other device; messages sent via API are already added by SendMessage
  outgoingMessageReceived: 'out',
  outgoingAPIMessageReceived: 'out',
}

const extractText = ({ messageData }: NotificationBody) => {
  switch (messageData?.typeMessage) {
    case 'textMessage':
      return messageData.textMessageData?.textMessage
    case 'extendedTextMessage':
      return messageData.extendedTextMessageData?.text
    default:
      return undefined // only text messages are supported
  }
}

export const parseNotification = (body: NotificationBody): ParsedMessage | null => {
  const direction = DIRECTIONS[body.typeWebhook]
  const text = extractText(body)
  if (!direction || !text || !body.idMessage || !body.senderData) return null

  return {
    message: {
      id: body.idMessage,
      chatId: body.senderData.chatId,
      text,
      direction,
      timestamp: body.timestamp ?? Math.floor(Date.now() / 1000),
    },
    chatTitle: direction === 'in' ? body.senderData.senderName : undefined,
  }
}

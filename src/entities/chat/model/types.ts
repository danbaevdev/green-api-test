export type MessageDirection = 'in' | 'out'

export interface Message {
  id: string
  chatId: string
  text: string
  direction: MessageDirection
  /** unix seconds */
  timestamp: number
}

export interface Chat {
  id: string
  title: string
}

export interface ChatState {
  chats: Chat[]
  messages: Record<string, Message[]>
  activeChatId: string | null
}

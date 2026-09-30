import { chatIdToPhone } from '@/shared/lib'
import type { Chat, ChatState, Message } from './types'

export type ChatAction =
  | { type: 'chat/opened'; chat: Chat }
  | { type: 'chat/selected'; chatId: string }
  | { type: 'chat/closed' }
  | { type: 'message/added'; message: Message; chatTitle?: string }

export const initialChatState: ChatState = { chats: [], messages: {}, activeChatId: null }

const withChatOnTop = (chats: Chat[], chat: Chat) => [
  chat,
  ...chats.filter((c) => c.id !== chat.id),
]

export const chatReducer = (state: ChatState, action: ChatAction): ChatState => {
  switch (action.type) {
    case 'chat/opened':
      return {
        ...state,
        chats: state.chats.some((c) => c.id === action.chat.id)
          ? state.chats
          : withChatOnTop(state.chats, action.chat),
        activeChatId: action.chat.id,
      }

    case 'chat/selected':
      return { ...state, activeChatId: action.chatId }

    case 'chat/closed':
      return { ...state, activeChatId: null }

    case 'message/added': {
      const { message, chatTitle } = action
      const existing = state.messages[message.chatId] ?? []
      if (existing.some((m) => m.id === message.id)) return state // idempotent

      const known = state.chats.find((c) => c.id === message.chatId)
      const chat = known ?? { id: message.chatId, title: chatTitle || chatIdToPhone(message.chatId) }
      return {
        ...state,
        chats: withChatOnTop(state.chats, chat),
        messages: { ...state.messages, [message.chatId]: [...existing, message] },
      }
    }
  }
}

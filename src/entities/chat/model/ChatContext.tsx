import { createContext, use, useEffect, useMemo, useReducer, type ReactNode } from 'react'
import { readJson, writeJson } from '@/shared/lib'
import { chatReducer, initialChatState, type ChatAction } from './reducer'
import type { ChatState } from './types'

interface ChatValue {
  state: ChatState
  dispatch: (action: ChatAction) => void
}

const ChatContext = createContext<ChatValue | null>(null)

interface ChatProviderProps {
  /** History is persisted per GREEN-API instance: received notifications are deleted from the queue. */
  storageKey: string
  children: ReactNode
}

export const ChatProvider = ({ storageKey, children }: ChatProviderProps) => {
  const [state, dispatch] = useReducer(
    chatReducer,
    storageKey,
    (key) => readJson<ChatState>(key) ?? initialChatState,
  )

  useEffect(() => writeJson(storageKey, state), [storageKey, state])

  const value = useMemo(() => ({ state, dispatch }), [state])
  return <ChatContext value={value}>{children}</ChatContext>
}

const useChatContext = () => {
  const ctx = use(ChatContext)
  if (!ctx) throw new Error('Chat hooks must be used within ChatProvider')
  return ctx
}

export const useChats = () => {
  const { state, dispatch } = useChatContext()
  const activeChat = state.chats.find((c) => c.id === state.activeChatId) ?? null
  return {
    chats: state.chats,
    activeChat,
    messagesOf: (chatId: string) => state.messages[chatId] ?? [],
    lastMessageOf: (chatId: string) => state.messages[chatId]?.at(-1),
    dispatch,
  }
}

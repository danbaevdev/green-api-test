import { useChats } from '@/entities/chat'
import { useLoadChatProfiles } from '@/features/load-chat-profile'
import { useReceiveMessages } from '@/features/receive-messages'
import { ChatSidebar } from '@/widgets/chat-sidebar/ChatSidebar'
import { ChatWindow } from '@/widgets/chat-window/ChatWindow'
import styles from './ChatPage.module.css'

export const ChatPage = () => {
  useReceiveMessages()
  useLoadChatProfiles()
  const { activeChat } = useChats()

  return (
    <div className={styles.page} data-view={activeChat ? 'chat' : 'list'}>
      <ChatSidebar />
      <ChatWindow />
    </div>
  )
}

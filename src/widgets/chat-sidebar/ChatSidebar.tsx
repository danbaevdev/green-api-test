import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'
import { CreateChatForm } from '@/features/create-chat'
import { Avatar, Button } from '@/shared/ui'
import styles from './ChatSidebar.module.css'

export const ChatSidebar = () => {
  const { logout } = useSession()
  const { chats, activeChat, lastMessageOf, dispatch } = useChats()

  return (
    <aside className={styles.sidebar}>
      <header className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <Button variant="ghost" onClick={logout}>
          Выйти
        </Button>
      </header>

      <CreateChatForm />

      {chats.length === 0 ? (
        <p className={styles.empty}>Введите номер телефона, чтобы начать чат</p>
      ) : (
        <ul className={styles.list}>
          {chats.map((chat) => (
            <li key={chat.id}>
              <button
                type="button"
                className={`${styles.item} ${chat.id === activeChat?.id ? styles.active : ''}`}
                onClick={() => dispatch({ type: 'chat/selected', chatId: chat.id })}
              >
                <Avatar name={chat.title} src={chat.avatarUrl} />
                <div className={styles.info}>
                  <div className={styles.name}>{chat.title}</div>
                  <div className={styles.preview}>{lastMessageOf(chat.id)?.text ?? ' '}</div>
                </div>
              </button>
            </li>
          ))}
        </ul>
      )}
    </aside>
  )
}

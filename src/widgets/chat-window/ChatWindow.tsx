import { useEffect, useRef } from 'react'
import { useChats } from '@/entities/chat'
import { SendMessageForm } from '@/features/send-message'
import { formatTime } from '@/shared/lib'
import { Avatar, Button } from '@/shared/ui'
import styles from './ChatWindow.module.css'

export const ChatWindow = () => {
  const { activeChat, messagesOf, dispatch } = useChats()
  const bottomRef = useRef<HTMLDivElement>(null)
  const messages = activeChat ? messagesOf(activeChat.id) : []

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: 'end' })
  }, [messages.length, activeChat?.id])

  if (!activeChat) {
    return (
      <section className={styles.window}>
        <div className={styles.placeholder}>Выберите чат или создайте новый</div>
      </section>
    )
  }

  return (
    <section className={styles.window}>
      <header className={styles.header}>
        <Button
          variant="ghost"
          iconOnly
          className={styles.back}
          onClick={() => dispatch({ type: 'chat/closed' })}
          aria-label="Назад к чатам"
        >
          <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M15.4 5.4 14 4l-8 8 8 8 1.4-1.4L8.8 12z" />
          </svg>
        </Button>
        <Avatar name={activeChat.title} src={activeChat.avatarUrl} />
        {activeChat.title}
      </header>

      <div className={styles.messages}>
        {messages.map((m) => (
          <div key={m.id} className={`${styles.bubble} ${styles[m.direction]}`}>
            {m.text}
            <time className={styles.time}>{formatTime(m.timestamp)}</time>
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      <SendMessageForm key={activeChat.id} chatId={activeChat.id} />
    </section>
  )
}

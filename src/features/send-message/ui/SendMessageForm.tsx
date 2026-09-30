import { useState, type FormEvent } from 'react'
import { Button, Input } from '@/shared/ui'
import { useSendMessage } from '../model/useSendMessage'
import styles from './SendMessageForm.module.css'

export const SendMessageForm = ({ chatId }: { chatId: string }) => {
  const [text, setText] = useState('')
  const { send, isSending, error } = useSendMessage(chatId)

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    const trimmed = text.trim()
    if (!trimmed) return
    if (await send(trimmed)) setText('')
  }

  return (
    <div className={styles.wrapper}>
      {error && <p className={styles.error}>{error}</p>}
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Сообщение"
          aria-label="Сообщение"
        />
        <Button type="submit" iconOnly disabled={isSending || !text.trim()} aria-label="Отправить">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
            <path d="M3.4 20.4 21 12 3.4 3.6l-.01 6.5L15 12 3.39 13.9z" />
          </svg>
        </Button>
      </form>
    </div>
  )
}

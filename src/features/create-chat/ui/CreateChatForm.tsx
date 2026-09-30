import { useState, type FormEvent } from 'react'
import { useChats } from '@/entities/chat'
import { MAX_PHONE_LENGTH, isValidPhone, phoneToChatId, toDigits } from '@/shared/lib'
import { Button, Input } from '@/shared/ui'
import styles from './CreateChatForm.module.css'

export const CreateChatForm = () => {
  const { dispatch } = useChats()
  const [phone, setPhone] = useState('')
  const [error, setError] = useState<string>()

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    if (!isValidPhone(phone)) {
      setError('Введите номер в международном формате, например 79991234567')
      return
    }
    const digits = toDigits(phone)
    dispatch({ type: 'chat/opened', chat: { id: phoneToChatId(digits), title: digits } })
    setPhone('')
    setError(undefined)
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        value={phone}
        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))}
        placeholder="Номер телефона"
        aria-label="Номер телефона"
        type="tel"
        inputMode="numeric"
        maxLength={MAX_PHONE_LENGTH}
        error={error}
      />
      <Button type="submit">Создать</Button>
    </form>
  )
}

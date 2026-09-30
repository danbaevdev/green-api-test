import { useState, type FormEvent } from 'react'
import { MAX_PHONE_LENGTH } from '@/shared/lib'
import { Button, Input } from '@/shared/ui'
import { useCreateChat } from '../model/useCreateChat'
import styles from './CreateChatForm.module.css'

export const CreateChatForm = () => {
  const { create, isChecking } = useCreateChat()
  const [phone, setPhone] = useState('')

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault()
    if (await create(phone)) setPhone('')
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
      />
      <Button type="submit" disabled={isChecking || !phone}>
        {isChecking ? 'Проверяем…' : 'Создать'}
      </Button>
    </form>
  )
}

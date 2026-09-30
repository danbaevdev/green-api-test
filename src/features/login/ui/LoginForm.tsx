import { useState, type FormEvent } from 'react'
import { useSession } from '@/entities/session'
import { resolveApiUrl } from '@/shared/api'
import { Button, Input } from '@/shared/ui'
import styles from './LoginForm.module.css'

export const LoginForm = () => {
  const { login } = useSession()
  const [idInstance, setIdInstance] = useState('')
  const [apiTokenInstance, setApiTokenInstance] = useState('')
  const [apiUrl, setApiUrl] = useState('')

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault()
    login({
      idInstance: idInstance.trim(),
      apiTokenInstance: apiTokenInstance.trim(),
      apiUrl: apiUrl.trim() || resolveApiUrl(idInstance.trim()),
    })
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <Input
        label="idInstance"
        value={idInstance}
        onChange={(e) => setIdInstance(e.target.value)}
        inputMode="numeric"
        required
      />
      <Input
        label="apiTokenInstance"
        type="password"
        value={apiTokenInstance}
        onChange={(e) => setApiTokenInstance(e.target.value)}
        required
      />
      <Input
        label="apiUrl (необязательно, по умолчанию определяется по idInstance)"
        placeholder="https://7107.api.greenapi.com"
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
      />
      <Button type="submit" block>
        Войти
      </Button>
    </form>
  )
}

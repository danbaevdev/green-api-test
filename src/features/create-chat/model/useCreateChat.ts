import { useState } from 'react'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'
import { isValidPhone, phoneToChatId, toDigits } from '@/shared/lib'
import { useToast } from '@/shared/ui'

export const useCreateChat = () => {
  const { api } = useSession()
  const { dispatch } = useChats()
  const toast = useToast()
  const [isChecking, setIsChecking] = useState(false)

  /** Resolves `true` when the chat was opened. */
  const create = async (phone: string) => {
    if (!api) return false
    if (!isValidPhone(phone)) {
      toast.show('Введите номер в международном формате, например 79991234567', 'error')
      return false
    }

    const digits = toDigits(phone)
    setIsChecking(true)
    try {
      if (!(await api.isRegistered(digits))) {
        toast.show('Этот номер не зарегистрирован в мессенджере', 'error')
        return false
      }
      dispatch({ type: 'chat/opened', chat: { id: phoneToChatId(digits), title: digits } })
      return true
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Не удалось проверить номер', 'error')
      return false
    } finally {
      setIsChecking(false)
    }
  }

  return { create, isChecking }
}

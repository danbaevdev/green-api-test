import { useEffect, useRef } from 'react'
import { useChats } from '@/entities/chat'
import { useSession } from '@/entities/session'

/** Fetches display name and avatar once per chat per session. */
export const useLoadChatProfiles = () => {
  const { api } = useSession()
  const { chats, dispatch } = useChats()
  const requested = useRef(new Set<string>())

  useEffect(() => {
    if (!api) return
    for (const { id } of chats) {
      if (requested.current.has(id)) continue
      requested.current.add(id)

      api
        .getContactInfo(id)
        .then(({ contactName, name, avatar }) =>
          dispatch({
            type: 'chat/profileLoaded',
            chatId: id,
            title: contactName || name,
            avatarUrl: avatar,
          }),
        )
        .catch(() => requested.current.delete(id)) // retry on next chats change
    }
  }, [api, chats, dispatch])
}

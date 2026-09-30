import { useState } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  src?: string
}

const initials = (name: string) =>
  name.replace(/\D/g, '').slice(-2) || name.trim().slice(0, 1).toUpperCase()

export const Avatar = ({ name, src }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && src !== failedSrc

  return (
    <span className={styles.avatar} aria-hidden>
      {showImage ? (
        <img
          className={styles.image}
          src={src}
          alt=""
          referrerPolicy="no-referrer"
          onError={() => setFailedSrc(src)}
        />
      ) : (
        initials(name)
      )}
    </span>
  )
}

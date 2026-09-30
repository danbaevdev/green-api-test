import { useState, type CSSProperties } from 'react'
import styles from './Avatar.module.css'

interface AvatarProps {
  name: string
  src?: string
  /** px */
  size?: number
}

const initials = (name: string) =>
  name.replace(/\D/g, '').slice(-2) || name.trim().slice(0, 1).toUpperCase()

export const Avatar = ({ name, src, size = 44 }: AvatarProps) => {
  const [failedSrc, setFailedSrc] = useState<string>()
  const showImage = src && src !== failedSrc

  return (
    <span className={styles.avatar} style={{ '--avatar-size': `${size}px` } as CSSProperties} aria-hidden>
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

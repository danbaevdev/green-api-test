import styles from './Avatar.module.css'

export const Avatar = ({ name }: { name: string }) => (
  <span className={styles.avatar} aria-hidden>
    {name.replace(/\D/g, '').slice(-2) || name.slice(0, 1).toUpperCase()}
  </span>
)

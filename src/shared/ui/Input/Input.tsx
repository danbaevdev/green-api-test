import { useId, type InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
}

export const Input = ({ label, className, id, ...rest }: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input id={inputId} className={[styles.input, className].filter(Boolean).join(' ')} {...rest} />
    </div>
  )
}

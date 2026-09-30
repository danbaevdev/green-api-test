import { useId, type InputHTMLAttributes } from 'react'
import styles from './Input.module.css'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = ({ label, error, className, id, ...rest }: InputProps) => {
  const generatedId = useId()
  const inputId = id ?? generatedId
  const inputClasses = [styles.input, error && styles.invalid, className]

  return (
    <div className={styles.field}>
      {label && (
        <label className={styles.label} htmlFor={inputId}>
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={inputClasses.filter(Boolean).join(' ')}
        aria-invalid={Boolean(error)}
        {...rest}
      />
      {error && <span className={styles.error}>{error}</span>}
    </div>
  )
}

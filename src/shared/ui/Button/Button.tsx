import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  iconOnly?: boolean
  block?: boolean
  /** shows animated stripes and blocks interaction */
  loading?: boolean
}

export const Button = ({
  variant = 'primary',
  iconOnly,
  block,
  loading,
  disabled,
  className,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    iconOnly && styles.icon,
    block && styles.block,
    loading && styles.loading,
    className,
  ]
  return (
    <button
      type={type}
      className={classes.filter(Boolean).join(' ')}
      disabled={disabled || loading}
      aria-busy={loading}
      {...rest}
    />
  )
}

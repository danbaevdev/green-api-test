import type { ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost'
  iconOnly?: boolean
  block?: boolean
}

export const Button = ({
  variant = 'primary',
  iconOnly,
  block,
  className,
  type = 'button',
  ...rest
}: ButtonProps) => {
  const classes = [
    styles.button,
    styles[variant],
    iconOnly && styles.icon,
    block && styles.block,
    className,
  ]
  return <button type={type} className={classes.filter(Boolean).join(' ')} {...rest} />
}

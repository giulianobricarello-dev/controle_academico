import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { Loader2 } from 'lucide-react'
import { cx } from '../../lib/cx'

type Variant = 'primary' | 'secondary' | 'danger' | 'ghost'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  loading?: boolean
  icon?: ReactNode
}

const variants: Record<Variant, string> = {
  primary: 'bg-brand text-brand-ink hover:bg-brand/90',
  secondary: 'border border-line bg-surface text-ink hover:bg-canvas',
  danger: 'bg-danger text-danger-ink hover:bg-danger/90',
  ghost: 'text-muted hover:bg-canvas hover:text-ink',
}

export function Button({
  variant = 'primary',
  loading = false,
  icon,
  className,
  children,
  disabled,
  type = 'button',
  ...props
}: ButtonProps) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        'inline-flex h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 text-sm font-medium transition-colors',
        'disabled:cursor-not-allowed disabled:opacity-60',
        variants[variant],
        className,
      )}
      {...props}
    >
      {loading ? <Loader2 className="h-4 w-4 motion-safe:animate-spin" aria-hidden /> : icon}
      {children}
    </button>
  )
}

interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  label: string
  tone?: 'default' | 'danger'
}

export function IconButton({ label, tone = 'default', className, children, type = 'button', ...props }: IconButtonProps) {
  return (
    <button
      type={type}
      aria-label={label}
      title={label}
      className={cx(
        'inline-flex h-8 w-8 items-center justify-center rounded-md text-muted transition-colors',
        tone === 'danger' ? 'hover:bg-danger-soft hover:text-danger' : 'hover:bg-brand-soft hover:text-brand',
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}

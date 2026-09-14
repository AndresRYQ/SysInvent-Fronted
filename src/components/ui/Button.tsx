
import type { ComponentPropsWithRef } from 'react'
import '../../styles/maestros.css'

export type ButtonProps = ComponentPropsWithRef<'button'> & {
  variant?: 'primary' | 'secondary' | 'danger'
  loading?: boolean
}

export function Button({ variant = 'primary', loading = false, disabled, type = 'button', className = '', children, ...props }: ButtonProps) {
  return <button {...props} type={type} className={`btn maestro-btn-${variant} ${className}`} disabled={disabled || loading} aria-busy={loading || undefined}>
    {loading && <span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />}
    {children}
  </button>
}

import type { ReactNode } from 'react'
import '../../styles/maestros.css'

export interface FieldProps {
  label: string
  hint?: string
  error?: string
}

export function FormField({ id, label, hint, error, children }: FieldProps & { id: string; children: ReactNode }) {
  return <div>
    <label className="form-label maestro-label" htmlFor={id}>{label}</label>
    {children}
    {hint && <div id={`${id}-hint`} className="form-text">{hint}</div>}
    {error && <div id={`${id}-error`} className="invalid-feedback d-block" role="alert">{error}</div>}
  </div>
}

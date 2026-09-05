
import { useId, type ComponentPropsWithRef } from 'react'
import { FormField, type FieldProps } from './FormField'
import { fieldDescription } from './fieldDescription'

export type InputProps = ComponentPropsWithRef<'input'> & FieldProps

export function Input({ id: providedId, label, hint, error, className = '', 'aria-describedby': describedBy, ...props }: InputProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  return <FormField id={id} label={label} hint={hint} error={error}>
    <input {...props} id={id} className={`form-control maestro-control ${error ? 'is-invalid' : ''} ${className}`}
      aria-invalid={error ? true : props['aria-invalid']} aria-describedby={fieldDescription(id, hint, error, describedBy)} />
  </FormField>
}

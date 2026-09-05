
import { useId, type ComponentPropsWithRef } from 'react'
import { FormField, type FieldProps } from './FormField'
import { fieldDescription } from './fieldDescription'

export interface SelectOption { value: string; label: string; disabled?: boolean }
export type SelectProps = Omit<ComponentPropsWithRef<'select'>, 'children'> & FieldProps & { options: readonly SelectOption[] }

export function Select({ id: providedId, label, hint, error, options, className = '', 'aria-describedby': describedBy, ...props }: SelectProps) {
  const generatedId = useId()
  const id = providedId ?? generatedId
  return <FormField id={id} label={label} hint={hint} error={error}>
    <select {...props} id={id} className={`form-select maestro-control ${error ? 'is-invalid' : ''} ${className}`}
      aria-invalid={error ? true : props['aria-invalid']} aria-describedby={fieldDescription(id, hint, error, describedBy)}>
      {options.map((option) => <option key={option.value} value={option.value} disabled={option.disabled}>{option.label}</option>)}
    </select>
  </FormField>
}

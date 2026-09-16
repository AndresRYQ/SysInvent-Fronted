import DatePicker from 'react-datepicker'
import { createPortal } from 'react-dom'

import { Placeholder } from '../../constants/placeholders'

interface DatePickerInputProps {
  id: string
  value: string
  onChange: (value: string) => void
  className?: string
  minValue?: string
  maxValue?: string
  rangoEstricto?: boolean
}

function convertirFecha(fecha: string): Date | null {
  if (!fecha) {
    return null
  }

  const [anio, mes, dia] = fecha.split('-').map(Number)
  const resultado = new Date(anio, mes - 1, dia)

  return Number.isNaN(resultado.getTime()) ? null : resultado
}

function convertirFechaAValor(fecha: Date | null): string {
  if (!fecha) {
    return ''
  }

  return [
    fecha.getFullYear(),
    String(fecha.getMonth() + 1).padStart(2, '0'),
    String(fecha.getDate()).padStart(2, '0'),
  ].join('-')
}

function desplazarFecha(
  fecha: Date | null,
  dias: number,
): Date | undefined {
  if (!fecha) {
    return undefined
  }

  const resultado = new Date(fecha)
  resultado.setDate(resultado.getDate() + dias)
  return resultado
}

export function DatePickerInput({
  id,
  value,
  onChange,
  className = 'form-control maestro-control',
  minValue,
  maxValue,
  rangoEstricto = false,
}: DatePickerInputProps) {
  const minimo = convertirFecha(minValue ?? '')
  const maximo = convertirFecha(maxValue ?? '')

  return (
    <DatePicker
      id={id}
      className={className}
      selected={convertirFecha(value)}
      onChange={(fecha: Date | null) => onChange(convertirFechaAValor(fecha))}
      minDate={desplazarFecha(minimo, rangoEstricto ? 1 : 0)}
      maxDate={desplazarFecha(maximo, rangoEstricto ? -1 : 0)}
      dateFormat="dd/MM/yyyy"
      locale="es"
      placeholderText={Placeholder.Fecha}
      popperClassName="ingreso-datepicker-popper"
      popperContainer={(props) => createPortal(props.children, document.body)}
      autoComplete="off"
      isClearable
    />
  )
}

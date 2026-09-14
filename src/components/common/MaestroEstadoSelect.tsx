import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

interface MaestroEstadoSelectProps {
  inputId: string
  value: string
  onChange: (value: string) => void
}
const opcionesEstado = [
  { value: 'activo', label: 'Activo' },
  { value: 'inactivo', label: 'Inactivo' },
]

export function MaestroEstadoSelect({
  inputId,
  value,
  onChange,
}: MaestroEstadoSelectProps) {
  return (
    <Select
      inputId={inputId}
      options={opcionesEstado}
      value={
        opcionesEstado.find((opcion) => opcion.value === value) ?? null
      }
      onChange={(opcion) => onChange(opcion?.value ?? '')}
      placeholder="Seleccionar"
      isClearable
      isSearchable={false}
      styles={crearEstilosSelect({ zIndex: 10 })}
    />
  )
}

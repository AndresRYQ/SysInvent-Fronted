import Select from 'react-select'

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
      styles={{
        control: (provided, state) => ({
          ...provided,
          minHeight: '36px',
          height: '36px',
          borderRadius: '8px',
          border: '1px solid rgb(17 24 39 / 10%)',
          borderColor: state.isFocused
            ? 'rgb(51 143 60 / 55%)'
            : 'rgb(17 24 39 / 10%)',
          backgroundColor: state.isFocused ? '#fff' : '#f9fbfa',
          boxShadow: state.isFocused
            ? '0 0 0 0.22rem rgb(51 143 60 / 12%)'
            : 'none',
          '&:hover': {
            borderColor: state.isFocused
              ? 'rgb(51 143 60 / 55%)'
              : 'rgb(17 24 39 / 10%)',
          },
        }),
        valueContainer: (provided) => ({
          ...provided,
          padding: '0 12px',
          fontSize: '0.8rem',
        }),
        singleValue: (provided) => ({
          ...provided,
          color: '#344054',
          fontSize: '0.8rem',
        }),
        placeholder: (provided) => ({
          ...provided,
          color: '#667085',
          fontSize: '0.8rem',
        }),
        indicatorsContainer: (provided) => ({
          ...provided,
          height: '34px',
        }),
        menu: (provided) => ({ ...provided, zIndex: 10 }),
        option: (provided, state) => ({
          ...provided,
          fontSize: '0.8rem',
          backgroundColor: state.isSelected
            ? '#e9f8ee'
            : state.isFocused
              ? '#f3faf5'
              : '#fff',
          color: '#344054',
        }),
      }}
    />
  )
}

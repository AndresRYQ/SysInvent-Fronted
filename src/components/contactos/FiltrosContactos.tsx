import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import type { Proveedor } from '../../types/proveedor'

export interface FiltrosContactosValores { busqueda: string; proveedorId: string; estado: string }
interface Props { valores: FiltrosContactosValores; proveedores: Proveedor[]; onChange: (campo: keyof FiltrosContactosValores, valor: string) => void; onBuscar: () => void; onLimpiar: () => void }

const selectStyles = {
  control: (provided: any, state: any) => ({
    ...provided,
    minHeight: '36px',
    height: '36px',
    borderRadius: '8px',
    border: '1px solid rgb(17 24 39 / 10%)',
    borderColor: state.isFocused ? 'rgb(51 143 60 / 55%)' : 'rgb(17 24 39 / 10%)',
    backgroundColor: state.isFocused ? '#fff' : '#f9fbfa',
    boxShadow: state.isFocused ? '0 0 0 0.22rem rgb(51 143 60 / 12%)' : 'none',
    '&:hover': { borderColor: state.isFocused ? 'rgb(51 143 60 / 55%)' : 'rgb(17 24 39 / 10%)' },
  }),
  valueContainer: (provided: any) => ({ ...provided, padding: '0 12px', fontSize: '0.8rem' }),
  singleValue: (provided: any) => ({ ...provided, color: '#344054', fontSize: '0.8rem' }),
  placeholder: (provided: any) => ({ ...provided, color: '#667085', fontSize: '0.8rem' }),
  indicatorsContainer: (provided: any) => ({ ...provided, height: '34px' }),
  menu: (provided: any) => ({ ...provided, zIndex: 10 }),
  option: (provided: any, state: any) => ({
    ...provided,
    fontSize: '0.8rem',
    backgroundColor: state.isSelected ? '#e9f8ee' : state.isFocused ? '#f3faf5' : '#fff',
    color: '#344054',
  }),
}
const opcionesEstado = [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]

export function FiltrosContactos({ valores, proveedores, onChange, onBuscar, onLimpiar }: Props) {
  const opcionesProveedor = proveedores.map((proveedor) => ({ value: String(proveedor.id), label: proveedor.razonSocial }))
  return <section className="maestro-filter-card card border-0 shadow-sm"><div className="card-body p-3"><div className="mb-3"><span className="maestro-kicker"><Filter size={16} />Filtros</span></div><form className="row g-3" onSubmit={(event) => { event.preventDefault(); onBuscar() }}><div className="col-12 col-lg-5"><label className="form-label maestro-label" htmlFor="buscarContacto">Contacto</label><input id="buscarContacto" className="form-control" type="text" value={valores.busqueda} placeholder="Buscar" onChange={(event) => onChange('busqueda', event.target.value)} /></div><div className="col-12 col-md-6 col-lg-4"><label className="form-label maestro-label" htmlFor="proveedorContacto">Proveedor</label><Select inputId="proveedorContacto" options={opcionesProveedor} value={opcionesProveedor.find((opcion) => opcion.value === valores.proveedorId) ?? null} onChange={(opcion) => onChange('proveedorId', opcion?.value ?? '')} placeholder="Todos los proveedores" isClearable isSearchable styles={selectStyles} /></div><div className="col-12 col-md-6 col-lg-3"><label className="form-label maestro-label" htmlFor="estadoContacto">Estado</label><Select inputId="estadoContacto" options={opcionesEstado} value={opcionesEstado.find((opcion) => opcion.value === valores.estado) ?? null} onChange={(opcion) => onChange('estado', opcion?.value ?? '')} placeholder="Todos" isClearable isSearchable={false} styles={selectStyles} /></div><div className="col-12"><div className="maestro-filter-actions"><button type="button" className="btn maestro-btn-secondary maestro-filter-btn" onClick={onLimpiar}><RotateCcw size={18} />Limpiar</button><button type="submit" className="btn maestro-btn-primary maestro-filter-btn"><Search size={18} />Buscar</button></div></div></form></div></section>
}


import { Placeholder } from '../../constants/placeholders'
import { Filter, RotateCcw, Search } from 'lucide-react'
import Select from 'react-select'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'
import type { Proveedor } from '../../types/proveedor'

export interface FiltrosContactosValores { busqueda: string; proveedorId: string; estado: string }
interface Props { valores: FiltrosContactosValores; proveedores: Proveedor[]; onChange: (campo: keyof FiltrosContactosValores, valor: string) => void; onBuscar: () => void; onLimpiar: () => void }

const selectStyles = crearEstilosSelect({ zIndex: 10 })
const opcionesEstado = [{ value: 'activo', label: 'Activo' }, { value: 'inactivo', label: 'Inactivo' }]

export function FiltrosContactos({ valores, proveedores, onChange, onBuscar, onLimpiar }: Props) {
  const opcionesProveedor = proveedores.map((proveedor) => ({ value: String(proveedor.id), label: proveedor.razonSocial }))
  return <section className="maestro-filter-card card border-0 shadow-sm"><div className="card-body p-3"><div className="mb-3"><span className="maestro-kicker"><Filter size={16} />Filtros</span></div><form className="row g-3" onSubmit={(event) => { event.preventDefault(); onBuscar() }}><div className="col-12 col-lg-5"><label className="form-label" htmlFor="buscarContacto">Contacto</label><input id="buscarContacto" className="form-control" type="text" value={valores.busqueda} placeholder={Placeholder.Buscar} onChange={(event) => onChange('busqueda', event.target.value)} /></div><div className="col-12 col-md-6 col-lg-4"><label className="form-label" htmlFor="proveedorContacto">Proveedor</label><Select inputId="proveedorContacto" classNamePrefix="maestro-select" options={opcionesProveedor} value={opcionesProveedor.find((opcion) => opcion.value === valores.proveedorId) ?? null} onChange={(opcion) => onChange('proveedorId', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable menuPortalTarget={document.body} styles={selectStyles} /></div><div className="col-12 col-md-6 col-lg-3"><label className="form-label" htmlFor="estadoContacto">Estado</label><Select inputId="estadoContacto" classNamePrefix="maestro-select" options={opcionesEstado} value={opcionesEstado.find((opcion) => opcion.value === valores.estado) ?? null} onChange={(opcion) => onChange('estado', opcion?.value ?? '')} placeholder={Placeholder.Seleccionar} isClearable isSearchable={false} menuPortalTarget={document.body} styles={selectStyles} /></div><div className="col-12"><div className="maestro-filter-actions"><button type="button" className="btn btn-maestro-secondary" onClick={onLimpiar}><RotateCcw size={18} />Limpiar</button><button type="submit" className="btn btn-maestro-primary"><Search size={18} />Buscar</button></div></div></form></div></section>
}

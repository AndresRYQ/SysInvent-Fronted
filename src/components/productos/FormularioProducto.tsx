import { useEffect, useMemo, useState, type FormEvent } from 'react'
import Select from 'react-select'
import { obtenerProveedores } from '../../services/proveedorService'
import { obtenerTiposProducto } from '../../services/tipoProductoService'
import type { Producto, ProductoFormData } from '../../types/producto'
import { crearEstilosSelect } from '../../styles/reactSelectStyles'

interface Props {
  producto?: Producto | null
  soloLectura?: boolean
  error: string
  onSubmit: (datos: ProductoFormData) => void
  onCancelar: () => void
}

interface Opcion { id: string | number; nombre: string; estado?: boolean; activo?: 0 | 1 }
interface Errores { codigo: string; nombre: string; descripcion: string; tipoProductoId: string; categoriaId: string; unidadMedidaId: string; proveedorId: string; precioUnitario: string }

const CATEGORIAS: Opcion[] = [
  { id: 'CAT-001', nombre: 'Herramientas' },
  { id: 'CAT-002', nombre: 'Seguridad Industrial' },
  { id: 'CAT-003', nombre: 'Ferretería' },
  { id: 'CAT-004', nombre: 'Repuestos' },
  { id: 'CAT-005', nombre: 'Limpieza' },
]
const UNIDADES: Opcion[] = [
  { id: 'UM-001', nombre: 'Unidad' },
  { id: 'UM-002', nombre: 'Kilogramo' },
  { id: 'UM-003', nombre: 'Litro' },
  { id: 'UM-004', nombre: 'Metro' },
  { id: 'UM-005', nombre: 'Caja' },
]
const INICIAL: ProductoFormData = { codigo: '', nombre: '', descripcion: '', tipoProductoId: '', categoriaId: '', unidadMedidaId: '', proveedorId: '', stockMinimo: 0, precioUnitario: 0, estado: true }
const SIN_ERRORES: Errores = { codigo: '', nombre: '', descripcion: '', tipoProductoId: '', categoriaId: '', unidadMedidaId: '', proveedorId: '', precioUnitario: '' }

function opcionesLocales(clave: string, iniciales: Opcion[]): Opcion[] {
  try {
    const valor = localStorage.getItem(clave)
    if (!valor) return iniciales
    const datos = JSON.parse(valor)
    return Array.isArray(datos) ? datos : iniciales
  } catch { return iniciales }
}

function idCompatible(valor: string, id: string | number, prefijo: string): boolean {
  const texto = String(id)
  return valor === texto || valor === `${prefijo}${texto.padStart(3, '0')}`
}

function opcionesSelect(items: Opcion[]) {
  return items.map((item) => ({ value: String(item.id), label: item.nombre }))
}

export function FormularioProducto({ producto, soloLectura = false, error, onSubmit, onCancelar }: Props) {
  const [form, setForm] = useState<ProductoFormData>(INICIAL)
  const [errores, setErrores] = useState<Errores>(SIN_ERRORES)
  const tipos = useMemo(() => obtenerTiposProducto().filter((item) => item.activo === 1 || idCompatible(String(producto?.tipoProductoId ?? ''), item.id, 'TP-')), [producto])
  const proveedores = useMemo(() => obtenerProveedores().filter((item) => item.activo === 1 || idCompatible(String(producto?.proveedorId ?? ''), item.id, 'PROV-')), [producto])
  const categorias = useMemo(() => opcionesLocales('agrihusac_categorias', CATEGORIAS).filter((item) => item.estado !== false && item.activo !== 0 || String(item.id) === String(producto?.categoriaId)), [producto])
  const unidades = useMemo(() => opcionesLocales('agrihusac_unidades_medida', UNIDADES).filter((item) => item.estado !== false && item.activo !== 0 || String(item.id) === String(producto?.unidadMedidaId)), [producto])

  useEffect(() => {
    setForm(producto ? { codigo: producto.codigo, nombre: producto.nombre, descripcion: producto.descripcion, tipoProductoId: String(producto.tipoProductoId), categoriaId: String(producto.categoriaId), unidadMedidaId: String(producto.unidadMedidaId), proveedorId: String(producto.proveedorId), stockMinimo: producto.stockMinimo, precioUnitario: producto.precioUnitario, estado: producto.estado } : INICIAL)
    setErrores(SIN_ERRORES)
  }, [producto])

  function cambiar(campo: keyof ProductoFormData, valor: string | number | boolean): void {
    setForm((actual) => ({ ...actual, [campo]: valor }))
    if (campo in errores) setErrores((actual) => ({ ...actual, [campo]: '' }))
  }

  function validar(): boolean {
    const siguiente: Errores = { ...SIN_ERRORES }
    const codigo = form.codigo.trim().toUpperCase()
    if (!/^[A-Z0-9-]{3,30}$/.test(codigo)) siguiente.codigo = 'Utiliza entre 3 y 30 letras, números o guiones'
    if (form.nombre.trim().length < 2 || form.nombre.trim().length > 120) siguiente.nombre = 'El nombre debe tener entre 2 y 120 caracteres'
    if (form.descripcion.trim().length < 5 || form.descripcion.trim().length > 250) siguiente.descripcion = 'La descripción debe tener entre 5 y 250 caracteres'
    if (!form.tipoProductoId) siguiente.tipoProductoId = 'Selecciona un tipo de producto'
    if (!form.categoriaId) siguiente.categoriaId = 'Selecciona una categoría'
    if (!form.unidadMedidaId) siguiente.unidadMedidaId = 'Selecciona una unidad de medida'
    if (!form.proveedorId) siguiente.proveedorId = 'Selecciona un proveedor'
    if (!Number.isFinite(form.precioUnitario) || form.precioUnitario < 0) siguiente.precioUnitario = 'Ingresa un precio válido'
    setErrores(siguiente)
    return Object.values(siguiente).every((valor) => !valor)
  }

  function enviar(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault()
    if (!validar()) return
    onSubmit({ ...form, codigo: form.codigo.trim().toUpperCase(), nombre: form.nombre.trim(), descripcion: form.descripcion.trim() })
  }

  return (
    <form className="card border-0 shadow-sm" noValidate onSubmit={enviar}>
      <div className="maestro-modal-body">
        {error && <div className="alert alert-danger" role="alert">{error}</div>}
        <fieldset disabled={soloLectura}>
          <div className="row g-4">
            <div className="col-12 col-lg-4"><label className="form-label maestro-label required" htmlFor="productoCodigo">Código</label><input id="productoCodigo" className={`form-control maestro-control${errores.codigo ? ' maestro-control--error' : ''}`} maxLength={30} placeholder="Ej. HER-001" value={form.codigo} onChange={(e) => cambiar('codigo', e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ''))} />{errores.codigo && <div className="maestro-field-error">{errores.codigo}</div>}</div>
            <div className="col-12 col-lg-8"><label className="form-label maestro-label required" htmlFor="productoNombre">Nombre</label><input id="productoNombre" className={`form-control maestro-control${errores.nombre ? ' maestro-control--error' : ''}`} maxLength={120} placeholder="Nombre del producto" value={form.nombre} onChange={(e) => cambiar('nombre', e.target.value)} />{errores.nombre && <div className="maestro-field-error">{errores.nombre}</div>}</div>
            <div className="col-12 col-md-4"><label className="form-label maestro-label required" htmlFor="productoTipo">Tipo de producto</label><Select inputId="productoTipo" classNamePrefix="maestro-select" options={opcionesSelect(tipos)} value={opcionesSelect(tipos).find((item) => item.value === String(form.tipoProductoId)) ?? null} onChange={(item) => cambiar('tipoProductoId', item?.value ?? '')} placeholder="Seleccionar" isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ tieneError: Boolean(errores.tipoProductoId), zIndex: 1300 })} />{errores.tipoProductoId && <div className="maestro-field-error">{errores.tipoProductoId}</div>}</div>
            <div className="col-12 col-md-4"><label className="form-label maestro-label required" htmlFor="productoCategoria">Categoría</label><Select inputId="productoCategoria" classNamePrefix="maestro-select" options={opcionesSelect(categorias)} value={opcionesSelect(categorias).find((item) => item.value === String(form.categoriaId)) ?? null} onChange={(item) => cambiar('categoriaId', item?.value ?? '')} placeholder="Seleccionar" isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ tieneError: Boolean(errores.categoriaId), zIndex: 1300 })} />{errores.categoriaId && <div className="maestro-field-error">{errores.categoriaId}</div>}</div>
            <div className="col-12 col-md-4"><label className="form-label maestro-label required" htmlFor="productoUnidad">Unidad de medida</label><Select inputId="productoUnidad" classNamePrefix="maestro-select" options={opcionesSelect(unidades)} value={opcionesSelect(unidades).find((item) => item.value === String(form.unidadMedidaId)) ?? null} onChange={(item) => cambiar('unidadMedidaId', item?.value ?? '')} placeholder="Seleccionar" isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ tieneError: Boolean(errores.unidadMedidaId), zIndex: 1300 })} />{errores.unidadMedidaId && <div className="maestro-field-error">{errores.unidadMedidaId}</div>}</div>
            <div className="col-12 col-md-4"><label className="form-label maestro-label required" htmlFor="productoProveedor">Proveedor</label><Select inputId="productoProveedor" classNamePrefix="maestro-select" options={proveedores.map((item) => ({ value: String(item.id), label: item.razonSocial }))} value={proveedores.map((item) => ({ value: String(item.id), label: item.razonSocial })).find((item) => item.value === String(form.proveedorId) || idCompatible(String(form.proveedorId), item.value, 'PROV-')) ?? null} onChange={(item) => cambiar('proveedorId', item?.value ?? '')} placeholder="Seleccionar" isClearable isSearchable menuPortalTarget={document.body} styles={crearEstilosSelect({ tieneError: Boolean(errores.proveedorId), zIndex: 1300 })} />{errores.proveedorId && <div className="maestro-field-error">{errores.proveedorId}</div>}</div>
            <div className="col-12 col-lg-4"><label className="form-label maestro-label required" htmlFor="productoPrecio">Precio unitario</label><div className="input-group"><span className="input-group-text">S/</span><input id="productoPrecio" className={`form-control maestro-control${errores.precioUnitario ? ' maestro-control--error' : ''}`} type="number" min="0" step="0.01" value={form.precioUnitario} onChange={(e) => cambiar('precioUnitario', e.target.value === '' ? 0 : Number(e.target.value))} /></div>{errores.precioUnitario && <div className="maestro-field-error">{errores.precioUnitario}</div>}</div>
            <div className="col-12"><label className="form-label maestro-label required" htmlFor="productoDescripcion">Descripción</label><textarea id="productoDescripcion" className={`form-control maestro-control${errores.descripcion ? ' maestro-control--error' : ''}`} rows={4} maxLength={250} placeholder="Descripción del producto" value={form.descripcion} onChange={(e) => cambiar('descripcion', e.target.value)} />{errores.descripcion && <div className="maestro-field-error">{errores.descripcion}</div>}</div>
          </div>
        </fieldset>
      </div>
      {!soloLectura && <div className="maestro-modal-footer"><button type="button" className="btn btn-maestro-danger" onClick={onCancelar}>Cancelar</button><button type="submit" className="btn btn-maestro-primary">{producto ? 'Guardar cambios' : 'Registrar producto'}</button></div>}
    </form>
  )
}

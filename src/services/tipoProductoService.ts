import type { TipoProducto, TipoProductoFormData } from '../types/tipoProducto'
import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY = 'agrihusac_tipos_producto'
const TIPOS_PRODUCTO_INICIALES: TipoProducto[] = [
  { id: 1, nombre: 'Insumo', descripcion: 'Materia prima utilizada en los procesos.', activo: 1 },
  { id: 2, nombre: 'Producto terminado', descripcion: 'Artículos listos para su comercialización.', activo: 1 },
  { id: 3, nombre: 'Material de empaque', descripcion: 'Insumos para el embalaje de los productos.', activo: 1 },
  { id: 4, nombre: 'Repuesto', descripcion: 'Piezas de reemplazo para mantenimiento.', activo: 1 },
  { id: 5, nombre: 'Material de oficina', descripcion: 'Útiles y suministros para labores administrativas.', activo: 0 },
]
type RegistroGuardado = Partial<TipoProducto> & { estado?: boolean; id?: number | string }

function normalizarRegistro(registro: RegistroGuardado): TipoProducto | null {
  const id = typeof registro.id === 'number' ? registro.id : Number(String(registro.id ?? '').replace(/^TP-/, ''))
  if (!Number.isInteger(id) || id <= 0 || !registro.nombre) return null
  return { id, nombre: String(registro.nombre).trim(), descripcion: String(registro.descripcion ?? '').trim(), activo: registro.activo === 0 || registro.activo === 1 ? registro.activo : registro.estado === false ? 0 : 1 }
}

function leer(): TipoProducto[] {
  try {
    const datos: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]')
    return Array.isArray(datos) ? datos.map((item) => normalizarRegistro(item as RegistroGuardado)).filter((item): item is TipoProducto => item !== null) : []
  } catch { return [] }
}
function guardar(datos: TipoProducto[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(datos)) }
function normalizar(valor: string): string { return valor.trim().toLowerCase() }
function validar(datos: TipoProductoFormData): void {
  const nombre = datos.nombre.trim(); const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del tipo de producto es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 80) throw new Error('El nombre no puede superar los 80 caracteres.')
  if (!descripcion) throw new Error('La descripción es obligatoria.')
  if (descripcion.length > 250) throw new Error('La descripción no puede superar los 250 caracteres.')
}
export function obtenerTiposProducto(): TipoProducto[] { const guardados = leer(); const datos = (guardados.length ? guardados : TIPOS_PRODUCTO_INICIALES.map((item) => ({ ...item }))).sort((a, b) => a.id - b.id); guardar(datos); return datos.map((item) => ({ ...item })) }
export function crearTipoProducto(datos: TipoProductoFormData): TipoProducto {
  validar(datos); const lista = obtenerTiposProducto()
  if (lista.some((item) => normalizar(item.nombre) === normalizar(datos.nombre))) throw new Error('Ya existe un tipo de producto con ese nombre.')
  const nuevo: TipoProducto = { id: lista.reduce((max, item) => Math.max(max, item.id), 0) + 1, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), activo: 1 }
  guardar([...lista, nuevo].sort((a, b) => a.id - b.id)); registrarEventoBitacora({ modulo: 'Tipos de producto', accion: 'CREAR', detalle: `Se creó el tipo de producto "${nuevo.nombre}".`, registroId: String(nuevo.id) }); return nuevo
}
export function actualizarTipoProducto(id: number, datos: TipoProductoFormData): TipoProducto {
  validar(datos); const lista = obtenerTiposProducto(); const actual = lista.find((item) => item.id === id)
  if (!actual) throw new Error('El tipo de producto no existe.'); if (actual.activo === 0) throw new Error('Un tipo de producto inactivo solo puede visualizarse o reactivarse.')
  if (lista.some((item) => item.id !== id && normalizar(item.nombre) === normalizar(datos.nombre))) throw new Error('Ya existe otro tipo de producto con ese nombre.')
  const actualizado = { ...actual, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() }; guardar(lista.map((item) => item.id === id ? actualizado : item)); registrarEventoBitacora({ modulo: 'Tipos de producto', accion: 'EDITAR', detalle: `Se actualizó el tipo de producto "${actualizado.nombre}".`, registroId: String(id) }); return actualizado
}
export function eliminarTipoProducto(id: number): void { const lista = obtenerTiposProducto(); const actual = lista.find((item) => item.id === id); if (!actual) throw new Error('El tipo de producto no existe.'); guardar(lista.map((item) => item.id === id ? { ...item, activo: 0 as const } : item)); registrarEventoBitacora({ modulo: 'Tipos de producto', accion: 'ELIMINAR', detalle: `Se desactivó el tipo de producto "${actual.nombre}".`, registroId: String(id) }) }
export function reactivarTipoProducto(id: number): TipoProducto { const lista = obtenerTiposProducto(); const actual = lista.find((item) => item.id === id); if (!actual) throw new Error('El tipo de producto no existe.'); const resultado = { ...actual, activo: 1 as const }; guardar(lista.map((item) => item.id === id ? resultado : item)); registrarEventoBitacora({ modulo: 'Tipos de producto', accion: 'EDITAR', detalle: `Se reactivó el tipo de producto "${actual.nombre}".`, registroId: String(id) }); return resultado }

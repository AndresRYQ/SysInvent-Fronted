import type { Categoria, CategoriaFormData } from '../types/categoria'
import { obtenerProductos } from './productoService'
import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY = 'agrihusac_categorias'
const CATEGORIAS_INICIALES: Categoria[] = [
  { id: 1, nombre: 'Herramientas', descripcion: 'Implementos y accesorios de uso técnico.', activo: 1, fechaRegistro: '10/08/2026' },
  { id: 2, nombre: 'Seguridad Industrial', descripcion: 'Equipos para protección personal.', activo: 1, fechaRegistro: '11/08/2026' },
  { id: 3, nombre: 'Ferretería', descripcion: 'Materiales y piezas de soporte operativo.', activo: 1, fechaRegistro: '12/08/2026' },
  { id: 4, nombre: 'Repuestos', descripcion: 'Piezas de reemplazo para mantenimiento.', activo: 1, fechaRegistro: '13/08/2026' },
  { id: 5, nombre: 'Limpieza', descripcion: 'Insumos para orden e higiene del almacén.', activo: 1, fechaRegistro: '14/08/2026' },
]
type RegistroGuardado = Partial<Categoria> & { estado?: boolean; id?: number | string }

function normalizarRegistro(registro: RegistroGuardado): Categoria | null {
  const id = typeof registro.id === 'number' ? registro.id : Number(String(registro.id ?? '').replace(/^CAT-/, ''))
  if (!Number.isInteger(id) || id <= 0 || !registro.nombre) return null
  return {
    id,
    nombre: String(registro.nombre).trim(),
    descripcion: String(registro.descripcion ?? '').trim(),
    activo: registro.activo === 0 || registro.activo === 1 ? registro.activo : registro.estado === false ? 0 : 1,
  }
}

function leerCategorias(): Categoria[] {
  try {
    const contenido = localStorage.getItem(STORAGE_KEY)
    if (!contenido) return []
    const datos: unknown = JSON.parse(contenido)
    if (!Array.isArray(datos)) return []
    return datos.map((item) => normalizarRegistro(item as RegistroGuardado)).filter((item): item is Categoria => item !== null)
  } catch { return [] }
}

function guardarCategorias(categorias: Categoria[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(categorias))
}

function normalizarTexto(valor: string): string { return valor.trim().toLowerCase() }

function validarDatos(datos: CategoriaFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre de la categoría es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 80) throw new Error('El nombre no puede superar los 80 caracteres.')
  if (!descripcion) throw new Error('La descripción es obligatoria.')
  if (descripcion.length > 200) throw new Error('La descripción no puede superar los 200 caracteres.')
}

export function obtenerCategorias(): Categoria[] {
  const guardadas = leerCategorias()
  const categorias = (guardadas.length ? guardadas : CATEGORIAS_INICIALES.map((item) => ({ ...item }))).sort((a, b) => a.id - b.id)
  guardarCategorias(categorias)
  return categorias.map((categoria) => ({ ...categoria }))
}

export function crearCategoria(datos: CategoriaFormData): Categoria {
  validarDatos(datos)
  const categorias = obtenerCategorias()
  if (categorias.some((categoria) => normalizarTexto(categoria.nombre) === normalizarTexto(datos.nombre))) throw new Error('Ya existe una categoría con ese nombre.')
  const nueva: Categoria = {
    id: categorias.reduce((mayor, categoria) => Math.max(mayor, categoria.id), 0) + 1,
    nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), activo: 1,
  }
  guardarCategorias([...categorias, nueva].sort((a, b) => a.id - b.id))
  registrarEventoBitacora({ modulo: 'Categorías', accion: 'CREAR', detalle: `Se creó la categoría "${nueva.nombre}".`, registroId: String(nueva.id) })
  return { ...nueva }
}

export function actualizarCategoria(id: number, datos: CategoriaFormData): Categoria {
  validarDatos(datos)
  const categorias = obtenerCategorias()
  const actual = categorias.find((categoria) => categoria.id === id)
  if (!actual) throw new Error('La categoría no existe.')
  if (actual.activo === 0) throw new Error('Una categoría inactiva solo puede visualizarse o reactivarse.')
  if (categorias.some((categoria) => categoria.id !== id && normalizarTexto(categoria.nombre) === normalizarTexto(datos.nombre))) throw new Error('Ya existe otra categoría con ese nombre.')
  const actualizada: Categoria = { ...actual, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() }
  guardarCategorias(categorias.map((categoria) => categoria.id === id ? actualizada : categoria))
  registrarEventoBitacora({ modulo: 'Categorías', accion: 'EDITAR', detalle: `Se actualizó la categoría "${actualizada.nombre}".`, registroId: String(actualizada.id) })
  return { ...actualizada }
}

export function eliminarCategoria(id: number): void {
  const categorias = obtenerCategorias()
  const actual = categorias.find((categoria) => categoria.id === id)
  if (!actual) throw new Error('La categoría no existe.')
  if (obtenerProductos().some((producto) => String(producto.categoriaId) === String(id))) throw new Error('No puedes eliminar esta categoría porque está asignada a uno o más productos. Puedes desactivarla.')
  guardarCategorias(categorias.map((categoria) => categoria.id === id ? { ...categoria, activo: 0 as const } : categoria))
  registrarEventoBitacora({ modulo: 'Categorías', accion: 'ELIMINAR', detalle: `Se desactivó la categoría "${actual.nombre}".`, registroId: String(actual.id) })
}

export function reactivarCategoria(id: number): Categoria {
  const categorias = obtenerCategorias()
  const actual = categorias.find((categoria) => categoria.id === id)
  if (!actual) throw new Error('La categoría no existe.')
  const reactivada: Categoria = { ...actual, activo: 1 }
  guardarCategorias(categorias.map((categoria) => categoria.id === id ? reactivada : categoria))
  registrarEventoBitacora({ modulo: 'Categorías', accion: 'EDITAR', detalle: `Se reactivó la categoría "${actual.nombre}".`, registroId: String(actual.id) })
  return { ...reactivada }
}

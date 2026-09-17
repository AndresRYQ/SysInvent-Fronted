import type { CentroCosto, CentroCostoFormData } from '../types/centroCosto'
import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY = 'agrihusac_centros_costo'
const VALES_STORAGE_KEY = 'agrihusac_vales_consumo'
const CENTROS_INICIALES: CentroCosto[] = [
  { id: 1, nombre: 'Administración', descripcion: 'Gestión general y dirección de la organización.', activo: 1 },
  { id: 2, nombre: 'Producción', descripcion: 'Procesos productivos y operaciones de planta.', activo: 1 },
  { id: 3, nombre: 'Mantenimiento', descripcion: 'Conservación de equipos e instalaciones.', activo: 1 },
  { id: 4, nombre: 'Logística', descripcion: 'Almacenamiento y distribución de materiales.', activo: 1 },
  { id: 5, nombre: 'Ventas', descripcion: 'Comercialización y atención de clientes.', activo: 0 },
]

type RegistroGuardado = Partial<CentroCosto> & { estado?: boolean; id?: number | string }

function normalizarRegistro(registro: RegistroGuardado): CentroCosto | null {
  const id = typeof registro.id === 'number'
    ? registro.id
    : Number(String(registro.id ?? '').replace(/^CC-/, ''))
  if (!Number.isInteger(id) || id <= 0 || !registro.nombre) return null
  return {
    id,
    nombre: String(registro.nombre).trim(),
    descripcion: String(registro.descripcion ?? '').trim(),
    activo: registro.activo === 0 || registro.activo === 1
      ? registro.activo
      : registro.estado === false ? 0 : 1,
  }
}

function leerCentrosGuardados(): CentroCosto[] {
  try {
    const contenido = localStorage.getItem(STORAGE_KEY)
    if (!contenido) return []
    const datos: unknown = JSON.parse(contenido)
    if (!Array.isArray(datos)) return []
    return datos
      .map((registro) => normalizarRegistro(registro as RegistroGuardado))
      .filter((registro): registro is CentroCosto => registro !== null)
  } catch {
    return []
  }
}

function guardarCentros(centros: CentroCosto[]): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(centros))
}

function normalizarTexto(valor: string): string {
  return valor.trim().toLowerCase()
}

function validarDatos(datos: CentroCostoFormData): void {
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()
  if (!nombre) throw new Error('El nombre del centro de costo es obligatorio.')
  if (nombre.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.')
  if (nombre.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.')
  if (!descripcion) throw new Error('La descripción es obligatoria.')
  if (descripcion.length > 250) throw new Error('La descripción no puede superar los 250 caracteres.')
}

function centroCostoEstaEnUso(id: number): boolean {
  try {
    const vales = JSON.parse(localStorage.getItem(VALES_STORAGE_KEY) ?? '[]')
    return Array.isArray(vales) && vales.some((vale) => String(vale?.centroCostoId) === String(id))
  } catch {
    return false
  }
}

export function obtenerCentrosCosto(): CentroCosto[] {
  const guardados = leerCentrosGuardados()
  const centros = (guardados.length ? guardados : CENTROS_INICIALES.map((item) => ({ ...item }))).sort((a, b) => a.id - b.id)
  guardarCentros(centros)
  return centros.map((centro) => ({ ...centro }))
}

export function crearCentroCosto(datos: CentroCostoFormData): CentroCosto {
  validarDatos(datos)
  const centros = obtenerCentrosCosto()
  if (centros.some((centro) => normalizarTexto(centro.nombre) === normalizarTexto(datos.nombre))) {
    throw new Error('Ya existe un centro de costo con ese nombre.')
  }
  const nuevo: CentroCosto = {
    id: centros.reduce((mayor, centro) => Math.max(mayor, centro.id), 0) + 1,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    activo: 1,
  }
  guardarCentros([...centros, nuevo].sort((a, b) => a.id - b.id))
  registrarEventoBitacora({ modulo: 'Centros de costo', accion: 'CREAR', detalle: `Se creó el centro de costo "${nuevo.nombre}".`, registroId: String(nuevo.id) })
  return { ...nuevo }
}

export function actualizarCentroCosto(id: number, datos: CentroCostoFormData): CentroCosto {
  validarDatos(datos)
  const centros = obtenerCentrosCosto()
  const actual = centros.find((centro) => centro.id === id)
  if (!actual) throw new Error('El centro de costo no existe.')
  if (actual.activo === 0) throw new Error('Un centro de costo inactivo solo puede visualizarse o reactivarse.')
  if (centros.some((centro) => centro.id !== id && normalizarTexto(centro.nombre) === normalizarTexto(datos.nombre))) {
    throw new Error('Ya existe otro centro de costo con ese nombre.')
  }
  const actualizado: CentroCosto = { ...actual, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() }
  guardarCentros(centros.map((centro) => centro.id === id ? actualizado : centro))
  registrarEventoBitacora({ modulo: 'Centros de costo', accion: 'EDITAR', detalle: `Se actualizó el centro de costo "${actualizado.nombre}".`, registroId: String(actualizado.id) })
  return { ...actualizado }
}

export function eliminarCentroCosto(id: number): void {
  const centros = obtenerCentrosCosto()
  const actual = centros.find((centro) => centro.id === id)
  if (!actual) throw new Error('El centro de costo no existe.')
  if (centroCostoEstaEnUso(id)) throw new Error('No puedes eliminar este centro de costo porque está asignado a uno o más vales. Puedes desactivarlo.')
  guardarCentros(centros.map((centro) => centro.id === id ? { ...centro, activo: 0 as const } : centro))
  registrarEventoBitacora({ modulo: 'Centros de costo', accion: 'ELIMINAR', detalle: `Se desactivó el centro de costo "${actual.nombre}".`, registroId: String(actual.id) })
}

export function reactivarCentroCosto(id: number): CentroCosto {
  const centros = obtenerCentrosCosto()
  const actual = centros.find((centro) => centro.id === id)
  if (!actual) throw new Error('El centro de costo no existe.')
  const reactivado: CentroCosto = { ...actual, activo: 1 }
  guardarCentros(centros.map((centro) => centro.id === id ? reactivado : centro))
  registrarEventoBitacora({ modulo: 'Centros de costo', accion: 'EDITAR', detalle: `Se reactivó el centro de costo "${actual.nombre}".`, registroId: String(actual.id) })
  return { ...reactivado }
}

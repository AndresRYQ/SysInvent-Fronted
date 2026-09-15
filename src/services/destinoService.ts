import type { Destino, DestinoFormData } from '../types/destino'
import { registrarEventoBitacora } from './bitacoraService'
const STORAGE_KEY = 'agrihusac_destinos'
const VALES_STORAGE_KEY = 'agrihusac_vales_consumo'
type RegistroGuardado = Partial<Destino> & { id?: number | string; estado?: boolean }
function normalizarRegistro(r: RegistroGuardado): Destino | null { const id = typeof r.id === 'number' ? r.id : Number(String(r.id ?? '').replace(/^DES-/, '')); if (!Number.isInteger(id) || id <= 0 || !String(r.nombre ?? '').trim()) return null; return { id, nombre: String(r.nombre).trim(), descripcion: String(r.descripcion ?? '').trim(), activo: r.activo === 0 || r.activo === 1 ? r.activo : r.estado === false ? 0 : 1 } }
function leer(): Destino[] { try { const datos: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); return Array.isArray(datos) ? datos.map((item) => normalizarRegistro(item as RegistroGuardado)).filter((item): item is Destino => item !== null) : [] } catch { return [] } }
function guardar(datos: Destino[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(datos)) }
function normalizar(v: string): string { return v.trim().toLowerCase() }
function validar(datos: DestinoFormData): void { const n = datos.nombre.trim(); const d = datos.descripcion.trim(); if (!n) throw new Error('El nombre del destino es obligatorio.'); if (n.length < 2) throw new Error('El nombre debe tener al menos 2 caracteres.'); if (n.length > 100) throw new Error('El nombre no puede superar los 100 caracteres.'); if (!d) throw new Error('La descripción es obligatoria.'); if (d.length > 250) throw new Error('La descripción no puede superar los 250 caracteres.') }
export function obtenerDestinos(): Destino[] { const datos = leer().sort((a, b) => a.id - b.id); guardar(datos); return datos.map((item) => ({ ...item })) }
export function crearDestino(datos: DestinoFormData): Destino { validar(datos); const lista = obtenerDestinos(); if (lista.some((i) => normalizar(i.nombre) === normalizar(datos.nombre))) throw new Error('Ya existe un destino con ese nombre.'); const nuevo: Destino = { id: lista.reduce((max, i) => Math.max(max, i.id), 0) + 1, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim(), activo: 1 }; guardar([...lista, nuevo].sort((a, b) => a.id - b.id)); registrarEventoBitacora({ modulo: 'Destinos', accion: 'CREAR', detalle: `Se creó el destino "${nuevo.nombre}".`, registroId: String(nuevo.id) }); return nuevo }
export function actualizarDestino(id: number, datos: DestinoFormData): Destino { validar(datos); const lista = obtenerDestinos(); const actual = lista.find((i) => i.id === id); if (!actual) throw new Error('El destino no existe.'); if (actual.activo === 0) throw new Error('Un destino inactivo solo puede visualizarse o reactivarse.'); if (lista.some((i) => i.id !== id && normalizar(i.nombre) === normalizar(datos.nombre))) throw new Error('Ya existe otro destino con ese nombre.'); const actualizado = { ...actual, nombre: datos.nombre.trim(), descripcion: datos.descripcion.trim() }; guardar(lista.map((i) => i.id === id ? actualizado : i)); registrarEventoBitacora({ modulo: 'Destinos', accion: 'EDITAR', detalle: `Se actualizó el destino "${actualizado.nombre}".`, registroId: String(id) }); return actualizado }
function destinoEstaEnUso(id: number): boolean {
  try {
    const datos: unknown = JSON.parse(
      localStorage.getItem(VALES_STORAGE_KEY) ?? '[]',
    )

    if (!Array.isArray(datos)) return false

    return datos.some((vale) => {
      if (typeof vale !== 'object' || vale === null) return false
      const detalles = (vale as { detalles?: unknown }).detalles
      if (!Array.isArray(detalles)) return false

      return detalles.some((detalle) => {
        if (typeof detalle !== 'object' || detalle === null) return false
        const distribuciones = (
          detalle as { distribuciones?: unknown }
        ).distribuciones
        if (!Array.isArray(distribuciones)) return false

        return distribuciones.some((distribucion) => {
          if (
            typeof distribucion !== 'object' ||
            distribucion === null
          ) return false

          return (
            (distribucion as { destinoId?: unknown }).destinoId ===
            String(id)
          )
        })
      })
    })
  } catch {
    return false
  }
}

export function eliminarDestino(id: number): void {
  const lista = obtenerDestinos()
  const actual = lista.find((i) => i.id === id)
  if (!actual) throw new Error('El destino no existe.')

  if (destinoEstaEnUso(id)) {
    throw new Error(
      'No puedes eliminar este destino porque está utilizado en uno o más vales de consumo. Puedes desactivarlo.',
    )
  }

  guardar(
    lista.map((i) =>
      i.id === id ? { ...i, activo: 0 as const } : i,
    ),
  )
  registrarEventoBitacora({
    modulo: 'Destinos',
    accion: 'ELIMINAR',
    detalle: `Se desactivó el destino "${actual.nombre}".`,
    registroId: String(id),
  })
}
export function reactivarDestino(id: number): Destino { const lista = obtenerDestinos(); const actual = lista.find((i) => i.id === id); if (!actual) throw new Error('El destino no existe.'); const resultado = { ...actual, activo: 1 as const }; guardar(lista.map((i) => i.id === id ? resultado : i)); registrarEventoBitacora({ modulo: 'Destinos', accion: 'EDITAR', detalle: `Se reactivó el destino "${actual.nombre}".`, registroId: String(id) }); return resultado }

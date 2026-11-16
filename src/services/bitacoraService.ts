import type {
  RegistroBitacora,
} from '../types/bitacora'
import { apiFetch } from './api'

interface BitacoraBackend {
  bitacoraId?: number
  modulo?: string
  accion?: string
  detalle?: string
  fechaHora?: string
  nombreUsuario?: string
  nombreRol?: string
  registroId?: string | null
}

interface PaginaBitacoraBackend {
  datos?: BitacoraBackend[]
  paginacion?: {
    totalElementos?: number
  }
}

export interface FiltrosBitacoraBackend {
  busqueda?: string
  modulo?: string
  accion?: string
  fechaDesde?: string
  fechaHasta?: string
  pagina: number
  tamPagina: number
}

export async function listarBitacoraBackend(
  filtros: FiltrosBitacoraBackend,
): Promise<{ datos: RegistroBitacora[]; total: number }> {
  const parametros = new URLSearchParams({
    pagina: String(filtros.pagina),
    tamPagina: String(filtros.tamPagina),
  })

  if (filtros.busqueda) parametros.set('busqueda', filtros.busqueda)
  if (filtros.modulo) parametros.set('modulo', filtros.modulo)
  if (filtros.accion) parametros.set('accion', filtros.accion)
  if (filtros.fechaDesde) parametros.set('fechaDesde', filtros.fechaDesde)
  if (filtros.fechaHasta) parametros.set('fechaHasta', filtros.fechaHasta)

  const respuesta = await apiFetch<PaginaBitacoraBackend>(
    `/api/bitacora?${parametros.toString()}`,
  )

  const datos = (respuesta.datos ?? []).map((registro, indice) => ({
    id:
    registro.bitacoraId !== undefined
      ? `BIT-${registro.bitacoraId}`
      : `BIT-${filtros.pagina}-${indice}`,
    fechaHora: registro.fechaHora ?? '',
    usuario: registro.nombreUsuario ?? '',
    nombreCompleto: registro.nombreUsuario ?? '',
    rol: registro.nombreRol ?? '',
    modulo: registro.modulo ?? '',
    accion: (registro.accion ?? 'EDITAR') as RegistroBitacora['accion'],
    detalle: registro.detalle ?? '',
    registroId: registro.registroId ?? null,
  }))

  return {
    datos,
    total: respuesta.paginacion?.totalElementos ?? datos.length,
  }
}

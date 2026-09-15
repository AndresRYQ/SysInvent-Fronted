import type {
  EventoBitacoraInput,
  RegistroBitacora,
} from '../types/bitacora'

import type { SesionUsuario } from '../types/auth'

const STORAGE_KEY = 'agrihusac_bitacora'
const SESION_STORAGE_KEY = 'agrihusac_sesion'
const MAXIMO_REGISTROS = 2000

interface ActorBitacora {
  usuario: string
  nombreCompleto: string
  rol: string
}

function copiarRegistros(
  registros: RegistroBitacora[],
): RegistroBitacora[] {
  return registros.map((registro) => ({
    ...registro,
  }))
}

function guardarRegistros(
  registros: RegistroBitacora[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(
      registros.slice(0, MAXIMO_REGISTROS),
    ),
  )
}

function obtenerActorSesion(): ActorBitacora {
  try {
    const sesionGuardada =
      localStorage.getItem(SESION_STORAGE_KEY)

    if (!sesionGuardada) {
      return {
        usuario: 'sistema',
        nombreCompleto: 'Sistema',
        rol: 'Sin sesión',
      }
    }

    const sesion = JSON.parse(
      sesionGuardada,
    ) as Partial<SesionUsuario>

    return {
      usuario:
        sesion.usuario?.trim() || 'sistema',
      nombreCompleto:
        sesion.nombreCompleto?.trim() ||
        'Sistema',
      rol:
        sesion.rol?.trim() || 'Sin rol',
    }
  } catch {
    return {
      usuario: 'sistema',
      nombreCompleto: 'Sistema',
      rol: 'Sin sesión',
    }
  }
}

function crearIdRegistro(): string {
  const identificador =
    typeof crypto.randomUUID === 'function'
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random()
          .toString(16)
          .slice(2)}`

  return `BIT-${identificador}`
}

export function obtenerRegistrosBitacora():
  RegistroBitacora[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    return []
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      return []
    }

    return copiarRegistros(
      datos as RegistroBitacora[],
    )
  } catch {
    return []
  }
}

export function registrarEventoBitacora(
  evento: EventoBitacoraInput,
): RegistroBitacora {
  const actorSesion = obtenerActorSesion()

  const nuevoRegistro: RegistroBitacora = {
    id: crearIdRegistro(),
    fechaHora: new Date().toISOString(),
    usuario:
      evento.usuario?.trim() ||
      actorSesion.usuario,
    nombreCompleto:
      evento.nombreCompleto?.trim() ||
      actorSesion.nombreCompleto,
    rol:
      evento.rol?.trim() ||
      actorSesion.rol,
    modulo: evento.modulo.trim(),
    accion: evento.accion,
    detalle:
      evento.detalle.trim().slice(0, 500),
    registroId:
      evento.registroId?.trim() || null,
  }

  guardarRegistros([
    nuevoRegistro,
    ...obtenerRegistrosBitacora(),
  ])

  return { ...nuevoRegistro }
}
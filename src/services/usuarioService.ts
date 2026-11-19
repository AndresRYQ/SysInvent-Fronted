import { apiFetch } from './api'
import type {
  UsuarioLogin,
} from '../types/auth'
import type {
  UsuarioFormData,
} from '../types/usuario'


export interface ResultadoUsuariosBackend {
  usuarios: UsuarioLogin[]
  totalItems: number
}

interface UsuarioBackend {
  usuarioId?: number
  usuario?: string
  dni?: string
  nombres?: string
  apePaterno?: string
  apeMaterno?: string
  nombreCompleto?: string
  correo?: string
  rolId?: number
  nombreRol?: string
  descripcionRol?: string
  estado?: boolean
  estadoDsc?: string
}

interface PaginaUsuariosBackend {
  datos?: UsuarioBackend[]
  paginacion?: {
    numeroPagina?: number
    tamanioPagina?: number
    totalElementos?: number
  }
}

export async function obtenerUsuariosBackend(
  usuario = '',
  rol = '',
  estado?: boolean,
  pagina = 1,
  tamPagina = 100,
): Promise<ResultadoUsuariosBackend> {
  const parametros = new URLSearchParams({
    pagina: String(pagina),
    tamPagina: String(tamPagina),
  })

  if (usuario.trim()) {
    parametros.set(
      'usuario',
      usuario.trim(),
    )
  }

  if (rol.trim()) {
    parametros.set(
      'rol',
      rol.trim(),
    )
  }

  if (estado !== undefined) {
    parametros.set(
      'estado',
      String(estado),
    )
  }

  const respuesta =
    await apiFetch<PaginaUsuariosBackend>(
      `/api/usuarios?${parametros.toString()}`,
    )

  const usuarios = (
    respuesta.datos ?? []
  )
    .filter(
      (item) =>
        item.usuarioId !== undefined,
    )
    .map((item): UsuarioLogin => ({
        id: String(item.usuarioId),
        usuario: item.usuario ?? '',
        dni: item.dni ?? '',
        nombres: item.nombres ?? '',
        apePaterno:
          item.apePaterno ?? '',
        apeMaterno:
          item.apeMaterno ?? '',
        nombreCompleto:
          item.nombreCompleto ?? '',
        email: item.correo ?? '',
        contrasena: '',
        rolId: item.rolId ?? null,
        rol:
          item.nombreRol ??
          item.descripcionRol ??
          '',
        estado: item.estado ?? false,
      }))

  return {
    usuarios,
    totalItems:
      respuesta.paginacion
        ?.totalElementos ??
      usuarios.length,
  }
}

interface MensajeUsuarioBackend {
  success?: boolean
  message?: string
  status?: number
  data?: unknown
}

export async function crearUsuarioBackend(
  datos: UsuarioFormData,
): Promise<void> {
  const dni =
    (datos.dni ?? datos.usuario).trim()

  const nombres =
    (datos.nombres ?? '').trim()

  const apePaterno =
    (datos.apePaterno ?? '').trim()

  const apeMaterno =
    (datos.apeMaterno ?? '').trim()

  if (!/^\d{8}$/.test(dni)) {
    throw new Error(
      'El DNI debe contener 8 números.',
    )
  }

  if (
    !nombres ||
    !apePaterno ||
    !apeMaterno
  ) {
    throw new Error(
      'Completa los nombres y apellidos.',
    )
  }

  if (!datos.rolId) {
    throw new Error(
      'Selecciona un rol.',
    )
  }

  const respuesta =
    await apiFetch<MensajeUsuarioBackend>(
      '/api/usuarios',
      {
        method: 'POST',
        body: JSON.stringify({
          dni,
          nombres,
          apePaterno,
          apeMaterno,
          email:
            datos.email
              .trim()
              .toLowerCase(),
          rolId: datos.rolId,
        }),
      },
    )

  if (respuesta.success === false) {
    throw new Error(
      respuesta.message ??
        'No se pudo registrar el usuario.',
    )
  }
}

export async function actualizarUsuarioBackend(
  id: string,
  datos: UsuarioFormData,
): Promise<void> {
  const usuarioId = Number(id)

  if (
    !Number.isInteger(usuarioId) ||
    usuarioId <= 0
  ) {
    throw new Error(
      'El identificador del usuario no es válido.',
    )
  }

  const nombres =
    (datos.nombres ?? '').trim()

  const apePaterno =
    (datos.apePaterno ?? '').trim()

  const apeMaterno =
    (datos.apeMaterno ?? '').trim()

  if (
    !nombres ||
    !apePaterno ||
    !apeMaterno
  ) {
    throw new Error(
      'Completa los nombres y apellidos.',
    )
  }

  if (!datos.rolId) {
    throw new Error(
      'Selecciona un rol.',
    )
  }

  const respuesta =
    await apiFetch<MensajeUsuarioBackend>(
      '/api/usuarios',
      {
        method: 'PUT',
        body: JSON.stringify({
          usuarioId,
          nombres,
          apePaterno,
          apeMaterno,
          email:
            datos.email
              .trim()
              .toLowerCase(),
          rolId: datos.rolId,
        }),
      },
    )

  if (respuesta.success === false) {
    throw new Error(
      respuesta.message ??
        'No se pudo actualizar el usuario.',
    )
  }
}

export async function actualizarEstadoUsuarioBackend(
  id: string,
  activo: boolean,
): Promise<void> {
  const usuarioId = Number(id)

  if (!Number.isInteger(usuarioId) || usuarioId <= 0) {
    throw new Error('El identificador del usuario no es válido.')
  }

  const parametros = new URLSearchParams({
    idUsuario: String(usuarioId),
    activo: String(activo),
  })

  const respuesta = await apiFetch<MensajeUsuarioBackend>(
    `/api/usuarios?${parametros.toString()}`,
    {
      method: 'DELETE',
    },
  )

  if (respuesta.success === false) {
    throw new Error(
      respuesta.message ?? 'No se pudo actualizar el estado del usuario.',
    )
  }
}

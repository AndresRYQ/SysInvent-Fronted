import { USUARIOS_INICIALES } from '../data/usuarios'
import { registrarEventoBitacora } from './bitacoraService'
import { apiFetch } from './api'
import type {
  UsuarioLogin,
} from '../types/auth'
import type {
  UsuarioFormData,
} from '../types/usuario'
import {
  guardarStorage,
  obtenerStorage,
  STORAGE_KEYS,
} from './storageService'

function copiarUsuarios(
  usuarios: UsuarioLogin[],
): UsuarioLogin[] {
  return usuarios.map((usuario) => ({
    ...usuario,
  }))
}

export function obtenerUsuarios():
  UsuarioLogin[] {
  const guardados =
    obtenerStorage<UsuarioLogin[]>(
      STORAGE_KEYS.usuarios,
      [],
    )

  const usuarios =
    guardados.length > 0
      ? guardados
      : USUARIOS_INICIALES

  if (guardados.length === 0) {
    guardarStorage(
      STORAGE_KEYS.usuarios,
      usuarios,
    )
  }

  return copiarUsuarios(usuarios)
}

function guardarUsuarios(
  usuarios: UsuarioLogin[],
): void {
  guardarStorage(
    STORAGE_KEYS.usuarios,
    usuarios,
  )

}

function normalizar(
  valor?: string | null,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function validarDatos(
  datos: UsuarioFormData,
  idActual?: string,
): void {
  if (!datos.usuario.trim()) {
    throw new Error(
      'El nombre de usuario es obligatorio.',
    )
  }

  if (
    !/^[a-zA-Z0-9._-]+$/.test(
      datos.usuario.trim(),
    )
  ) {
    throw new Error(
      'El usuario solo puede contener letras, números, puntos, guiones y guion bajo.',
    )
  }

  if (!datos.nombreCompleto.trim()) {
    throw new Error(
      'El nombre completo es obligatorio.',
    )
  }

  if (!datos.email.trim()) {
    throw new Error(
      'El correo es obligatorio.',
    )
  }

  if (
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(
      datos.email.trim(),
    )
  ) {
    throw new Error(
      'Ingresa un correo válido.',
    )
  }

  if (!datos.rol) {
    throw new Error(
      'Selecciona un rol.',
    )
  }

  const usuarios = obtenerUsuarios()

  const usuarioRepetido = usuarios.some(
    (usuario) =>
      usuario.id !== idActual &&
      normalizar(usuario.usuario) ===
        normalizar(datos.usuario),
  )

  if (usuarioRepetido) {
    throw new Error(
      'El nombre de usuario ya está registrado.',
    )
  }

  const correoRepetido = usuarios.some(
    (usuario) =>
      usuario.id !== idActual &&
      normalizar(usuario.email) ===
        normalizar(datos.email),
  )

  if (correoRepetido) {
    throw new Error(
      'El correo ya está registrado.',
    )
  }
}

function generarId(
  usuarios: UsuarioLogin[],
): string {
  const mayor = usuarios.reduce(
    (resultado, usuario) => {
      const numero = Number(
        usuario.id.replace('USR-', ''),
      )

      return Number.isNaN(numero)
        ? resultado
        : Math.max(resultado, numero)
    },
    0,
  )

  return `USR-${String(mayor + 1).padStart(
    3,
    '0',
  )}`
}

export function crearUsuario(
  datos: UsuarioFormData,
): UsuarioLogin {
  if (datos.contrasena.length < 6) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.',
    )
  }

  validarDatos(datos)

  const usuarios = obtenerUsuarios()

  const nuevo: UsuarioLogin = {
    id: generarId(usuarios),
    usuario: datos.usuario.trim(),
    nombreCompleto:
      datos.nombreCompleto.trim(),
    email: datos.email.trim().toLowerCase(),
    contrasena: datos.contrasena,
    rol: datos.rol,
    estado: datos.estado,
  }

  guardarUsuarios([...usuarios, nuevo])

  registrarEventoBitacora({
    modulo: 'Usuarios',
    accion: 'CREAR',
    detalle:
      `Se creó el usuario "${nuevo.usuario}" con el rol "${nuevo.rol}".`,
    registroId: nuevo.id,
  })

  return nuevo
}

export function actualizarUsuario(
  id: string,
  datos: UsuarioFormData,
): UsuarioLogin {
  validarDatos(datos, id)

  const usuarios = obtenerUsuarios()

  const actual = usuarios.find(
    (usuario) => usuario.id === id,
  )

  if (!actual) {
    throw new Error(
      'El usuario seleccionado no existe.',
    )
  }

  if (
    datos.contrasena &&
    datos.contrasena.length < 6
  ) {
    throw new Error(
      'La contraseña debe tener al menos 6 caracteres.',
    )
  }

  const actualizado: UsuarioLogin = {
    ...actual,
    usuario: datos.usuario.trim(),
    nombreCompleto:
      datos.nombreCompleto.trim(),
    email: datos.email.trim().toLowerCase(),
    contrasena:
      datos.contrasena ||
      actual.contrasena,
    rol: datos.rol,
    estado: datos.estado,
  }

  guardarUsuarios(
    usuarios.map((usuario) =>
      usuario.id === id
        ? actualizado
        : usuario,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Usuarios',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el usuario "${actualizado.usuario}".`,
    registroId: actualizado.id,
  })

  return actualizado
}

export function eliminarUsuario(
  id: string,
  usuarioActualId?: string,
): void {
  if (id === usuarioActualId) {
    throw new Error(
      'No puedes eliminar tu propio usuario.',
    )
  }

  const usuarios = obtenerUsuarios()

  const seleccionado = usuarios.find(
    (usuario) => usuario.id === id,
  )

  if (!seleccionado) {
    throw new Error(
      'El usuario seleccionado no existe.',
    )
  }

  const esAdministradorActivo =
    seleccionado.estado &&
    normalizar(seleccionado.rol) ===
      'administrador'

  if (esAdministradorActivo) {
    const administradoresActivos =
      usuarios.filter(
        (usuario) =>
          usuario.estado &&
          normalizar(usuario.rol) ===
            'administrador',
      )

    if (
      administradoresActivos.length <= 1
    ) {
      throw new Error(
        'Debe existir al menos un administrador activo.',
      )
    }
  }

  guardarUsuarios(
    usuarios.filter(
      (usuario) => usuario.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Usuarios',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el usuario "${seleccionado.usuario}".`,
    registroId: seleccionado.id,
  })
}

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

  if (datos.contrasena.length < 12) {
    throw new Error(
      'La contraseña debe tener al menos 12 caracteres.',
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
          contrasena:
            datos.contrasena,
          rolesIds: [datos.rolId],
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
          rolesIds: [datos.rolId],
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

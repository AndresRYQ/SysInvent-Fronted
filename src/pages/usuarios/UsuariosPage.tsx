import {
  useMemo,
  useState,
} from 'react'

import {
  FiltrosUsuarios,
  type FiltrosUsuariosValores,
} from '../../components/usuarios/FiltrosUsuarios'

import {
  FormularioUsuario,
} from '../../components/usuarios/FormularioUsuario'

import {
  TablaUsuarios,
} from '../../components/usuarios/TablaUsuarios'

import { useAuth } from '../../hooks/useAuth'

import {
  obtenerRoles,
} from '../../services/rolService'

import {
  actualizarUsuario,
  crearUsuario,
  eliminarUsuario,
  obtenerUsuarios,
} from '../../services/usuarioService'

import type {
  UsuarioLogin,
} from '../../types/auth'

import type {
  UsuarioFormData,
} from '../../types/usuario'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES:
  FiltrosUsuariosValores = {
    busqueda: '',
    rol: '',
    estado: '',
  }

function filtrarUsuarios(
  usuarios: UsuarioLogin[],
  filtros: FiltrosUsuariosValores,
): UsuarioLogin[] {
  const termino =
    filtros.busqueda.trim().toLowerCase()

  return usuarios.filter((usuario) => {
    const coincideTexto =
      !termino ||
      usuario.usuario
        .toLowerCase()
        .includes(termino) ||
      usuario.nombreCompleto
        .toLowerCase()
        .includes(termino) ||
      usuario.email
        .toLowerCase()
        .includes(termino) ||
      usuario.id
        .toLowerCase()
        .includes(termino)

    const coincideRol =
      !filtros.rol ||
      usuario.rol === filtros.rol

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        usuario.estado) ||
      (filtros.estado === 'inactivo' &&
        !usuario.estado)

    return (
      coincideTexto &&
      coincideRol &&
      coincideEstado
    )
  })
}

export function UsuariosPage() {
  const { sesion } = useAuth()

  const [usuarios, setUsuarios] =
    useState<UsuarioLogin[]>(
      () => obtenerUsuarios(),
    )

  const [roles] = useState(
    () => obtenerRoles(),
  )

  const [filtros, setFiltros] =
    useState(FILTROS_INICIALES)

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState(FILTROS_INICIALES)

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] =
    useState(10)

  const [modalAbierto, setModalAbierto] =
    useState(false)

  const [
    usuarioEnEdicion,
    setUsuarioEnEdicion,
  ] = useState<UsuarioLogin | null>(null)

  const [mensaje, setMensaje] = useState<{
    tipo: 'success' | 'danger'
    texto: string
  } | null>(null)

  const usuariosFiltrados = useMemo(
    () =>
      filtrarUsuarios(
        usuarios,
        filtrosAplicados,
      ),
    [usuarios, filtrosAplicados],
  )

  const totalItems =
    usuariosFiltrados.length

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  const paginaActual = Math.min(
    page,
    totalPages,
  )

  const usuariosPaginados = useMemo(() => {
    const inicio =
      (paginaActual - 1) * pageSize

    return usuariosFiltrados.slice(
      inicio,
      inicio + pageSize,
    )
  }, [
    usuariosFiltrados,
    paginaActual,
    pageSize,
  ])

  const manejarGuardado = (
    datos: UsuarioFormData,
  ): string | null => {
    try {
      if (usuarioEnEdicion) {
        actualizarUsuario(
          usuarioEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Usuario actualizado correctamente.',
        })
      } else {
        crearUsuario(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Usuario registrado correctamente.',
        })
      }

      setUsuarios(obtenerUsuarios())
      setUsuarioEnEdicion(null)
      setModalAbierto(false)
      setPage(1)

      return null
    } catch (error) {
      return error instanceof Error
        ? error.message
        : 'No se pudo guardar el usuario.'
    }
  }

  const manejarEliminacion = (
    usuario: UsuarioLogin,
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar al usuario "${usuario.usuario}"?`,
    )

    if (!confirmado) {
      return
    }

    try {
      eliminarUsuario(
        usuario.id,
        sesion?.id,
      )

      setUsuarios(obtenerUsuarios())
      setPage(1)

      setMensaje({
        tipo: 'success',
        texto:
          'Usuario eliminado correctamente.',
      })
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto:
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar el usuario.',
      })
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Usuarios</h1>

              <p>
                Administración de usuarios
                y asignación de roles
              </p>
            </div>
          </section>

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo} mt-3 mb-0`}
              role="status"
            >
              {mensaje.texto}
            </div>
          )}

          <div className="maestro-panel">
            <FiltrosUsuarios
              valores={filtros}
              roles={roles}
              onChange={(campo, valor) =>
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }))
              }
              onBuscar={() => {
                setFiltrosAplicados(filtros)
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(
                  FILTROS_INICIALES,
                )
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaUsuarios
              usuarios={usuariosPaginados}
              totalItems={totalItems}
              page={paginaActual}
              pageSize={pageSize}
              onAgregar={() => {
                setUsuarioEnEdicion(null)
                setModalAbierto(true)
                setMensaje(null)
              }}
              onEditar={(usuario) => {
                setUsuarioEnEdicion(usuario)
                setModalAbierto(true)
                setMensaje(null)
              }}
              onEliminar={manejarEliminacion}
              onPageChange={setPage}
              onPageSizeChange={(
                nuevoTamano,
              ) => {
                setPageSize(nuevoTamano)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      {modalAbierto && (
        <FormularioUsuario
          key={
            usuarioEnEdicion?.id ??
            'nuevo-usuario'
          }
          usuario={usuarioEnEdicion}
          roles={roles}
          onClose={() => {
            setModalAbierto(false)
            setUsuarioEnEdicion(null)
          }}
          onGuardar={manejarGuardado}
        />
      )}
    </>
  )
}
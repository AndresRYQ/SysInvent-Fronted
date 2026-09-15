import {
  useMemo,
  useState,
} from 'react'

import {
  FiltrosRoles,
  type FiltrosRolesValores,
} from '../../components/roles/FiltrosRoles'

import {
  FormularioRol,
} from '../../components/roles/FormularioRol'

import {
  TablaRoles,
} from '../../components/roles/TablaRoles'

import {
  actualizarRol,
  crearRol,
  eliminarRol,
  obtenerRoles,
} from '../../services/rolService'

import type {
  Rol,
  RolFormData,
} from '../../types/rol'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES:
  FiltrosRolesValores = {
    busqueda: '',
    estado: '',
  }

function filtrarRoles(
  roles: Rol[],
  filtros: FiltrosRolesValores,
): Rol[] {
  const termino =
    filtros.busqueda.trim().toLowerCase()

  return roles.filter((rol) => {
    const coincideTexto =
      !termino ||
      rol.nombre
        .toLowerCase()
        .includes(termino) ||
      rol.descripcion
        .toLowerCase()
        .includes(termino)

    const coincideEstado =
      !filtros.estado ||
      (filtros.estado === 'activo' &&
        rol.estado) ||
      (filtros.estado === 'inactivo' &&
        !rol.estado)

    return coincideTexto && coincideEstado
  })
}

export function RolesPage() {
  const [roles, setRoles] =
    useState<Rol[]>(() => obtenerRoles())

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

  const [rolEnEdicion, setRolEnEdicion] =
    useState<Rol | null>(null)

  const [mensaje, setMensaje] = useState<{
    tipo: 'success' | 'danger'
    texto: string
  } | null>(null)

  const rolesFiltrados = useMemo(
    () =>
      filtrarRoles(
        roles,
        filtrosAplicados,
      ),
    [roles, filtrosAplicados],
  )

  const totalItems = rolesFiltrados.length

  const totalPages = Math.max(
    1,
    Math.ceil(totalItems / pageSize),
  )

  const paginaActual = Math.min(
    page,
    totalPages,
  )

  const rolesPaginados = useMemo(() => {
    const inicio =
      (paginaActual - 1) * pageSize

    return rolesFiltrados.slice(
      inicio,
      inicio + pageSize,
    )
  }, [
    rolesFiltrados,
    paginaActual,
    pageSize,
  ])

  const abrirNuevo = () => {
    setRolEnEdicion(null)
    setModalAbierto(true)
    setMensaje(null)
  }

  const abrirEdicion = (rol: Rol) => {
    setRolEnEdicion(rol)
    setModalAbierto(true)
    setMensaje(null)
  }

  const manejarGuardado = (
    datos: RolFormData,
  ): string | null => {
    try {
      if (rolEnEdicion) {
        actualizarRol(
          rolEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Rol actualizado correctamente.',
        })
      } else {
        crearRol(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Rol registrado correctamente.',
        })
      }

      setRoles(obtenerRoles())
      setModalAbierto(false)
      setRolEnEdicion(null)
      setPage(1)

      return null
    } catch (error) {
      return error instanceof Error
        ? error.message
        : 'No se pudo guardar el rol.'
    }
  }

  const manejarEliminacion = (
    rol: Rol,
  ) => {
    const confirmado = window.confirm(
      `¿Deseas eliminar el rol "${rol.nombre}"?`,
    )

    if (!confirmado) {
      return
    }

    try {
      eliminarRol(rol.id)
      setRoles(obtenerRoles())
      setPage(1)

      setMensaje({
        tipo: 'success',
        texto:
          'Rol eliminado correctamente.',
      })
    } catch (error) {
      setMensaje({
        tipo: 'danger',
        texto:
          error instanceof Error
            ? error.message
            : 'No se pudo eliminar el rol.',
      })
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Roles</h1>

              <p>
                Administración de roles y
                permisos del sistema
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
            <FiltrosRoles
              valores={filtros}
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
            <TablaRoles
              roles={rolesPaginados}
              totalItems={totalItems}
              page={paginaActual}
              pageSize={pageSize}
              onAgregar={abrirNuevo}
              onEditar={abrirEdicion}
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
        <FormularioRol
          key={
            rolEnEdicion?.id ??
            'nuevo-rol'
          }
          rol={rolEnEdicion}
          onClose={() => {
            setModalAbierto(false)
            setRolEnEdicion(null)
          }}
          onGuardar={manejarGuardado}
        />
      )}
    </>
  )
}
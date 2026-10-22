import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from 'react'

import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import {
  CheckCircle2,
  XCircle,
} from 'lucide-react'

import {
  FiltrosRoles,
  type FiltrosRolesValores,
} from '../../components/roles/FiltrosRoles'
import {
  FormularioRol,
} from '../../components/roles/FormularioRol'
import {
  RolDeleteModal,
} from '../../components/roles/RolDeleteModal'
import {
  TablaRoles,
} from '../../components/roles/TablaRoles'

import {
  actualizarRolBackend,
  crearRolBackend,
  desactivarRolBackend,
  obtenerRolesBackend,
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
    filtros.busqueda
      .trim()
      .toLowerCase()

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
      (
        filtros.estado === 'activo' &&
        rol.estado
      ) ||
      (
        filtros.estado === 'inactivo' &&
        !rol.estado
      )

    return (
      coincideTexto &&
      coincideEstado
    )
  })
}

export function RolesPage() {
  const [roles, setRoles] =
    useState<Rol[]>([])

  const [cargando, setCargando] =
    useState(true)

  const [filtros, setFiltros] =
    useState(FILTROS_INICIALES)

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState(FILTROS_INICIALES)

  const [page, setPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const [
    modalAbierto,
    setModalAbierto,
  ] = useState(false)

  const [
    rolEnEdicion,
    setRolEnEdicion,
  ] = useState<Rol | null>(null)

  const [
    rolAEliminar,
    setRolAEliminar,
  ] = useState<Rol | null>(null)

  const [mensaje, setMensaje] =
    useState<{
      tipo: 'success' | 'error'
      texto: string
    } | null>(null)

  const [
    alertaAbierta,
    setAlertaAbierta,
  ] = useState(false)

  const cargarRoles =
    useCallback(async (): Promise<void> => {
      setCargando(true)

      try {
        const resultado =
          await obtenerRolesBackend(
            '',
            1,
            100,
          )

        setRoles(resultado.roles)
      } catch (error) {
        setMensaje({
          tipo: 'error',
          texto:
            error instanceof Error
              ? error.message
              : 'No se pudieron cargar los roles.',
        })

        setAlertaAbierta(true)
        throw error
      } finally {
        setCargando(false)
      }
    }, [])

  useEffect(() => {
    void cargarRoles().catch(
      () => undefined,
    )
  }, [cargarRoles])

  const rolesFiltrados =
    useMemo(
      () =>
        filtrarRoles(
          roles,
          filtrosAplicados,
        ),
      [
        roles,
        filtrosAplicados,
      ],
    )

  const totalItems =
    rolesFiltrados.length

  const totalPages =
    Math.max(
      1,
      Math.ceil(
        totalItems / pageSize,
      ),
    )

  const paginaActual =
    Math.min(page, totalPages)

  const rolesPaginados =
    useMemo(() => {
      const inicio =
        (paginaActual - 1) *
        pageSize

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
    setAlertaAbierta(false)
    setMensaje(null)
  }

  const abrirEdicion = (
    rol: Rol,
  ) => {
    setRolEnEdicion(rol)
    setModalAbierto(true)
    setAlertaAbierta(false)
    setMensaje(null)
  }

  const manejarGuardado = async (
    datos: RolFormData,
  ): Promise<string | null> => {
    try {
      if (rolEnEdicion) {
        await actualizarRolBackend(
          rolEnEdicion.id,
          datos,
        )
      } else {
        await crearRolBackend(datos)
      }

      await cargarRoles()

      setMensaje({
        tipo: 'success',
        texto: rolEnEdicion
          ? 'Rol actualizado correctamente.'
          : 'Rol registrado correctamente.',
      })

      setAlertaAbierta(true)
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
    setRolAEliminar(rol)
  }

  const confirmarEliminacion =
    async (): Promise<void> => {
      if (!rolAEliminar) {
        return
      }

      try {
        if (
          rolAEliminar.nombre
            .trim()
            .toLowerCase() ===
          'administrador'
        ) {
          throw new Error(
            'El rol Administrador no puede desactivarse.',
          )
        }

        if (
          rolAEliminar.usuarios > 0
        ) {
          throw new Error(
            'No puedes desactivar un rol asignado a usuarios.',
          )
        }

        await desactivarRolBackend(
          rolAEliminar.id,
        )

        await cargarRoles()

        setRolAEliminar(null)
        setPage(1)

        setMensaje({
          tipo: 'success',
          texto:
            'Rol desactivado correctamente.',
        })

        setAlertaAbierta(true)
      } catch (error) {
        setRolAEliminar(null)

        setMensaje({
          tipo: 'error',
          texto:
            error instanceof Error
              ? error.message
              : 'No se pudo desactivar el rol.',
        })

        setAlertaAbierta(true)
      }
    }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell roles-page">
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

          <Snackbar
            open={
              alertaAbierta &&
              Boolean(mensaje)
            }
            autoHideDuration={3000}
            onClose={() =>
              setAlertaAbierta(false)
            }
            slotProps={{
              transition: {
                onExited: () =>
                  setMensaje(null),
              },
            }}
            anchorOrigin={{
              vertical: 'top',
              horizontal: 'center',
            }}
          >
            <Alert
              severity={
                mensaje?.tipo ??
                'success'
              }
              icon={
                mensaje?.tipo ===
                'success'
                  ? (
                    <CheckCircle2 fontSize="inherit" />
                  )
                  : (
                    <XCircle fontSize="inherit" />
                  )
              }
              onClose={() =>
                setAlertaAbierta(false)
              }
              variant="filled"
              sx={{
                width: '100%',
                minWidth: 320,
                boxShadow: 4,
              }}
            >
              {mensaje?.texto}
            </Alert>
          </Snackbar>

          <div className="maestro-panel">
            <FiltrosRoles
              valores={filtros}
              onChange={(
                campo,
                valor,
              ) =>
                setFiltros(
                  (actual) => ({
                    ...actual,
                    [campo]: valor,
                  }),
                )
              }
              onBuscar={() => {
                setFiltrosAplicados(
                  filtros,
                )
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(
                  FILTROS_INICIALES,
                )
                setFiltrosAplicados(
                  FILTROS_INICIALES,
                )
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            {cargando ? (
              <div className="p-4 text-center text-muted">
                Cargando roles...
              </div>
            ) : (
              <TablaRoles
                roles={
                  rolesPaginados
                }
                totalItems={
                  totalItems
                }
                page={
                  paginaActual
                }
                pageSize={
                  pageSize
                }
                onAgregar={
                  abrirNuevo
                }
                onEditar={
                  abrirEdicion
                }
                onEliminar={
                  manejarEliminacion
                }
                onPageChange={
                  setPage
                }
                onPageSizeChange={(
                  nuevoTamano,
                ) => {
                  setPageSize(
                    nuevoTamano,
                  )
                  setPage(1)
                }}
              />
            )}
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
          onGuardar={
            manejarGuardado
          }
        />
      )}

      <RolDeleteModal
        abierto={
          Boolean(rolAEliminar)
        }
        rol={rolAEliminar}
        onClose={() =>
          setRolAEliminar(null)
        }
        onConfirm={
          confirmarEliminacion
        }
      />
    </>
  )
}

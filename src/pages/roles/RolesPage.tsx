import { useEffect, useMemo, useState } from 'react'

import { FiltrosRoles, type FiltrosRolesValores } from '../../components/roles/FiltrosRoles'
import { TablaRoles, type RolResumen } from '../../components/roles/TablaRoles'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosRolesValores = {
  busqueda: '',
  estado: '',
}

const ROLES_INICIALES: RolResumen[] = [
  {
    id: 'ROL-001',
    nombre: 'Administrador',
    descripcion: 'Control total del sistema, usuarios y configuración operacional.',
    estado: true,
    usuarios: 1,
  },
  {
    id: 'ROL-002',
    nombre: 'Almacenero',
    descripcion: 'Gestión de entradas, salidas y control de inventario.',
    estado: true,
    usuarios: 2,
  },
  {
    id: 'ROL-003',
    nombre: 'Supervisor',
    descripcion: 'Supervisión de procesos y revisión de movimientos del almacén.',
    estado: true,
    usuarios: 3,
  },
  {
    id: 'ROL-004',
    nombre: 'Operador',
    descripcion: 'Consulta y registro de movimientos operativos básicos.',
    estado: false,
    usuarios: 0,
  },
]

function filtrarRoles(roles: RolResumen[], filtros: FiltrosRolesValores) {
  const termino = filtros.busqueda.trim().toLowerCase()

  return roles.filter((rol) => {
    const coincideTexto =
      termino.length === 0 ||
      rol.nombre.toLowerCase().includes(termino) ||
      rol.descripcion.toLowerCase().includes(termino)

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && rol.estado) ||
      (filtros.estado === 'inactivo' && !rol.estado)

    return coincideTexto && coincideEstado
  })
}

export function RolesPage() {
  const [roles] = useState<RolResumen[]>(ROLES_INICIALES)
  const [filtros, setFiltros] = useState<FiltrosRolesValores>(FILTROS_INICIALES)
  const [filtrosAplicados, setFiltrosAplicados] = useState<FiltrosRolesValores>(FILTROS_INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const rolesFiltrados = useMemo(
    () => filtrarRoles(roles, filtrosAplicados),
    [roles, filtrosAplicados],
  )

  const totalItems = rolesFiltrados.length

  const rolesPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return rolesFiltrados.slice(startIndex, endIndex)
  }, [rolesFiltrados, page, pageSize])

  useEffect(() => {
    const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Roles</h1>
              <p>Mantenimiento de roles del sistema</p>
            </div>
          </section>

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
                setFiltrosAplicados(FILTROS_INICIALES)
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaRoles
              roles={rolesPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onPageChange={(nextPage) =>
                setPage(nextPage)
              }
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}

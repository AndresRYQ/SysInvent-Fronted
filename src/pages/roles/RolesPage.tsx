import { useMemo, useState } from 'react'
import { LayoutDashboard } from 'lucide-react'

import { FiltrosRoles, type FiltrosRolesValores } from '../../components/roles/FiltrosRoles'
import { TablaRoles, type RolResumen } from '../../components/roles/TablaRoles'
import '../../pages/usuarios/UsuariosPage.css'

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

  const rolesFiltrados = useMemo(
    () => filtrarRoles(roles, filtrosAplicados),
    [roles, filtrosAplicados],
  )

  const rolesActivos = useMemo(
    () => roles.filter((rol) => rol.estado).length,
    [roles],
  )

  const totalUsuariosEnRoles = useMemo(
    () => roles.reduce((total, rol) => total + rol.usuarios, 0),
    [roles],
  )

  return (
    <main className="users-page app-shell">
      <div className="container-xl px-0">
        <section className="users-hero">
          <span className="users-badge">
            <LayoutDashboard size={16} />
            Seguridad
          </span>

          <h1>Gestión de roles</h1>

          <p>
            Administra los perfiles del sistema y controla el acceso según el tipo
            de usuario que debe operar cada módulo.
          </p>

          <div className="row g-3 users-stat-grid">
            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">Roles registrados</div>
                <div className="users-stat-value">{roles.length}</div>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">Activos</div>
                <div className="users-stat-value">{rolesActivos}</div>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">Usuarios asignados</div>
                <div className="users-stat-value">{totalUsuariosEnRoles}</div>
              </article>
            </div>
          </div>
        </section>

        <div className="users-panel">
          <FiltrosRoles
            valores={filtros}
            onChange={(campo, valor) =>
              setFiltros((actual) => ({
                ...actual,
                [campo]: valor,
              }))
            }
            onBuscar={() => setFiltrosAplicados(filtros)}
            onLimpiar={() => {
              setFiltros(FILTROS_INICIALES)
              setFiltrosAplicados(FILTROS_INICIALES)
            }}
          />
        </div>

        <div className="users-panel">
          <TablaRoles roles={rolesFiltrados} />
        </div>
      </div>
    </main>
  )
}

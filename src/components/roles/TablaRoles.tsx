import { ShieldCheck, Users } from 'lucide-react'

export interface RolResumen {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  usuarios: number
}

interface TablaRolesProps {
  roles: RolResumen[]
}

export function TablaRoles({ roles }: TablaRolesProps) {
  return (
    <section className="users-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="users-table-header">
          <div>
            <span className="users-kicker">
              <Users size={16} />
              Roles
            </span>

            <h2 className="users-section-title mb-1">
              Listado de roles
            </h2>

            <p className="users-section-copy mb-0">
              Total encontrados: {roles.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table users-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rol</th>
                <th>Descripción</th>
                <th>Usuarios</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {roles.length > 0 ? (
                roles.map((rol) => (
                  <tr key={rol.id}>
                    <td>
                      <span className="users-id-chip">{rol.id}</span>
                    </td>

                    <td>
                      <div className="users-cell-main">
                        <span className="users-cell-icon">
                          <ShieldCheck size={16} />
                        </span>
                        {rol.nombre}
                      </div>
                    </td>

                    <td>{rol.descripcion}</td>
                    <td>{rol.usuarios}</td>

                    <td>
                      <span
                        className={
                          rol.estado
                            ? 'users-status users-status--active'
                            : 'users-status users-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {rol.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="users-empty-state">
                      <Users size={28} />
                      <p className="mb-1">No se encontraron roles</p>
                      <span>Ajusta los filtros para una nueva búsqueda.</span>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  )
}

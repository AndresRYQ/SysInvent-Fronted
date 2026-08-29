import { ShieldCheck, UserRound, Users } from 'lucide-react'

import type { UsuarioLogin } from '../../types/auth'

interface TablaUsuariosProps {
  usuarios: UsuarioLogin[]
}

export function TablaUsuarios({
  usuarios,
}: TablaUsuariosProps) {
  return (
    <section className="users-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="users-table-header">
          <div>
            <span className="users-kicker">
              <Users size={16} />
              Registros
            </span>

            <h2 className="users-section-title mb-1">
              Listado de usuarios
            </h2>

            <p className="users-section-copy mb-0">
              Total encontrados: {usuarios.length}
            </p>
          </div>
        </div>

        <div className="table-responsive">
          <table className="table users-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
              </tr>
            </thead>

            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="users-id-chip">
                        {usuario.id}
                      </span>
                    </td>

                    <td>
                      <div className="users-cell-main">
                        <span className="users-cell-icon">
                          <UserRound size={16} />
                        </span>
                        {usuario.usuario}
                      </div>
                    </td>

                    <td>{usuario.nombreCompleto}</td>
                    <td>{usuario.email || 'Sin correo'}</td>
                    <td>{usuario.rol}</td>

                    <td>
                      <span
                        className={
                          usuario.estado
                            ? 'users-status users-status--active'
                            : 'users-status users-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {usuario.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="users-empty-state">
                      <Users size={28} />
                      <p className="mb-1">
                        No se encontraron registros
                      </p>
                      <span>
                        Ajusta los filtros o limpia la búsqueda.
                      </span>
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

import {
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'

import type { UsuarioLogin } from '../../types/auth'
import { TablePagination } from '../ui/TablePagination'

interface TablaUsuariosProps {
  usuarios: UsuarioLogin[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar?: () => void
  onEditar?: (usuario: UsuarioLogin) => void
  onEliminar?: (usuario: UsuarioLogin) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaUsuarios({
  usuarios,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaUsuariosProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <Users size={16} />
              Listado de usuarios
            </span>
          </div>

          {onAgregar && (
            <button
              type="button"
              className="btn maestro-toolbar-btn"
              onClick={onAgregar}
            >
              <Plus size={18} />
              Agregar usuario
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Usuario</th>
                <th>Nombre completo</th>
                <th>Correo</th>
                <th>Rol</th>
                <th>Estado</th>
                {(onEditar || onEliminar) && (
                  <th className="text-center">Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {usuarios.length > 0 ? (
                usuarios.map((usuario) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {usuario.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
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
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {usuario.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {(onEditar || onEliminar) && (
                      <td>
                        <div className="maestro-actions">
                          {onEditar && (
                            <button
                              type="button"
                              className="btn maestro-action-btn"
                              onClick={() => onEditar(usuario)}
                              title="Editar"
                              aria-label={`Editar ${usuario.nombreCompleto}`}
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {onEliminar && (
                            <button
                              type="button"
                              className="btn maestro-action-btn maestro-action-btn--danger"
                              onClick={() => onEliminar(usuario)}
                              title="Eliminar"
                              aria-label={`Eliminar ${usuario.nombreCompleto}`}
                            >
                              <Trash2 size={16} />
                            </button>
                          )}
                        </div>
                      </td>
                    )}
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={(onEditar || onEliminar) ? 7 : 6}>
                    <div className="maestro-empty-state">
                      <Users size={28} />
                      <p className="mb-1">
                        No se encontraron usuarios
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

        <TablePagination
          totalItems={totalItems}
          page={page}
          pageSize={pageSize}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
        />
      </div>
    </section>
  )
}

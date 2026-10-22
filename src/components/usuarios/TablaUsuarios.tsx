import {
  Pencil,
  Plus,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'

import type { UsuarioLogin } from '../../types/auth'
import { EmptyState } from '../common/EmptyState'
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
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <div>
            <span className="maestro-kicker">
              <Users size={16} />
              Listado de usuarios
            </span>
          </div>

          {onAgregar && (
            <button
              type="button"
              className="btn table-toolbar-btn"
              onClick={onAgregar}
            >
              <Plus size={18} />
              Agregar usuario
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
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
                usuarios.map((usuario, index) => (
                  <tr key={usuario.id}>
                    <td>
                      <span className="table-id-chip">
                        {(page - 1) * pageSize + index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="table-cell-main">
                        <span className="table-cell-icon">
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
                            ? 'status-label status-label--active'
                            : 'status-label status-label--inactive'
                        }
                      >
                        <span
                          className="status-label__dot"
                          aria-hidden="true"
                        />
                        {usuario.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {(onEditar || onEliminar) && (
                      <td>
                        <div className="table-actions">
                          {onEditar && (
                            <button
                              type="button"
                              className="btn table-action-btn"
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
                              className="btn table-action-btn table-action-btn--danger"
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
                    <EmptyState icon={Users} iconSize={28} title="No se encontraron usuarios" description="Ajusta los filtros o limpia la búsqueda." />
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

import {
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'

import { TablePagination } from '../ui/TablePagination'

export interface RolResumen {
  id: string
  nombre: string
  descripcion: string
  estado: boolean
  usuarios: number
}

interface TablaRolesProps {
  roles: RolResumen[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar?: () => void
  onEditar?: (rol: RolResumen) => void
  onEliminar?: (rol: RolResumen) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaRoles({
  roles,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaRolesProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <Users size={16} />
              Listado de roles
            </span>
          </div>

          {onAgregar && (
            <button
              type="button"
              className="btn maestro-toolbar-btn"
              onClick={onAgregar}
            >
              <Plus size={18} />
              Agregar rol
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Rol</th>
                <th>Descripción</th>
                <th>Usuarios</th>
                <th>Estado</th>
                {(onEditar || onEliminar) && (
                  <th className="text-center">Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {roles.length > 0 ? (
                roles.map((rol) => (
                  <tr key={rol.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {rol.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
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
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {rol.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {(onEditar || onEliminar) && (
                      <td>
                        <div className="maestro-actions">
                          {onEditar && (
                            <button
                              type="button"
                              className="btn maestro-action-btn"
                              onClick={() => onEditar(rol)}
                              title="Editar"
                              aria-label={`Editar ${rol.nombre}`}
                            >
                              <Pencil size={16} />
                            </button>
                          )}

                          {onEliminar && (
                            <button
                              type="button"
                              className="btn maestro-action-btn maestro-action-btn--danger"
                              onClick={() => onEliminar(rol)}
                              title="Eliminar"
                              aria-label={`Eliminar ${rol.nombre}`}
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
                  <td colSpan={(onEditar || onEliminar) ? 6 : 5}>
                    <div className="maestro-empty-state">
                      <Users size={28} />
                      <p className="mb-1">No se encontraron roles</p>
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

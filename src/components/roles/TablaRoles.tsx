import {
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
  Users,
} from 'lucide-react'
import type { Rol } from '../../types/rol'
import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

export type RolResumen = Rol

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
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <div>
            <span className="maestro-kicker">
              <Users size={16} />
              Listado de roles
            </span>
          </div>

          {onAgregar && (
            <button
              type="button"
              className="btn table-toolbar-btn"
              onClick={onAgregar}
            >
              <Plus size={18} />
              Agregar rol
            </button>
          )}
        </div>

        <div className="table-responsive">
          <table className="table standard-table roles-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Rol</th>
                <th>Descripción</th>
                <th>Usuarios</th>
                <th>Módulos</th>
                <th>Estado</th>
                {(onEditar || onEliminar) && (
                  <th className="text-center">Acciones</th>
                )}
              </tr>
            </thead>

            <tbody>
              {roles.length > 0 ? (
                roles.map((rol, index) => (
                  <tr key={rol.id}>
                    <td>
                      <span className="table-id-chip">
                        {(page - 1) * pageSize + index + 1}
                      </span>
                    </td>

                    <td>
                      <div className="table-cell-main">
                        <span className="table-cell-icon">
                          <ShieldCheck size={16} />
                        </span>
                        {rol.nombre}
                      </div>
                    </td>

                    <td>{rol.descripcion}</td>
                    <td>{rol.usuarios}</td>
                    <td>
                      <span className="table-id-chip">
                        {rol.modulos.length}
                      </span>
                    </td>

                    <td>
                      <span
                        className={
                          rol.estado
                            ? 'status-label status-label--active'
                            : 'status-label status-label--inactive'
                        }
                      >
                        <span
                          className="status-label__dot"
                          aria-hidden="true"
                        />
                        {rol.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    {(onEditar || onEliminar) && (
                      <td>
                        <div className="table-actions">
                          {onEditar && (
                            <button
                              type="button"
                              className="btn table-action-btn"
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
                              className="btn table-action-btn table-action-btn--danger"
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
                  <td colSpan={(onEditar || onEliminar) ? 7 : 6}>
                    <EmptyState icon={Users} iconSize={28} title="No se encontraron roles" description="Ajusta los filtros o limpia la búsqueda." />
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

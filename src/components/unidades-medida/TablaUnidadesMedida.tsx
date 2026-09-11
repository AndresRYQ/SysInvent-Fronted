import {
  FolderKanban,
  Pencil,
  Plus,
  Ruler,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { UnidadMedida } from '../../types/unidadMedida'
import { TablePagination } from '../ui/TablePagination'

interface TablaUnidadesMedidaProps {
  unidades: UnidadMedida[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (unidad: UnidadMedida) => void
  onEliminar: (unidad: UnidadMedida) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaUnidadesMedida({
  unidades,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaUnidadesMedidaProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de unidades de medida
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar unidad de medida
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de unidad de medida</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {unidades.length > 0 ? (
                unidades.map((unidad) => (
                  <tr key={unidad.id}>
                    <td>
                      <span className="maestro-id-chip">{unidad.id}</span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Ruler size={16} />
                        </span>
                        {unidad.nombre}
                      </div>
                    </td>

                    <td>{unidad.descripcion}</td>
                    <td>{unidad.fechaRegistro}</td>

                    <td>
                      <span
                        className={
                          unidad.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {unidad.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(unidad)}
                          title="Editar"
                          aria-label={`Editar ${unidad.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(unidad)}
                          title="Eliminar"
                          aria-label={`Eliminar ${unidad.nombre}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6}>
                    <div className="maestro-empty-state">
                      <FolderKanban size={28} />
                      <p className="mb-1">
                        No se encontraron unidades de medida
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

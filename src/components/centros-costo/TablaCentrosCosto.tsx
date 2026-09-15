import {
  FolderKanban,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Store,
  Trash2,
} from 'lucide-react'

import type { CentroCosto } from '../../types/centroCosto'
import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

interface TablaCentrosCostoProps {
  centrosCosto: CentroCosto[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (centroCosto: CentroCosto) => void
  onVisualizar: (centroCosto: CentroCosto) => void
  onEliminar: (centroCosto: CentroCosto) => void
  onReactivar: (centroCosto: CentroCosto) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaCentrosCosto({
  centrosCosto,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onVisualizar,
  onEliminar,
  onReactivar,
  onPageChange,
  onPageSizeChange,
}: TablaCentrosCostoProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de centros de costo
            </span>
          </div>

          <button
            type="button"
            className="btn table-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar centro de costo
          </button>
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre de centro de costo</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {centrosCosto.length > 0 ? (
                centrosCosto.map((centroCosto) => (
                  <tr key={centroCosto.id}>
                    <td>
                      <span className="table-id-chip">
                        {centroCosto.id}
                      </span>
                    </td>

                    <td>
                      <div className="table-cell-main">
                        <span className="table-cell-icon">
                          <Store size={16} />
                        </span>
                        {centroCosto.nombre}
                      </div>
                    </td>

                    <td>{centroCosto.descripcion}</td>
                    <td>
                      <span
                        className={
                          centroCosto.activo === 1
                            ? 'status-label status-label--active'
                            : 'status-label status-label--inactive'
                        }
                      >
                        <span className="status-label__dot" aria-hidden="true" />
                        {centroCosto.activo === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        {centroCosto.activo === 1 ? (
                          <>
                            <button
                          type="button"
                          className="btn table-action-btn"
                          onClick={() => onEditar(centroCosto)}
                          title="Editar"
                          aria-label={`Editar ${centroCosto.nombre}`}
                        >
                          <Pencil size={16} />
                            </button>

                            <button
                          type="button"
                          className="btn table-action-btn table-action-btn--danger"
                          onClick={() => onEliminar(centroCosto)}
                          title="Eliminar"
                          aria-label={`Eliminar ${centroCosto.nombre}`}
                        >
                          <Trash2 size={16} />
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              type="button"
                              className="btn table-action-btn"
                              onClick={() => onVisualizar(centroCosto)}
                              title="Visualizar"
                              aria-label={`Visualizar ${centroCosto.nombre}`}
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              type="button"
                              className="btn table-action-btn"
                              onClick={() => onReactivar(centroCosto)}
                              title="Reactivar"
                              aria-label={`Reactivar ${centroCosto.nombre}`}
                            >
                              <RotateCcw size={16} />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={FolderKanban} iconSize={28} title="No se encontraron centros de costo" description="Ajusta los filtros o limpia la búsqueda." />
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


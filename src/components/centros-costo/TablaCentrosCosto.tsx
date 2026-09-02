import {
  FolderKanban,
  Pencil,
  Plus,
  ShieldCheck,
  Store,
  Trash2,
} from 'lucide-react'

import type { CentroCosto } from '../../types/centroCosto'
import { TablePagination } from '../ui/TablePagination'

interface TablaCentrosCostoProps {
  centrosCosto: CentroCosto[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (centroCosto: CentroCosto) => void
  onEliminar: (centroCosto: CentroCosto) => void
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
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaCentrosCostoProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de centros de costo
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar centro de costo
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de centro de costo</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {centrosCosto.length > 0 ? (
                centrosCosto.map((centroCosto) => (
                  <tr key={centroCosto.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {centroCosto.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Store size={16} />
                        </span>
                        {centroCosto.nombre}
                      </div>
                    </td>

                    <td>{centroCosto.descripcion}</td>
                    <td>{centroCosto.fechaRegistro}</td>

                    <td>
                      <span
                        className={
                          centroCosto.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {centroCosto.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(centroCosto)}
                          title="Editar"
                          aria-label={`Editar ${centroCosto.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(centroCosto)}
                          title="Eliminar"
                          aria-label={`Eliminar ${centroCosto.nombre}`}
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
                        No se encontraron centros de costo
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


import {
  FolderKanban,
  Pencil,
  Plus,
  ReceiptText,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { TipoComprobante } from '../../types/tipoComprobante'
import { TablePagination } from '../ui/TablePagination'

interface TablaTiposComprobanteProps {
  tiposComprobante: TipoComprobante[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (tipoComprobante: TipoComprobante) => void
  onEliminar: (tipoComprobante: TipoComprobante) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaTiposComprobante({
  tiposComprobante,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaTiposComprobanteProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de tipos de comprobante
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar tipo de comprobante
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de tipo de comprobante</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tiposComprobante.length > 0 ? (
                tiposComprobante.map((tipoComprobante) => (
                  <tr key={tipoComprobante.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {tipoComprobante.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <ReceiptText size={16} />
                        </span>
                        {tipoComprobante.nombre}
                      </div>
                    </td>

                    <td>{tipoComprobante.descripcion}</td>
                    <td>{tipoComprobante.fechaRegistro}</td>

                    <td>
                      <span
                        className={
                          tipoComprobante.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {tipoComprobante.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(tipoComprobante)}
                          title="Editar"
                          aria-label={`Editar ${tipoComprobante.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(tipoComprobante)}
                          title="Eliminar"
                          aria-label={`Eliminar ${tipoComprobante.nombre}`}
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
                        No se encontraron tipos de comprobante
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

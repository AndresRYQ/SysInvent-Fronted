import {
  FolderKanban,
  Pencil,
  Plus,
  Eye,
  RotateCcw,
  Tags,
  Trash2,
} from 'lucide-react'

import type { TipoProducto } from '../../types/tipoProducto'
import { TablePagination } from '../ui/TablePagination'

interface TablaTiposProductoProps {
  tiposProducto: TipoProducto[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (tipoProducto: TipoProducto) => void
  onVisualizar: (tipoProducto: TipoProducto) => void
  onEliminar: (tipoProducto: TipoProducto) => void
  onReactivar: (tipoProducto: TipoProducto) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaTiposProducto({
  tiposProducto,
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
}: TablaTiposProductoProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de tipos de producto
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar tipo de producto
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre de tipo de producto</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {tiposProducto.length > 0 ? (
                tiposProducto.map((tipoProducto) => (
                  <tr key={tipoProducto.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {tipoProducto.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Tags size={16} />
                        </span>
                        {tipoProducto.nombre}
                      </div>
                    </td>

                    <td>{tipoProducto.descripcion}</td>
                    <td>
                      <span
                        className={
                          tipoProducto.activo === 1
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <span className="maestro-status__dot" aria-hidden="true" />
                        {tipoProducto.activo === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        {tipoProducto.activo === 1 ? <><button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(tipoProducto)}
                          title="Editar"
                          aria-label={`Editar ${tipoProducto.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(tipoProducto)}
                          title="Eliminar"
                          aria-label={`Eliminar ${tipoProducto.nombre}`}
                        >
                          <Trash2 size={16} />
                        </button></> : <><button type="button" className="btn maestro-action-btn" onClick={() => onVisualizar(tipoProducto)} title="Visualizar" aria-label={`Visualizar ${tipoProducto.nombre}`}><Eye size={16} /></button><button type="button" className="btn maestro-action-btn" onClick={() => onReactivar(tipoProducto)} title="Reactivar" aria-label={`Reactivar ${tipoProducto.nombre}`}><RotateCcw size={16} /></button></>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <div className="maestro-empty-state">
                      <FolderKanban size={28} />
                      <p className="mb-1">
                        No se encontraron tipos de producto
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

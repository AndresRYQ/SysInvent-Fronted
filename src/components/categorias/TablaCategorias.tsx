import {
  FolderKanban,
  Pencil,
  Plus,
  Eye,
  RotateCcw,
  Tag,
  Trash2,
} from 'lucide-react'

import type { Categoria } from '../../types/categoria'
import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

interface TablaCategoriasProps {
  categorias: Categoria[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (categoria: Categoria) => void
  onVisualizar?: (categoria: Categoria) => void
  onEliminar: (categoria: Categoria) => void
  onReactivar?: (categoria: Categoria) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaCategorias({
  categorias,
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
}: TablaCategoriasProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de categorías
            </span>
          </div>

          <button
            type="button"
            className="btn table-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar categoría
          </button>
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Nombre de categoría</th>
                <th>Descripción</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>
                      <span className="table-id-chip">
                        {categoria.id}
                      </span>
                    </td>

                    <td>
                      <div className="table-cell-main">
                        <span className="table-cell-icon">
                          <Tag size={16} />
                        </span>
                        {categoria.nombre}
                      </div>
                    </td>

                    <td>{categoria.descripcion}</td>
                    <td>
                      <span
                        className={
                          categoria.activo === 1
                            ? 'status-label status-label--active'
                            : 'status-label status-label--inactive'
                        }
                      >
                        <span className="status-label__dot" aria-hidden="true" />
                        {categoria.activo === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="table-actions">
                        {categoria.activo === 1 ? <><button
                          type="button"
                          className="btn table-action-btn"
                          onClick={() => onEditar(categoria)}
                          title="Editar"
                          aria-label={`Editar ${categoria.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn table-action-btn table-action-btn--danger"
                          onClick={() => onEliminar(categoria)}
                          title="Eliminar"
                          aria-label={`Eliminar ${categoria.nombre}`}
                        >
                          <Trash2 size={16} />
                        </button></> : <><button type="button" className="btn table-action-btn" onClick={() => onVisualizar?.(categoria)} title="Visualizar" aria-label={`Visualizar ${categoria.nombre}`}><Eye size={16} /></button><button type="button" className="btn table-action-btn" onClick={() => onReactivar?.(categoria)} title="Reactivar" aria-label={`Reactivar ${categoria.nombre}`}><RotateCcw size={16} /></button></>}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5}>
                    <EmptyState icon={FolderKanban} iconSize={28} title="No se encontraron categorías" description="Ajusta los filtros o limpia la búsqueda." />
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


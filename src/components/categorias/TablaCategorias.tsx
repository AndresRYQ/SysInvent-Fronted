import {
  FolderKanban,
  Eye,
  Pencil,
  Plus,
  RotateCcw,
  Tag,
  Trash2,
} from 'lucide-react'

import type { Categoria } from '../../types/categoria'
import { TablePagination } from '../ui/TablePagination'

interface TablaCategoriasProps {
  categorias: Categoria[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (categoria: Categoria) => void
  onVisualizar: (categoria: Categoria) => void
  onEliminar: (categoria: Categoria) => void
  onReactivar: (categoria: Categoria) => void
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
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de categorías
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar categoría
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
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
                    <td>{categoria.id}</td>
                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
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
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <span className="maestro-status__dot" aria-hidden="true" />
                        {categoria.activo === 1 ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>
                    <td>
                      <div className="maestro-actions">
                        {categoria.activo === 1 ? (
                          <button
                            type="button"
                            className="btn maestro-action-btn"
                            onClick={() => onEditar(categoria)}
                            title="Editar"
                            aria-label={`Editar ${categoria.nombre}`}
                          >
                            <Pencil size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn maestro-action-btn"
                            onClick={() => onVisualizar(categoria)}
                            title="Visualizar"
                            aria-label={`Visualizar ${categoria.nombre}`}
                          >
                            <Eye size={16} />
                          </button>
                        )}

                        {categoria.activo === 1 ? (
                          <button
                            type="button"
                            className="btn maestro-action-btn maestro-action-btn--danger"
                            onClick={() => onEliminar(categoria)}
                            title="Eliminar"
                            aria-label={`Eliminar ${categoria.nombre}`}
                          >
                            <Trash2 size={16} />
                          </button>
                        ) : (
                          <button
                            type="button"
                            className="btn maestro-action-btn"
                            onClick={() => onReactivar(categoria)}
                            title="Reactivar"
                            aria-label={`Reactivar ${categoria.nombre}`}
                          >
                            <RotateCcw size={16} />
                          </button>
                        )}
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
                        No se encontraron categorías
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


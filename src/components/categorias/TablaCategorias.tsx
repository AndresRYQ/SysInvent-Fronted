import {
  FolderKanban,
  Pencil,
  Plus,
  ShieldCheck,
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
  onEliminar: (categoria: Categoria) => void
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
  onEliminar,
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
                <th>ID</th>
                <th>Nombre de categoría</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {categorias.length > 0 ? (
                categorias.map((categoria) => (
                  <tr key={categoria.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {categoria.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Tag size={16} />
                        </span>
                        {categoria.nombre}
                      </div>
                    </td>

                    <td>{categoria.descripcion}</td>
                    <td>{categoria.fechaRegistro}</td>

                    <td>
                      <span
                        className={
                          categoria.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {categoria.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(categoria)}
                          title="Editar"
                          aria-label={`Editar ${categoria.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(categoria)}
                          title="Eliminar"
                          aria-label={`Eliminar ${categoria.nombre}`}
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


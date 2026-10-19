import { Eye, FolderKanban, Pencil, Plus, RotateCcw, Tag, Trash2 } from 'lucide-react'
import type { Categoria } from '../../types/categoria'
import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'
import { TableLoadingState } from '../ui/TableLoadingState'

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
  loading?: boolean
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaCategorias({ categorias, totalItems, page, pageSize, onAgregar, onEditar, onVisualizar, onEliminar, onReactivar, onPageChange, onPageSizeChange, loading = totalItems < 0 }: TablaCategoriasProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header"><span className="maestro-kicker"><FolderKanban size={16} />Listado de categorías</span><button type="button" className="btn table-toolbar-btn" onClick={onAgregar}><Plus size={18} />Agregar categoría</button></div>
        <div className="table-responsive"><TableLoadingState visible={loading} />
          <table className="table standard-table align-middle mb-0">
            <thead><tr><th>N°</th><th>Nombre de categoría</th><th>Descripción</th><th>Fecha registro</th><th>Estado</th><th className="text-center">Acciones</th></tr></thead>
            <tbody>
              {categorias.length ? categorias.map((categoria, index) => (
                <tr key={categoria.id}>
                  <td><span className="table-id-chip">{((page - 1) * pageSize) + index + 1}</span></td>
                  <td><div className="table-cell-main"><span className="table-cell-icon"><Tag size={16} /></span>{categoria.nombre}</div></td>
                  <td>{categoria.descripcion}</td>
                  <td>{categoria.fechaRegistro ?? '—'}</td>
                  <td><span className={categoria.activo === 1 ? 'status-label status-label--active' : 'status-label status-label--inactive'}><span className="status-label__dot" aria-hidden="true" />{categoria.activo === 1 ? 'Activo' : 'Inactivo'}</span></td>
                  <td><div className="table-actions">{categoria.activo === 1 ? <><button type="button" className="btn table-action-btn" onClick={() => onVisualizar(categoria)} title="Visualizar" aria-label={`Visualizar ${categoria.nombre}`}><Eye size={16} /></button><button type="button" className="btn table-action-btn" onClick={() => onEditar(categoria)} title="Editar" aria-label={`Editar ${categoria.nombre}`}><Pencil size={16} /></button><button type="button" className="btn table-action-btn table-action-btn--danger" onClick={() => onEliminar(categoria)} title="Desactivar" aria-label={`Desactivar ${categoria.nombre}`}><Trash2 size={16} /></button></> : <><button type="button" className="btn table-action-btn" onClick={() => onVisualizar(categoria)} title="Visualizar" aria-label={`Visualizar ${categoria.nombre}`}><Eye size={16} /></button><button type="button" className="btn table-action-btn" onClick={() => onReactivar(categoria)} title="Reactivar" aria-label={`Reactivar ${categoria.nombre}`}><RotateCcw size={16} /></button></>}</div></td>
                </tr>
              )) : <tr><td colSpan={6}><EmptyState icon={FolderKanban} iconSize={28} title="No se encontraron categorías" description="Ajusta los filtros o limpia la búsqueda." /></td></tr>}
            </tbody>
          </table>
        </div>
        <TablePagination totalItems={totalItems} page={page} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      </div>
    </section>
  )
}

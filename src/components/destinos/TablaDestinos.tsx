import { Eye, FolderKanban, MapPin, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react'
import { EmptyState } from '../common/EmptyState'
import type { Destino } from '../../types/destino'
import { TablePagination } from '../ui/TablePagination'
import { TableLoadingState } from '../ui/TableLoadingState'

interface Props {
  destinos: Destino[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (item: Destino) => void
  onVisualizar: (item: Destino) => void
  onEliminar: (item: Destino) => void
  onReactivar: (item: Destino) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (size: number) => void
  loading?: boolean
}

export function TablaDestinos({ destinos, totalItems, page, pageSize, onAgregar, onEditar, onVisualizar, onEliminar, onReactivar, onPageChange, onPageSizeChange, loading = totalItems < 0 }: Props) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <span className="maestro-kicker"><FolderKanban size={16} />Listado de destinos</span>
          <button type="button" className="btn table-toolbar-btn" onClick={onAgregar}><Plus size={18} />Agregar destino</button>
        </div>
        <div className="table-responsive"><TableLoadingState visible={loading} />
          <table className="table standard-table align-middle mb-0">
            <thead><tr><th>N°</th><th>Nombre de destino</th><th>Descripción</th><th>Fecha registro</th><th>Estado</th><th className="text-center">Acciones</th></tr></thead>
            <tbody>
              {destinos.length ? destinos.map((item, index) => (
                <tr key={item.id}>
                  <td><span className="table-id-chip">{((page - 1) * pageSize) + index + 1}</span></td>
                  <td><div className="table-cell-main"><span className="table-cell-icon"><MapPin size={16} /></span>{item.nombre}</div></td>
                  <td>{item.descripcion}</td>
                  <td>{item.fechaRegistro ?? '—'}</td>
                  <td><span className={item.activo === 1 ? 'status-label status-label--active' : 'status-label status-label--inactive'}><span className="status-label__dot" aria-hidden="true" />{item.activo === 1 ? 'Activo' : 'Inactivo'}</span></td>
                  <td><div className="table-actions">{item.activo === 1 ? <><button type="button" className="btn table-action-btn" onClick={() => onVisualizar(item)} title="Visualizar"><Eye size={16} /></button><button type="button" className="btn table-action-btn" onClick={() => onEditar(item)} title="Editar"><Pencil size={16} /></button><button type="button" className="btn table-action-btn table-action-btn--danger" onClick={() => onEliminar(item)} title="Desactivar"><Trash2 size={16} /></button></> : <><button type="button" className="btn table-action-btn" onClick={() => onVisualizar(item)} title="Visualizar"><Eye size={16} /></button><button type="button" className="btn table-action-btn" onClick={() => onReactivar(item)} title="Reactivar"><RotateCcw size={16} /></button></>}</div></td>
                </tr>
              )) : <tr><td colSpan={6}><EmptyState icon={FolderKanban} iconSize={28} title="No se encontraron destinos" description="Ajusta los filtros o limpia la búsqueda." /></td></tr>}
            </tbody>
          </table>
        </div>
        <TablePagination totalItems={totalItems} page={page} pageSize={pageSize} onPageChange={onPageChange} onPageSizeChange={onPageSizeChange} />
      </div>
    </section>
  )
}

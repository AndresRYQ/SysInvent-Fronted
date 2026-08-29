import {
  FolderKanban,
  MapPin,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { Destino } from '../../types/destino'
import { TablePagination } from '../ui/TablePagination'

interface TablaDestinosProps {
  destinos: Destino[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (destino: Destino) => void
  onEliminar: (destino: Destino) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

export function TablaDestinos({
  destinos,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaDestinosProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <FolderKanban size={16} />
              Listado de destinos
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar destino
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre de destino</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {destinos.length > 0 ? (
                destinos.map((destino) => (
                  <tr key={destino.id}>
                    <td>
                      <span className="maestro-id-chip">{destino.id}</span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <MapPin size={16} />
                        </span>
                        {destino.nombre}
                      </div>
                    </td>

                    <td>{destino.descripcion}</td>
                    <td>{destino.fechaRegistro}</td>

                    <td>
                      <span
                        className={
                          destino.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {destino.estado ? 'Activo' : 'Inactivo'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(destino)}
                          title="Editar"
                          aria-label={`Editar ${destino.nombre}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(destino)}
                          title="Eliminar"
                          aria-label={`Eliminar ${destino.nombre}`}
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
                      <p className="mb-1">No se encontraron destinos</p>
                      <span>Ajusta los filtros o limpia la búsqueda.</span>
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

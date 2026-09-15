import {
  Boxes,
  Pencil,
  Plus,
  RotateCcw,
  Eye,
  Trash2,
} from 'lucide-react'

import type { ParteEquipo } from '../../types/parteEquipo'

import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

interface TablaPartesEquipoProps {
  partesEquipo: ParteEquipo[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (
    parteEquipo: ParteEquipo,
  ) => void
  onEliminar: (
    parteEquipo: ParteEquipo,
  ) => void
  onReactivar: (
    parteEquipo: ParteEquipo,
  ) => void
  onVisualizar: (
    parteEquipo: ParteEquipo,
  ) => void
  onPageChange: (
    page: number,
  ) => void
  onPageSizeChange: (
    pageSize: number,
  ) => void
}

export function TablaPartesEquipo({
  partesEquipo,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onReactivar,
  onVisualizar,
  onPageChange,
  onPageSizeChange,
}: TablaPartesEquipoProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <span className="maestro-kicker">
            <Boxes size={16} />
            Listado de partes de equipo
          </span>

          <button
            type="button"
            className="btn table-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar parte
          </button>
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Código</th>
                <th>Nombre</th>
                <th>Descripción</th>
                <th>Fecha de registro</th>
                <th>Estado</th>
                <th className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {partesEquipo.length > 0 ? (
                partesEquipo.map(
                  (parte) => (
                    <tr key={parte.id}>
                      <td>
                        <span className="table-id-chip">
                          {Number(parte.id)}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {parte.codigo}
                        </strong>
                      </td>

                      <td>
                        <div className="table-cell-main">
                          <span className="table-cell-icon">
                            <Boxes
                              size={16}
                            />
                          </span>

                          {parte.nombre}
                        </div>
                      </td>

                      <td>
                        {parte.descripcion}
                      </td>

                      <td>
                        {
                          parte.fechaRegistro
                        }
                      </td>

                      <td>
                        <span
                          className={
                            parte.estado
                              ? 'status-label status-label--active'
                              : 'status-label status-label--inactive'
                          }
                        >
                          <span
                            className="status-label__dot"
                            aria-hidden="true"
                          />

                          {parte.estado
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                          {parte.estado ? <button
                            type="button"
                            className="btn table-action-btn"
                            title="Editar"
                            aria-label={`Editar ${parte.nombre}`}
                            onClick={() =>
                              onEditar(parte)
                            }
                          >
                            <Pencil
                              size={16}
                            />
                          </button> : <><button type="button" className="btn table-action-btn" title="Visualizar" aria-label={`Visualizar ${parte.nombre}`} onClick={() => onVisualizar(parte)}><Eye size={16} /></button><button type="button" className="btn table-action-btn" title="Reactivar" aria-label={`Reactivar ${parte.nombre}`} onClick={() => onReactivar(parte)}><RotateCcw size={16} /></button></>}

                          {parte.estado && <button
                            type="button"
                            className="btn table-action-btn table-action-btn--danger"
                            title="Eliminar"
                            aria-label={`Eliminar ${parte.nombre}`}
                            onClick={() =>
                              onEliminar(parte)
                            }
                          >
                            <Trash2
                              size={16}
                            />
                          </button>}
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Boxes} iconSize={28} title="No se encontraron partes de equipo" description="Ajusta los filtros o limpia la búsqueda." />
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
          onPageSizeChange={
            onPageSizeChange
          }
        />
      </div>
    </section>
  )
}

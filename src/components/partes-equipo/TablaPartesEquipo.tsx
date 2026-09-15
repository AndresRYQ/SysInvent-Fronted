import {
  Boxes,
  Pencil,
  Plus,
  RotateCcw,
  Eye,
  Trash2,
} from 'lucide-react'

import type { ParteEquipo } from '../../types/parteEquipo'

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
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <span className="maestro-kicker">
            <Boxes size={16} />
            Listado de partes de equipo
          </span>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar parte
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
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
                        <span className="maestro-id-chip">
                          {Number(parte.id)}
                        </span>
                      </td>

                      <td>
                        <strong>
                          {parte.codigo}
                        </strong>
                      </td>

                      <td>
                        <div className="maestro-cell-main">
                          <span className="maestro-cell-icon">
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
                        <div className="maestro-actions">
                          {parte.estado ? <button
                            type="button"
                            className="btn maestro-action-btn"
                            title="Editar"
                            aria-label={`Editar ${parte.nombre}`}
                            onClick={() =>
                              onEditar(parte)
                            }
                          >
                            <Pencil
                              size={16}
                            />
                          </button> : <><button type="button" className="btn maestro-action-btn" title="Visualizar" aria-label={`Visualizar ${parte.nombre}`} onClick={() => onVisualizar(parte)}><Eye size={16} /></button><button type="button" className="btn maestro-action-btn" title="Reactivar" aria-label={`Reactivar ${parte.nombre}`} onClick={() => onReactivar(parte)}><RotateCcw size={16} /></button></>}

                          {parte.estado && <button
                            type="button"
                            className="btn maestro-action-btn maestro-action-btn--danger"
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
                    <div className="maestro-empty-state">
                      <Boxes size={28} />

                      <p className="mb-1">
                        No se encontraron partes
                        de equipo
                      </p>

                      <span>
                        Ajusta los filtros o
                        limpia la búsqueda.
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
          onPageSizeChange={
            onPageSizeChange
          }
        />
      </div>
    </section>
  )
}

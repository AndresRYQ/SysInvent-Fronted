import {
  Building2,
  Mail,
  Eye,
  Pencil,
  Phone,
  Plus,
  RotateCcw,
  Trash2,
} from 'lucide-react'

import type { Proveedor } from '../../types/proveedor'
import { EmptyState } from '../common/EmptyState'
import { TablePagination } from '../ui/TablePagination'

interface TablaProveedoresProps {
  proveedores: Proveedor[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (proveedor: Proveedor) => void
  onVisualizar: (proveedor: Proveedor) => void
  onEliminar: (proveedor: Proveedor) => void
  onReactivar: (proveedor: Proveedor) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (
    pageSize: number,
  ) => void
}

export function TablaProveedores({
  proveedores,
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
}: TablaProveedoresProps) {
  return (
    <section className="table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="table-header">
          <span className="maestro-kicker">
            <Building2 size={16} />
            Listado de proveedores
          </span>

          <button
            type="button"
            className="btn table-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar proveedor
          </button>
        </div>

        <div className="table-responsive">
          <table className="table standard-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>RUC</th>
                <th>Razón social</th>
                <th>Contacto</th>
                <th>Dirección</th>
                <th>Estado</th>
                <th className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {proveedores.length > 0 ? (
                proveedores.map(
                  (proveedor) => (
                    <tr key={proveedor.id}>
                      <td>
                        <span className="table-id-chip">
                          {proveedor.id}
                        </span>
                      </td>

                      <td>{proveedor.ruc}</td>

                      <td>
                        <div className="table-cell-main">
                          <span className="table-cell-icon">
                            <Building2
                              size={16}
                            />
                          </span>

                          {proveedor.razonSocial}
                        </div>
                      </td>

                      <td>
                        <div className="d-flex flex-column gap-1">
                          <span className="d-flex align-items-center gap-2">
                            <Mail size={14} />
                            {proveedor.correo}
                          </span>

                          <span className="d-flex align-items-center gap-2 text-muted">
                            <Phone size={14} />
                            {proveedor.telefono}
                          </span>
                        </div>
                      </td>

                      <td>
                        {proveedor.direccion}
                      </td>

                      <td>
                        <span
                          className={
                            proveedor.activo === 1
                              ? 'status-label status-label--active'
                              : 'status-label status-label--inactive'
                          }
                        >
                          <span className="status-label__dot" aria-hidden="true" />

                          {proveedor.activo === 1
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div className="table-actions">
                        {proveedor.activo === 1 ? <><button
                            type="button"
                            className="btn table-action-btn"
                            title="Editar"
                            aria-label={`Editar ${proveedor.razonSocial}`}
                            onClick={() =>
                              onEditar(
                                proveedor,
                              )
                            }
                          >
                            <Pencil size={16} />
                          </button>

                          <button
                            type="button"
                            className="btn table-action-btn table-action-btn--danger"
                          title="Desactivar"
                            aria-label={`Eliminar ${proveedor.razonSocial}`}
                            onClick={() =>
                              onEliminar(
                                proveedor,
                              )
                            }
                          >
                            <Trash2 size={16} />
                        </button></> : <><button type="button" className="btn table-action-btn" title="Visualizar" onClick={() => onVisualizar(proveedor)}><Eye size={16} /></button><button type="button" className="btn table-action-btn" title="Reactivar" onClick={() => onReactivar(proveedor)}><RotateCcw size={16} /></button></>}
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={7}>
                    <EmptyState icon={Building2} iconSize={28} title="No se encontraron proveedores" description="Ajusta los filtros o registra un proveedor." />
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

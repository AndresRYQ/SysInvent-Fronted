import {
  Building2,
  Mail,
  Pencil,
  Phone,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { Proveedor } from '../../types/proveedor'
import { TablePagination } from '../ui/TablePagination'

interface TablaProveedoresProps {
  proveedores: Proveedor[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (proveedor: Proveedor) => void
  onEliminar: (proveedor: Proveedor) => void
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
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaProveedoresProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <span className="maestro-kicker">
            <Building2 size={16} />
            Listado de proveedores
          </span>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar proveedor
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>RUC</th>
                <th>Razón social</th>
                <th>Contacto</th>
                <th>Dirección</th>
                <th>Registro</th>
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
                        <span className="maestro-id-chip">
                          {proveedor.id}
                        </span>
                      </td>

                      <td>{proveedor.ruc}</td>

                      <td>
                        <div className="maestro-cell-main">
                          <span className="maestro-cell-icon">
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
                        {proveedor.fechaRegistro}
                      </td>

                      <td>
                        <span
                          className={
                            proveedor.estado
                              ? 'maestro-status maestro-status--active'
                              : 'maestro-status maestro-status--inactive'
                          }
                        >
                          <ShieldCheck
                            size={14}
                          />

                          {proveedor.estado
                            ? 'Activo'
                            : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div className="maestro-actions">
                          <button
                            type="button"
                            className="btn maestro-action-btn"
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
                            className="btn maestro-action-btn maestro-action-btn--danger"
                            title="Eliminar"
                            aria-label={`Eliminar ${proveedor.razonSocial}`}
                            onClick={() =>
                              onEliminar(
                                proveedor,
                              )
                            }
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="maestro-empty-state">
                      <Building2 size={28} />

                      <p className="mb-1">
                        No se encontraron proveedores
                      </p>

                      <span>
                        Ajusta los filtros o registra un proveedor.
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
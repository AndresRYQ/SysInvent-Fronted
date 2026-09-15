import {
  Pencil,
  Plus,
  RotateCcw,
  Eye,
  Trash2,
  UserRound,
  Users,
} from 'lucide-react'

import type { Contacto } from '../../types/contacto'
import type { Proveedor } from '../../types/proveedor'

import { TablePagination } from '../ui/TablePagination'

interface TablaContactosProps {
  contactos: Contacto[]
  proveedores: Proveedor[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (
    contacto: Contacto,
  ) => void
  onVisualizar: (
    contacto: Contacto,
  ) => void
  onEliminar: (
    contacto: Contacto,
  ) => void
  onReactivar: (
    contacto: Contacto,
  ) => void
  onPageChange: (
    page: number,
  ) => void
  onPageSizeChange: (
    pageSize: number,
  ) => void
}

export function TablaContactos({
  contactos,
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
}: TablaContactosProps) {
  function obtenerProveedor(
    proveedorId: string,
  ): string {
    return (
      proveedores.find(
        (proveedor) =>
          String(proveedor.id) === proveedorId,
      )?.razonSocial ??
      'Proveedor no disponible'
    )
  }

  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <span className="maestro-kicker">
            <Users size={16} />
            Listado de contactos
          </span>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar contacto
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>N°</th>
                <th>Contacto</th>
                <th>Proveedor</th>
                <th>Cargo</th>
                <th>Teléfono</th>
                <th>Estado</th>
                <th className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {contactos.length > 0 ? (
                contactos.map(
                  (contacto) => (
                    <tr key={contacto.id}>
                      <td>
                        <span className="maestro-id-chip">
                          {contacto.id}
                        </span>
                      </td>

                      <td>
                        <div className="maestro-cell-main">
                          <span className="maestro-cell-icon">
                            <UserRound
                              size={16}
                            />
                          </span>

                          <div>
                            <strong>
                              {
                                contacto.nombreCompleto
                              }
                            </strong>

                            <div className="small text-muted">
                              {contacto.correo}
                            </div>
                          </div>
                        </div>
                      </td>

                      <td>
                        {obtenerProveedor(
                          contacto.proveedorId,
                        )}
                      </td>

                      <td>
                        {contacto.cargo}
                      </td>

                      <td>
                        {contacto.telefono}
                      </td>

                      <td>
                        <span
                          className={
                            contacto.activo === 1
                              ? 'status-label status-label--active'
                              : 'status-label status-label--inactive'
                          }
                        >
                          <span
                            className="status-label__dot"
                            aria-hidden="true"
                          />

                          {contacto.activo === 1 ? 'Activo' : 'Inactivo'}
                        </span>
                      </td>

                      <td>
                        <div className="maestro-actions">
                          {contacto.activo === 1 ? <>
                            <button type="button" className="btn maestro-action-btn" title="Editar" aria-label={`Editar ${contacto.nombreCompleto}`} onClick={() => onEditar(contacto)}><Pencil size={16} /></button>
                            <button type="button" className="btn maestro-action-btn maestro-action-btn--danger" title="Desactivar" aria-label={`Desactivar ${contacto.nombreCompleto}`} onClick={() => onEliminar(contacto)}><Trash2 size={16} /></button>
                          </> : <>
                            <button type="button" className="btn maestro-action-btn" title="Visualizar" aria-label={`Visualizar ${contacto.nombreCompleto}`} onClick={() => onVisualizar(contacto)}><Eye size={16} /></button>
                            <button type="button" className="btn maestro-action-btn" title="Reactivar" aria-label={`Reactivar ${contacto.nombreCompleto}`} onClick={() => onReactivar(contacto)}><RotateCcw size={16} /></button>
                          </>}
                        </div>
                      </td>
                    </tr>
                  ),
                )
              ) : (
                <tr>
                  <td colSpan={7}>
                    <div className="maestro-empty-state">
                      <Users size={28} />

                      <p className="mb-1">
                        No se encontraron
                        contactos
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

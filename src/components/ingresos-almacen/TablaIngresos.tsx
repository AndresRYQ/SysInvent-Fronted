
import {
  Archive,
  CalendarDays,
  PackagePlus,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { IngresoAlmacen } from '../../types/ingresoAlmacen'
import { TablePagination } from '../ui/TablePagination'

interface TablaIngresosProps {
  ingresos: IngresoAlmacen[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (ingreso: IngresoAlmacen) => void
  onEliminar: (ingreso: IngresoAlmacen) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (pageSize: number) => void
}

function formatearCantidad(ingreso: IngresoAlmacen) {
  return `${ingreso.cantidad} ${ingreso.unidadMedida}`
}

export function TablaIngresos({
  ingresos,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaIngresosProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <div>
            <span className="maestro-kicker">
              <PackagePlus size={16} />
              Listado de ingresos
            </span>
          </div>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Registrar ingreso
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>ID</th>
                <th>Nro. ingreso</th>
                <th>Fecha</th>
                <th>Proveedor</th>
                <th>Producto</th>
                <th>Cantidad</th>
                <th>Almacén</th>
                <th>Estado</th>
                <th className="text-center">Acciones</th>
              </tr>
            </thead>

            <tbody>
              {ingresos.length > 0 ? (
                ingresos.map((ingreso) => (
                  <tr key={ingreso.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {ingreso.id}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Archive size={16} />
                        </span>
                        {ingreso.numeroIngreso}
                      </div>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <CalendarDays size={16} />
                        </span>
                        {ingreso.fechaRegistro}
                      </div>
                    </td>

                    <td>{ingreso.proveedor}</td>
                    <td>{ingreso.producto}</td>
                    <td>{formatearCantidad(ingreso)}</td>
                    <td>{ingreso.almacen}</td>

                    <td>
                      <span
                        className={
                          ingreso.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />
                        {ingreso.estado ? 'Activo' : 'Anulado'}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-actions">
                        <button
                          type="button"
                          className="btn maestro-action-btn"
                          onClick={() => onEditar(ingreso)}
                          title="Editar"
                          aria-label={`Editar ${ingreso.numeroIngreso}`}
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          onClick={() => onEliminar(ingreso)}
                          title="Anular"
                          aria-label={`Anular ${ingreso.numeroIngreso}`}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={9}>
                    <div className="maestro-empty-state">
                      <PackagePlus size={28} />
                      <p className="mb-1">
                        No se encontraron ingresos
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

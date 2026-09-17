import {
  Boxes,
  Building2,
  Pencil,
  Plus,
  ShieldCheck,
  Trash2,
} from 'lucide-react'

import type { Producto } from '../../types/producto'
import { TablePagination } from '../ui/TablePagination'

export interface ProductoFila
  extends Producto {
  tipoProductoNombre: string
  categoriaNombre: string
  unidadMedidaNombre: string
  proveedorNombre: string
}

interface TablaProductosProps {
  productos: ProductoFila[]
  totalItems: number
  page: number
  pageSize: number
  onAgregar: () => void
  onEditar: (producto: Producto) => void
  onEliminar: (producto: Producto) => void
  onPageChange: (page: number) => void
  onPageSizeChange: (
    pageSize: number,
  ) => void
}

function formatearMoneda(
  valor: number,
): string {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN',
  }).format(valor)
}

export function TablaProductos({
  productos,
  totalItems,
  page,
  pageSize,
  onAgregar,
  onEditar,
  onEliminar,
  onPageChange,
  onPageSizeChange,
}: TablaProductosProps) {
  return (
    <section className="maestro-table-card card border-0 shadow-sm">
      <div className="card-body p-0">
        <div className="maestro-table-header">
          <span className="maestro-kicker">
            <Boxes size={16} />
            Listado de productos
          </span>

          <button
            type="button"
            className="btn maestro-toolbar-btn"
            onClick={onAgregar}
          >
            <Plus size={18} />
            Agregar producto
          </button>
        </div>

        <div className="table-responsive">
          <table className="table maestro-table align-middle mb-0">
            <thead>
              <tr>
                <th>Código</th>
                <th>Producto</th>
                <th>Clasificación</th>
                <th>Unidad</th>
                <th>Proveedor</th>
                <th>Precio referencial</th>
                <th>Estado</th>
                <th className="text-center">
                  Acciones
                </th>
              </tr>
            </thead>

            <tbody>
              {productos.length > 0 ? (
                productos.map((producto) => (
                  <tr key={producto.id}>
                    <td>
                      <span className="maestro-id-chip">
                        {producto.codigo}
                      </span>
                    </td>

                    <td>
                      <div className="maestro-cell-main">
                        <span className="maestro-cell-icon">
                          <Boxes size={16} />
                        </span>

                        <div>
                          <strong>
                            {producto.nombre}
                          </strong>

                          <div className="small text-muted">
                            {producto.id}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td>
                      <div>
                        {
                          producto.tipoProductoNombre
                        }
                      </div>

                      <small className="text-muted">
                        {
                          producto.categoriaNombre
                        }
                      </small>
                    </td>

                    <td>
                      {
                        producto.unidadMedidaNombre
                      }
                    </td>

                    <td>
                      <span className="d-flex align-items-center gap-2">
                        <Building2 size={14} />
                        {
                          producto.proveedorNombre
                        }
                      </span>
                    </td>

                    <td>
                      {formatearMoneda(
                        producto.precioUnitario,
                      )}
                    </td>

                    <td>
                      <span
                        className={
                          producto.estado
                            ? 'maestro-status maestro-status--active'
                            : 'maestro-status maestro-status--inactive'
                        }
                      >
                        <ShieldCheck size={14} />

                        {producto.estado
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
                          aria-label={`Editar ${producto.nombre}`}
                          onClick={() =>
                            onEditar(producto)
                          }
                        >
                          <Pencil size={16} />
                        </button>

                        <button
                          type="button"
                          className="btn maestro-action-btn maestro-action-btn--danger"
                          title="Eliminar"
                          aria-label={`Eliminar ${producto.nombre}`}
                          onClick={() =>
                            onEliminar(producto)
                          }
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={8}>
                    <div className="maestro-empty-state">
                      <Boxes size={28} />

                      <p className="mb-1">
                        No se encontraron productos
                      </p>

                      <span>
                        Ajusta los filtros o registra
                        un producto.
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
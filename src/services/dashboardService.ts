import {
  obtenerControlAlmacen,
  obtenerMovimientosAlmacen,
} from './kardexService'
import {
  obtenerProductos,
} from './productoService'
import {
  obtenerIngresosAlmacen,
} from './ingresoAlmacenService'
import {
  obtenerValesConsumo,
} from './valeConsumoService'

export interface MovimientoRecienteDashboard {
  id: string
  fecha: string
  tipo: 'Ingreso' | 'Vale'
  documento: string
  producto: string
  cantidad: number
  responsable: string
}

export interface AlertaDashboard {
  id: string
  titulo: string
  detalle: string
  tono: 'warning' | 'danger' | 'info'
}

export interface ResumenDashboard {
  productosActivos: number
  productosStockBajo: number
  productosSinStock: number
  ingresosDelMes: number
  valesDelMes: number
  movimientosHoy: number
  alertas: AlertaDashboard[]
  movimientosRecientes:
    MovimientoRecienteDashboard[]
}

function obtenerFechaActual(): string {
  const ahora = new Date()

  const anio = ahora.getFullYear()
  const mes = String(
    ahora.getMonth() + 1,
  ).padStart(2, '0')
  const dia = String(
    ahora.getDate(),
  ).padStart(2, '0')

  return `${anio}-${mes}-${dia}`
}

function formatearFecha(
  fecha: string,
): string {
  if (!fecha) {
    return '-'
  }

  const fechaLocal = new Date(
    `${fecha}T00:00:00`,
  )

  if (
    Number.isNaN(
      fechaLocal.getTime(),
    )
  ) {
    return fecha
  }

  return new Intl.DateTimeFormat(
    'es-PE',
    {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    },
  ).format(fechaLocal)
}

export function obtenerResumenDashboard():
  ResumenDashboard {
  const fechaActual =
    obtenerFechaActual()

  const mesActual =
    fechaActual.slice(0, 7)

  const productos =
    obtenerProductos()

  const productosActivos =
    productos.filter(
      (producto) =>
        producto.estado,
    )

  const productosActivosIds =
    new Set(
      productosActivos.map(
        (producto) =>
          producto.id,
      ),
    )

  const controlAlmacen =
    obtenerControlAlmacen().filter(
      (control) =>
        productosActivosIds.has(
          control.productoId,
        ),
    )

  const productosSinStock =
    controlAlmacen.filter(
      (control) =>
        control.stockDisponible <= 0,
    )

  const productosStockBajo =
    controlAlmacen.filter(
      (control) => {
        const producto =
          productos.find(
            (item) =>
              item.id ===
              control.productoId,
          )

        if (!producto) {
          return false
        }

        return (
          control.stockDisponible > 0 &&
          control.stockDisponible <=
            producto.stockMinimo
        )
      },
    )

  const ingresosDelMes =
    obtenerIngresosAlmacen().filter(
      (ingreso) =>
        ingreso.estado ===
          'REGISTRADO' &&
        ingreso.fechaIngreso.startsWith(
          mesActual,
        ),
    ).length

  const valesDelMes =
    obtenerValesConsumo().filter(
      (vale) =>
        vale.estado ===
          'REGISTRADO' &&
        vale.fechaVale.startsWith(
          mesActual,
        ),
    ).length

  const movimientos =
    obtenerMovimientosAlmacen()

  const movimientosHoy =
    movimientos.filter(
      (movimiento) =>
        movimiento.afectaStock &&
        movimiento.fecha ===
          fechaActual,
    ).length

  const movimientosRecientes =
    movimientos
      .filter(
        (movimiento) =>
          movimiento.afectaStock,
      )
      .slice(0, 5)
      .map((movimiento) => {
        const producto =
          productos.find(
            (item) =>
              item.id ===
              movimiento.productoId,
          )

        return {
          id: movimiento.id,
          fecha: formatearFecha(
            movimiento.fecha,
          ),
          tipo:
            movimiento.tipo ===
            'ENTRADA'
              ? 'Ingreso' as const
              : 'Vale' as const,
          documento:
            movimiento.numeroDocumento,
          producto:
            producto?.nombre ??
            'Producto no encontrado',
          cantidad:
            movimiento.cantidad,
          responsable:
            movimiento.responsable,
        }
      })

  const alertas:
    AlertaDashboard[] = []

  if (
    productosSinStock.length > 0
  ) {
    alertas.push({
      id: 'productos-sin-stock',
      titulo:
        'Productos sin stock',
      detalle:
        `${productosSinStock.length} producto(s) no tienen stock disponible.`,
      tono: 'danger',
    })
  }

  if (
    productosStockBajo.length > 0
  ) {
    alertas.push({
      id: 'productos-stock-bajo',
      titulo:
        'Productos con stock bajo',
      detalle:
        `${productosStockBajo.length} producto(s) requieren reposiciÃ³n.`,
      tono: 'warning',
    })
  }

  const ultimoMovimiento =
    movimientos.find(
      (movimiento) =>
        movimiento.afectaStock,
    )

  if (ultimoMovimiento) {
    alertas.push({
      id: 'ultima-actualizacion',
      titulo:
        'Ãšltimo movimiento',
      detalle:
        `${ultimoMovimiento.numeroDocumento} registrado el ${formatearFecha(
          ultimoMovimiento.fecha,
        )}.`,
      tono: 'info',
    })
  }

  if (alertas.length === 0) {
    alertas.push({
      id: 'inventario-sin-alertas',
      titulo:
        'Inventario actualizado',
      detalle:
        'Actualmente no existen alertas de stock.',
      tono: 'info',
    })
  }

  return {
    productosActivos:
      productosActivos.length,
    productosStockBajo:
      productosStockBajo.length,
    productosSinStock:
      productosSinStock.length,
    ingresosDelMes,
    valesDelMes,
    movimientosHoy,
    alertas,
    movimientosRecientes,
  }
}


import type {
  ControlAlmacenProducto,
  MovimientoAlmacen,
} from '../types/kardex'

import { obtenerContactos } from './contactoService'
import { obtenerIngresosAlmacen } from './ingresoAlmacenService'
import { obtenerProductos } from './productoService'
import { obtenerValesConsumo } from './valeConsumoService'

function redondearCantidad(
  cantidad: number,
): number {
  return Number(cantidad.toFixed(3))
}

function copiarMovimiento(
  movimiento: MovimientoAlmacen,
): MovimientoAlmacen {
  return {
    ...movimiento,
  }
}

function copiarControlProducto(
  control: ControlAlmacenProducto,
): ControlAlmacenProducto {
  return {
    ...control,
    movimientos:
      control.movimientos.map(
        copiarMovimiento,
      ),
  }
}

function crearMovimientosEntrada():
  MovimientoAlmacen[] {
  const ingresos =
    obtenerIngresosAlmacen()

  const contactos = obtenerContactos()

  return ingresos.flatMap((ingreso) => {
    const contacto = contactos.find(
      (item) =>
        item.id === ingreso.contactoId,
    )

    return ingreso.detalles.map(
      (detalle) => ({
        id: `MOV-ENT-${detalle.id}`,
        tipo: 'ENTRADA' as const,
        origen: 'INGRESO' as const,
        documentoId: ingreso.id,
        numeroDocumento:
          ingreso.numeroIngreso,
        fecha: ingreso.fechaIngreso,
        productoId:
          detalle.productoId,
        cantidad: detalle.cantidad,
        precioUnitario:
          detalle.precioUnitario,
        destinoId: null,
        parteEquipoId: null,
        centroCostoId: null,
        responsable:
          contacto?.nombreCompleto ??
          'Sin contacto',
        estadoDocumento:
          ingreso.estado,
        afectaStock:
          ingreso.estado ===
          'REGISTRADO',
      }),
    )
  })
}

function crearMovimientosSalida():
  MovimientoAlmacen[] {
  const vales = obtenerValesConsumo()

  return vales.flatMap((vale) =>
    vale.detalles.flatMap((detalle) =>
      detalle.distribuciones.map(
        (distribucion) => ({
          id:
            `MOV-SAL-${distribucion.id}`,
          tipo: 'SALIDA' as const,
          origen: 'VALE' as const,
          documentoId: vale.id,
          numeroDocumento:
            vale.numeroVale,
          fecha: vale.fechaVale,
          productoId:
            detalle.productoId,
          cantidad:
            distribucion.cantidad,
          precioUnitario:
            detalle.precioUnitario,
          destinoId:
            distribucion.destinoId,
          parteEquipoId:
            distribucion.parteEquipoId,
          centroCostoId:
            vale.centroCostoId,
          responsable:
            vale.solicitante,
          estadoDocumento:
            vale.estado,
          afectaStock:
            vale.estado ===
            'REGISTRADO',
        }),
      ),
    ),
  )
}

/**
 * Obtiene entradas y salidas.
 *
 * También incluye documentos anulados
 * para conservar el historial.
 */
export function obtenerMovimientosAlmacen():
  MovimientoAlmacen[] {
  const movimientos = [
    ...crearMovimientosEntrada(),
    ...crearMovimientosSalida(),
  ]

  return movimientos
    .sort((primero, segundo) => {
      const comparacionFecha =
        segundo.fecha.localeCompare(
          primero.fecha,
        )

      if (comparacionFecha !== 0) {
        return comparacionFecha
      }

      return segundo.id.localeCompare(
        primero.id,
      )
    })
    .map(copiarMovimiento)
}

/**
 * Calcula entradas, salidas y saldo
 * para cada producto.
 */
export function obtenerControlAlmacen():
  ControlAlmacenProducto[] {
  const productos = obtenerProductos()

  const movimientos =
    obtenerMovimientosAlmacen()

  return productos
    .map((producto) => {
      const movimientosProducto =
        movimientos.filter(
          (movimiento) =>
            movimiento.productoId ===
            producto.id,
        )

      const totalEntradas =
        movimientosProducto
          .filter(
            (movimiento) =>
              movimiento.afectaStock &&
              movimiento.tipo ===
                'ENTRADA',
          )
          .reduce(
            (total, movimiento) =>
              total +
              movimiento.cantidad,
            0,
          )

      const totalSalidas =
        movimientosProducto
          .filter(
            (movimiento) =>
              movimiento.afectaStock &&
              movimiento.tipo ===
                'SALIDA',
          )
          .reduce(
            (total, movimiento) =>
              total +
              movimiento.cantidad,
            0,
          )

      const stockDisponible =
        redondearCantidad(
          totalEntradas - totalSalidas,
        )

      const control:
        ControlAlmacenProducto = {
          productoId: producto.id,
          codigo: producto.codigo,
          nombre: producto.nombre,
          tipoProductoId:
            producto.tipoProductoId,
          categoriaId:
            producto.categoriaId,
          unidadMedidaId:
            producto.unidadMedidaId,
          proveedorId:
            producto.proveedorId,
          totalEntradas:
            redondearCantidad(
              totalEntradas,
            ),
          totalSalidas:
            redondearCantidad(
              totalSalidas,
            ),
          stockDisponible,
          estadoStock:
            stockDisponible > 0
              ? 'CON_STOCK'
              : 'SIN_STOCK',
          movimientos:
            movimientosProducto.map(
              copiarMovimiento,
            ),
        }

      return control
    })
    .sort((primero, segundo) =>
      primero.nombre.localeCompare(
        segundo.nombre,
        'es',
      ),
    )
    .map(copiarControlProducto)
}

export function obtenerControlProductoPorId(
  productoId: string,
): ControlAlmacenProducto | null {
  const producto =
    obtenerControlAlmacen().find(
      (item) =>
        item.productoId === productoId,
    )

  return producto
    ? copiarControlProducto(producto)
    : null
}

/**
 * Compara el saldo calculado con el
 * stock técnico guardado en Producto.
 */
export function obtenerDiferenciasStock():
  Array<{
    productoId: string
    codigo: string
    nombre: string
    stockCalculado: number
    stockRegistrado: number
    diferencia: number
  }> {
  const productos = obtenerProductos()
  const controles =
    obtenerControlAlmacen()

  return controles
    .map((control) => {
      const producto = productos.find(
        (item) =>
          item.id ===
          control.productoId,
      )

      const stockRegistrado =
        producto?.stockActual ?? 0

      return {
        productoId:
          control.productoId,
        codigo: control.codigo,
        nombre: control.nombre,
        stockCalculado:
          control.stockDisponible,
        stockRegistrado,
        diferencia:
          redondearCantidad(
            stockRegistrado -
              control.stockDisponible,
          ),
      }
    })
    .filter(
      (resultado) =>
        resultado.diferencia !== 0,
    )
}
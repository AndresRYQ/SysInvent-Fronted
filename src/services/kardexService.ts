import type {
  ControlAlmacenProducto,
  MovimientoAlmacen,
} from '../types/kardex'
import {
  ControlAlmacenControllerApi,
  type ControlAlmacenListadoResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'

import { obtenerContactos } from './contactoService'
import { obtenerIngresosAlmacen } from './ingresoAlmacenService'
import { obtenerProductos } from './productoService'
import { listarVales } from './valeConsumoService'
import type { ValeConsumo } from '../types/valeConsumo'

const controlAlmacenApi = new ControlAlmacenControllerApi(apiConfiguration)
type ResultadoControlAlmacen = {
  datos: ControlAlmacenProducto[]
  totalElementos: number
}
const solicitudesControlEnCurso = new Map<string, Promise<ResultadoControlAlmacen>>()
type ResultadoDetalleControl = {
  movimientos: MovimientoAlmacen[]
  totalElementos: number
}
const solicitudesDetalleEnCurso = new Map<string, Promise<ResultadoDetalleControl>>()

export interface ListarControlAlmacenParams {
  busqueda?: string
  tipoProductoId?: number
  categoriaId?: number
  estado?: string
  fechaDesde?: Date
  fechaHasta?: Date
  pagina?: number
  tamPagina?: number
}

function mapearControlListado(
  producto: ControlAlmacenListadoResponse,
): ControlAlmacenProducto {
  return {
    productoId: producto.productoId ?? 0,
    codigo: producto.codigo ?? '',
    nombre: producto.producto ?? '',
    tipoProductoId: 0,
    categoriaId: 0,
    unidadMedidaId: 0,
    proveedorId: 0,
    totalEntradas: Number(producto.entradas ?? 0),
    totalSalidas: Number(producto.salidas ?? 0),
    stockDisponible: Number(producto.stock ?? 0),
    estadoStock: producto.estado === 'CON_STOCK' ? 'CON_STOCK' : 'SIN_STOCK',
    movimientos: [],
    tipoProductoNombre: producto.tipo,
    categoriaNombre: producto.categoria,
    unidadMedidaNombre: producto.unidadMedida,
    proveedorNombre: producto.proveedor,
  }
}

export async function listarControlAlmacen(
  params: ListarControlAlmacenParams = {},
): Promise<ResultadoControlAlmacen> {
  const clave = JSON.stringify(params)
  const solicitudExistente = solicitudesControlEnCurso.get(clave)

  if (solicitudExistente) return solicitudExistente

  const solicitud = controlAlmacenApi
    .listar6(params)
    .then((respuesta) => ({
      datos: (respuesta.datos ?? []).map(mapearControlListado),
      totalElementos: respuesta.paginacion?.totalElementos ?? 0,
    }))
    .finally(() => solicitudesControlEnCurso.delete(clave))

  solicitudesControlEnCurso.set(clave, solicitud)
  return solicitud
}

export async function listarDetalleControlAlmacen(
  productoId: number,
  pagina = 1,
  tamPagina = 10,
): Promise<ResultadoDetalleControl> {
  const clave = JSON.stringify({ productoId, pagina, tamPagina })
  const solicitudExistente = solicitudesDetalleEnCurso.get(clave)
  if (solicitudExistente) return solicitudExistente

  const solicitud = controlAlmacenApi.detalle({
    productoId,
    pagina,
    tamPagina,
  }).then((respuesta) => {
    const movimientos = (respuesta.datos ?? []).map((movimiento, indice) => ({
      id: `MOV-${productoId}-${indice}`,
      tipo: movimiento.movimiento?.toUpperCase().includes('SAL') ? 'SALIDA' as const : 'ENTRADA' as const,
      origen: movimiento.movimiento?.toUpperCase().includes('SAL') ? 'VALE' as const : 'INGRESO' as const,
      documentoId: movimiento.documento ?? '',
      numeroDocumento: movimiento.documento ?? '',
      fecha: movimiento.fecha?.toISOString().slice(0, 10) ?? '',
      productoId,
      cantidad: Number(movimiento.cantidad ?? 0),
      precioUnitario: 0,
      destinoId: movimiento.destino ?? null,
      parteEquipoId: movimiento.parteEquipo ?? null,
      centroCostoId: movimiento.centroCosto ?? null,
      responsable: movimiento.responsable ?? '',
      estadoDocumento: movimiento.estado === 'ANULADO' ? 'ANULADO' as const : 'REGISTRADO' as const,
      afectaStock: movimiento.estado !== 'ANULADO',
    }))

    return {
      movimientos,
      totalElementos: respuesta.paginacion?.totalElementos ?? movimientos.length,
    }
  }).finally(() => solicitudesDetalleEnCurso.delete(clave))

  solicitudesDetalleEnCurso.set(clave, solicitud)
  return solicitud
}

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
        String(item.id) === String( ingreso.contactoId),
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

function crearMovimientosSalida(
  vales: ValeConsumo[],
): MovimientoAlmacen[] {
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
export async function obtenerMovimientosAlmacen(
  vales?: ValeConsumo[],
):
  Promise<MovimientoAlmacen[]> {
  const movimientos = [
    ...crearMovimientosEntrada(),
    ...crearMovimientosSalida(vales ?? await listarVales()),
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
export async function obtenerControlAlmacen(
  vales?: ValeConsumo[],
):
  Promise<ControlAlmacenProducto[]> {
  const productos = obtenerProductos()

  const movimientos =
    await obtenerMovimientosAlmacen(vales)

  return productos
    .map((producto) => {
      const movimientosProducto =
        movimientos.filter(
          (movimiento) =>
            movimiento.productoId ===
            producto.productoId,
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
          productoId: producto.productoId,
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
  productoId: number,
  vales?: ValeConsumo[],
): Promise<ControlAlmacenProducto | null> {
  return obtenerControlAlmacen(vales).then((control) => {
    const producto = control.find(
      (item) => item.productoId === productoId,
    )

    return producto
      ? copiarControlProducto(producto)
      : null
  })
}

/**
 * Compara el saldo calculado con el
 * stock técnico guardado en Producto.
 */
export function obtenerDiferenciasStock(
  vales?: ValeConsumo[],
):
  Promise<Array<{
    productoId: number
    codigo: string
    nombre: string
    stockCalculado: number
    stockRegistrado: number
    diferencia: number
  }>> {
  const productos = obtenerProductos()
  return obtenerControlAlmacen(vales).then((controles) =>
    controles
      .map((control) => {
        const producto = productos.find(
          (item) =>
            String(item.productoId) === String(control.productoId),
        )

        const stockRegistrado =
          producto?.stockActual ?? 0

        return {
          productoId: control.productoId,
          codigo: control.codigo,
          nombre: control.nombre,
          stockCalculado: control.stockDisponible,
          stockRegistrado,
          diferencia: redondearCantidad(
            stockRegistrado - control.stockDisponible,
          ),
        }
      })
      .filter((resultado) => resultado.diferencia !== 0),
  )
}


import type {
  FilaProductoMasPedido,
  FiltrosProductosMasPedidos,
  ResumenProductosMasPedidos,
} from '../types/reporteProductoMasPedido'

import type {
  FilaReporteVale,
} from '../types/reporteVale'

import { obtenerProductos } from './productoService'
import { coincidenIds } from '../utils/identificadores'

import {
  obtenerFilasReporteVales,
} from './reporteValeService'

interface ProductoAcumulado {
  productoId: number
  codigoProducto: string
  producto: string
  tipoProductoId: string
  tipoProducto: string
  categoriaId: string
  categoria: string
  unidadMedida: string
  cantidadSolicitada: number
  valesIds: Set<string>
  distribucionesIds: Set<string>
  destinosIds: Set<string>
  totalValorizado: number
}

function normalizarTexto(
  valor: string,
): string {
  return valor
    .trim()
    .toLocaleLowerCase('es')
}

function redondearCantidad(
  valor: number,
): number {
  return Number(valor.toFixed(3))
}

function redondearImporte(
  valor: number,
): number {
  return Number(valor.toFixed(2))
}

function filtrarDistribuciones(
  filtros: FiltrosProductosMasPedidos,
): FilaReporteVale[] {
  const busqueda =
    normalizarTexto(filtros.busqueda)

  const productos = obtenerProductos()

  return obtenerFilasReporteVales()
    .filter(
      (fila) =>
        fila.estado === 'REGISTRADO',
    )
    .filter((fila) => {
      const producto =
        productos.find(
          (item) =>
            coincidenIds(item.id, fila.productoId, 'PROD-'),
        )

      const coincideBusqueda =
        !busqueda ||
        normalizarTexto(
          fila.codigoProducto,
        ).includes(busqueda) ||
        normalizarTexto(
          fila.producto,
        ).includes(busqueda) ||
        normalizarTexto(
          fila.tipoProducto,
        ).includes(busqueda) ||
        normalizarTexto(
          fila.categoria,
        ).includes(busqueda)

      const coincideDesde =
        !filtros.fechaDesde ||
        fila.fechaVale >=
          filtros.fechaDesde

      const coincideHasta =
        !filtros.fechaHasta ||
        fila.fechaVale <=
          filtros.fechaHasta

      const coincideTipo =
        !filtros.tipoProductoId ||
        coincidenIds(fila.tipoProductoId, filtros.tipoProductoId, 'TP-')

      const coincideCategoria =
        !filtros.categoriaId ||
        coincidenIds(producto?.categoriaId, filtros.categoriaId, 'CAT-')

      const coincideDestino =
        !filtros.destinoId ||
        coincidenIds(fila.destinoId, filtros.destinoId, 'DES-')

      return (
        coincideBusqueda &&
        coincideDesde &&
        coincideHasta &&
        coincideTipo &&
        coincideCategoria &&
        coincideDestino
      )
    })
}

export function obtenerProductosMasPedidos(
  filtros: FiltrosProductosMasPedidos,
): FilaProductoMasPedido[] {
  const distribuciones =
    filtrarDistribuciones(filtros)

  const productos = obtenerProductos()

  const acumulados = new Map<
    number,
    ProductoAcumulado
  >()

  distribuciones.forEach((fila) => {
    const producto =
      productos.find(
        (item) =>
          coincidenIds(item.id, fila.productoId, 'PROD-'),
      )

    const existente =
      acumulados.get(fila.productoId)

    if (existente) {
      existente.cantidadSolicitada +=
        fila.cantidad

      existente.totalValorizado +=
        fila.subtotal

      existente.valesIds.add(
        fila.valeId,
      )

      existente.distribucionesIds.add(
        fila.distribucionId,
      )

      existente.destinosIds.add(
        fila.destinoId,
      )

      return
    }

    acumulados.set(
      fila.productoId,
      {
        productoId:
          fila.productoId,
        codigoProducto:
          fila.codigoProducto,
        producto: fila.producto,
        tipoProductoId:
          fila.tipoProductoId,
        tipoProducto:
          fila.tipoProducto,
        categoriaId: String(
          producto?.categoriaId ?? '',
        ),
        categoria:
          fila.categoria,
        unidadMedida:
          fila.unidadMedida,
        cantidadSolicitada:
          fila.cantidad,
        valesIds: new Set([
          fila.valeId,
        ]),
        distribucionesIds:
          new Set([
            fila.distribucionId,
          ]),
        destinosIds: new Set([
          fila.destinoId,
        ]),
        totalValorizado:
          fila.subtotal,
      },
    )
  })

  const totalCantidad =
    Array.from(
      acumulados.values(),
    ).reduce(
      (total, producto) =>
        total +
        producto.cantidadSolicitada,
      0,
    )

  return Array.from(
    acumulados.values(),
  )
    .sort((primero, segundo) => {
      const cantidad =
        segundo.cantidadSolicitada -
        primero.cantidadSolicitada

      if (cantidad !== 0) {
        return cantidad
      }

      const vales =
        segundo.valesIds.size -
        primero.valesIds.size

      if (vales !== 0) {
        return vales
      }

      return primero.producto.localeCompare(
        segundo.producto,
        'es',
      )
    })
    .map((producto, indice) => ({
      posicion: indice + 1,
      productoId:
        producto.productoId,
      codigoProducto:
        producto.codigoProducto,
      producto: producto.producto,
      tipoProductoId:
        producto.tipoProductoId,
      tipoProducto:
        producto.tipoProducto,
      categoriaId:
        producto.categoriaId,
      categoria:
        producto.categoria,
      unidadMedida:
        producto.unidadMedida,
      cantidadSolicitada:
        redondearCantidad(
          producto.cantidadSolicitada,
        ),
      numeroVales:
        producto.valesIds.size,
      numeroDistribuciones:
        producto.distribucionesIds
          .size,
      destinosAtendidos:
        producto.destinosIds.size,
      totalValorizado:
        redondearImporte(
          producto.totalValorizado,
        ),
      participacion:
        totalCantidad > 0
          ? redondearImporte(
              (producto.cantidadSolicitada /
                totalCantidad) *
                100,
            )
          : 0,
    }))
}

export function obtenerResumenProductosMasPedidos(
  filas: FilaProductoMasPedido[],
  filtros: FiltrosProductosMasPedidos,
): ResumenProductosMasPedidos {
  const distribuciones =
    filtrarDistribuciones(filtros)

  const valesIds = new Set(
    distribuciones.map(
      (fila) => fila.valeId,
    ),
  )

  const totalValorizado =
    filas.reduce(
      (total, fila) =>
        total +
        fila.totalValorizado,
      0,
    )

  const productoMasPedido =
    filas[0]

  return {
    totalProductos: filas.length,
    totalVales: valesIds.size,
    totalDistribuciones:
      distribuciones.length,
    totalValorizado:
      redondearImporte(
        totalValorizado,
      ),
    productoMasPedido:
      productoMasPedido?.producto ??
      'Sin registros',
    cantidadProductoMasPedido:
      productoMasPedido
        ?.cantidadSolicitada ?? 0,
    unidadProductoMasPedido:
      productoMasPedido
        ?.unidadMedida ?? '',
  }
}


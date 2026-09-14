import type {
  FilaProductoMasPedido,
  FiltrosProductosMasPedidos,
  ResumenProductosMasPedidos,
} from '../types/reporteProductoMasPedido'

import { obtenerCategorias } from './categoriaService'
import { obtenerProductos } from './productoService'
import { obtenerTiposProducto } from './tipoProductoService'
import { obtenerUnidadesMedida } from './unidadMedidaService'
import { obtenerValesConsumo } from './valeConsumoService'

interface ProductoAcumulado {
  productoId: string
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

function normalizarTexto(valor: string): string {
  return valor.trim().toLocaleLowerCase('es')
}

function coincideId(valor: string | number, id: string): boolean {
  return String(valor) === id
}

function redondearCantidad(valor: number): number {
  return Number(valor.toFixed(3))
}

function redondearImporte(valor: number): number {
  return Number(valor.toFixed(2))
}

export function obtenerProductosMasPedidos(
  filtros: FiltrosProductosMasPedidos,
): FilaProductoMasPedido[] {
  const productos = obtenerProductos()
  const tiposProducto = obtenerTiposProducto()
  const categorias = obtenerCategorias()
  const unidades = obtenerUnidadesMedida()
  const busqueda = normalizarTexto(filtros.busqueda)
  const acumulados = new Map<string, ProductoAcumulado>()

  obtenerValesConsumo()
    .filter((vale) => vale.estado === 'REGISTRADO')
    .filter((vale) =>
      (!filtros.fechaDesde || vale.fechaVale >= filtros.fechaDesde) &&
      (!filtros.fechaHasta || vale.fechaVale <= filtros.fechaHasta),
    )
    .forEach((vale) => {
      vale.detalles.forEach((detalle) => {
        const producto = productos.find((item) => item.id === detalle.productoId)

        if (!producto) return

        const tipo = tiposProducto.find((item) =>
          coincideId(item.id, producto.tipoProductoId),
        )
        const categoria = categorias.find((item) =>
          coincideId(item.id, producto.categoriaId),
        )

        const coincideBusqueda =
          !busqueda ||
          normalizarTexto(producto.codigo).includes(busqueda) ||
          normalizarTexto(producto.nombre).includes(busqueda) ||
          normalizarTexto(tipo?.nombre ?? '').includes(busqueda) ||
          normalizarTexto(categoria?.nombre ?? '').includes(busqueda)

        const coincideTipo =
          !filtros.tipoProductoId ||
          producto.tipoProductoId === filtros.tipoProductoId
        const coincideCategoria =
          !filtros.categoriaId ||
          producto.categoriaId === filtros.categoriaId

        if (!coincideBusqueda || !coincideTipo || !coincideCategoria) return

        detalle.distribuciones
          .filter((distribucion) =>
            !filtros.destinoId || distribucion.destinoId === filtros.destinoId,
          )
          .forEach((distribucion) => {
            const existente = acumulados.get(producto.id)
            const subtotal = distribucion.cantidad * detalle.precioUnitario
            const unidad = unidades.find((item) =>
              coincideId(item.id, producto.unidadMedidaId),
            )

            if (existente) {
              existente.cantidadSolicitada += distribucion.cantidad
              existente.totalValorizado += subtotal
              existente.valesIds.add(vale.id)
              existente.distribucionesIds.add(distribucion.id)
              existente.destinosIds.add(distribucion.destinoId)
              return
            }

            acumulados.set(producto.id, {
              productoId: producto.id,
              codigoProducto: producto.codigo,
              producto: producto.nombre,
              tipoProductoId: producto.tipoProductoId,
              tipoProducto: tipo?.nombre ?? 'Sin tipo',
              categoriaId: producto.categoriaId,
              categoria: categoria?.nombre ?? 'Sin categoría',
              unidadMedida: unidad?.nombre ?? 'Unidad',
              cantidadSolicitada: distribucion.cantidad,
              valesIds: new Set([vale.id]),
              distribucionesIds: new Set([distribucion.id]),
              destinosIds: new Set([distribucion.destinoId]),
              totalValorizado: subtotal,
            })
          })
      })
    })

  const totalCantidad = Array.from(acumulados.values()).reduce(
    (total, producto) => total + producto.cantidadSolicitada,
    0,
  )

  return Array.from(acumulados.values())
    .sort((primero, segundo) =>
      segundo.cantidadSolicitada - primero.cantidadSolicitada ||
      segundo.valesIds.size - primero.valesIds.size ||
      primero.producto.localeCompare(segundo.producto, 'es'),
    )
    .map((producto, indice) => ({
      posicion: indice + 1,
      productoId: producto.productoId,
      codigoProducto: producto.codigoProducto,
      producto: producto.producto,
      tipoProductoId: producto.tipoProductoId,
      tipoProducto: producto.tipoProducto,
      categoriaId: producto.categoriaId,
      categoria: producto.categoria,
      unidadMedida: producto.unidadMedida,
      cantidadSolicitada: redondearCantidad(producto.cantidadSolicitada),
      numeroVales: producto.valesIds.size,
      numeroDistribuciones: producto.distribucionesIds.size,
      destinosAtendidos: producto.destinosIds.size,
      totalValorizado: redondearImporte(producto.totalValorizado),
      participacion: totalCantidad > 0
        ? redondearImporte((producto.cantidadSolicitada / totalCantidad) * 100)
        : 0,
    }))
}

export function obtenerResumenProductosMasPedidos(
  filas: FilaProductoMasPedido[],
  filtros: FiltrosProductosMasPedidos,
): ResumenProductosMasPedidos {
  const vales = obtenerValesConsumo().filter((vale) =>
    vale.estado === 'REGISTRADO' &&
    (!filtros.fechaDesde || vale.fechaVale >= filtros.fechaDesde) &&
    (!filtros.fechaHasta || vale.fechaVale <= filtros.fechaHasta),
  )
  const productoMasPedido = filas[0]

  return {
    totalProductos: filas.length,
    totalVales: new Set(vales.map((vale) => vale.id)).size,
    totalDistribuciones: filas.reduce(
      (total, fila) => total + fila.numeroDistribuciones,
      0,
    ),
    totalValorizado: redondearImporte(
      filas.reduce((total, fila) => total + fila.totalValorizado, 0),
    ),
    productoMasPedido: productoMasPedido?.producto ?? 'Sin registros',
    cantidadProductoMasPedido: productoMasPedido?.cantidadSolicitada ?? 0,
    unidadProductoMasPedido: productoMasPedido?.unidadMedida ?? '',
  }
}

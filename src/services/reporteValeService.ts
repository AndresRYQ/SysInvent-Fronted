import type {
  FilaReporteVale,
  FiltrosReporteVales,
  ResumenReporteVales,
} from '../types/reporteVale'

import { obtenerCategorias } from './categoriaService'
import { obtenerCentrosCosto } from './centroCostoService'
import { obtenerDestinos } from './destinoService'
import { obtenerPartesEquipo } from './parteEquipoService'
import { obtenerProductos } from './productoService'
import { obtenerTiposProducto } from './tipoProductoService'
import { obtenerUnidadesMedida } from './unidadMedidaService'
import { obtenerValesConsumo } from './valeConsumoService'

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

export function obtenerFilasReporteVales():
  FilaReporteVale[] {
  const vales = obtenerValesConsumo()
  const centrosCosto =
    obtenerCentrosCosto()
  const destinos = obtenerDestinos()
  const partesEquipo =
    obtenerPartesEquipo()
  const productos = obtenerProductos()
  const tiposProducto =
    obtenerTiposProducto()
  const categorias = obtenerCategorias()
  const unidadesMedida =
    obtenerUnidadesMedida()

  return vales
    .flatMap((vale) => {
      const centroCosto =
        centrosCosto.find(
          (item) =>
            item.id ===
            vale.centroCostoId,
        )

      return vale.detalles.flatMap(
        (detalle) => {
          const producto =
            productos.find(
              (item) =>
                item.id ===
                detalle.productoId,
            )

          const tipoProducto =
            tiposProducto.find(
              (item) =>
                item.id ===
                producto?.tipoProductoId,
            )

          const categoria =
            categorias.find(
              (item) =>
                item.id ===
                producto?.categoriaId,
            )

          const unidadMedida =
            unidadesMedida.find(
              (item) =>
                item.id ===
                producto?.unidadMedidaId,
            )

          return detalle.distribuciones.map(
            (distribucion) => {
              const destino =
                destinos.find(
                  (item) =>
                    item.id ===
                    distribucion.destinoId,
                )

              const parteEquipo =
                distribucion.parteEquipoId
                  ? partesEquipo.find(
                      (item) =>
                        item.id ===
                        distribucion.parteEquipoId,
                    )
                  : undefined

              const subtotal =
                redondearImporte(
                  distribucion.cantidad *
                    detalle.precioUnitario,
                )

              return {
                valeId: vale.id,
                detalleId: detalle.id,
                distribucionId:
                  distribucion.id,
                numeroVale:
                  vale.numeroVale,
                fechaVale:
                  vale.fechaVale,
                estado: vale.estado,
                centroCostoId:
                  vale.centroCostoId,
                centroCosto:
                  centroCosto?.nombre ??
                  'No disponible',
                solicitante:
                  vale.solicitante,
                motivo: vale.motivo,
                tipoProductoId:
                  producto
                    ?.tipoProductoId ??
                  '',
                tipoProducto:
                  tipoProducto?.nombre ??
                  'No disponible',
                productoId:
                  detalle.productoId,
                codigoProducto:
                  producto?.codigo ??
                  'No disponible',
                producto:
                  producto?.nombre ??
                  'No disponible',
                categoria:
                  categoria?.nombre ??
                  'No disponible',
                unidadMedida:
                  unidadMedida?.nombre ??
                  'No disponible',
                destinoId:
                  distribucion.destinoId,
                destino:
                  destino?.nombre ??
                  'No disponible',
                parteEquipoId:
                  distribucion
                    .parteEquipoId ??
                  '',
                codigoParteEquipo:
                  parteEquipo?.codigo ??
                  '',
                parteEquipo:
                  parteEquipo?.nombre ??
                  'No aplica',
                cantidad:
                  redondearCantidad(
                    distribucion.cantidad,
                  ),
                precioUnitario:
                  detalle.precioUnitario,
                subtotal,
              }
            },
          )
        },
      )
    })
    .sort((primero, segundo) => {
      const fecha =
        segundo.fechaVale.localeCompare(
          primero.fechaVale,
        )

      if (fecha !== 0) {
        return fecha
      }

      const numero =
        segundo.numeroVale.localeCompare(
          primero.numeroVale,
        )

      if (numero !== 0) {
        return numero
      }

      return primero.producto.localeCompare(
        segundo.producto,
        'es',
      )
    })
}

export function filtrarReporteVales(
  filas: FilaReporteVale[],
  filtros: FiltrosReporteVales,
): FilaReporteVale[] {
  const busqueda =
    normalizarTexto(filtros.busqueda)

  return filas.filter((fila) => {
    const coincideBusqueda =
      !busqueda ||
      normalizarTexto(
        fila.numeroVale,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.solicitante,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.centroCosto,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.codigoProducto,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.producto,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.destino,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.codigoParteEquipo,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.parteEquipo,
      ).includes(busqueda)

    const coincideDesde =
      !filtros.fechaDesde ||
      fila.fechaVale >=
        filtros.fechaDesde

    const coincideHasta =
      !filtros.fechaHasta ||
      fila.fechaVale <=
        filtros.fechaHasta

    const coincideCentroCosto =
      !filtros.centroCostoId ||
      fila.centroCostoId ===
        filtros.centroCostoId

    const coincideDestino =
      !filtros.destinoId ||
      fila.destinoId ===
        filtros.destinoId

    const coincideParteEquipo =
      !filtros.parteEquipoId ||
      fila.parteEquipoId ===
        filtros.parteEquipoId

    const coincideTipoProducto =
      !filtros.tipoProductoId ||
      fila.tipoProductoId ===
        filtros.tipoProductoId

    const coincideProducto =
      !filtros.productoId ||
      fila.productoId ===
        filtros.productoId

    const coincideEstado =
      !filtros.estado ||
      fila.estado === filtros.estado

    return (
      coincideBusqueda &&
      coincideDesde &&
      coincideHasta &&
      coincideCentroCosto &&
      coincideDestino &&
      coincideParteEquipo &&
      coincideTipoProducto &&
      coincideProducto &&
      coincideEstado
    )
  })
}

export function obtenerResumenReporteVales(
  filas: FilaReporteVale[],
): ResumenReporteVales {
  const valesUnicos = new Map<
    string,
    FilaReporteVale
  >()

  filas.forEach((fila) => {
    if (
      !valesUnicos.has(fila.valeId)
    ) {
      valesUnicos.set(
        fila.valeId,
        fila,
      )
    }
  })

  const vales =
    Array.from(valesUnicos.values())

  const valesRegistrados =
    vales.filter(
      (vale) =>
        vale.estado ===
        'REGISTRADO',
    ).length

  const valesAnulados =
    vales.filter(
      (vale) =>
        vale.estado === 'ANULADO',
    ).length

  const filasRegistradas =
    filas.filter(
      (fila) =>
        fila.estado ===
        'REGISTRADO',
    )

  const cantidadTotal =
    filasRegistradas.reduce(
      (total, fila) =>
        total + fila.cantidad,
      0,
    )

  const totalValorizado =
    filasRegistradas.reduce(
      (total, fila) =>
        total + fila.subtotal,
      0,
    )

  return {
    totalVales: vales.length,
    valesRegistrados,
    valesAnulados,
    totalDistribuciones:
      filas.length,
    cantidadTotal:
      redondearCantidad(
        cantidadTotal,
      ),
    totalValorizado:
      redondearImporte(
        totalValorizado,
      ),
  }
}
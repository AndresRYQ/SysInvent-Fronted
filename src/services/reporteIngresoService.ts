import type {
  FilaReporteIngreso,
  FiltrosReporteIngresos,
  ResumenReporteIngresos,
} from '../types/reporteIngreso'

import { obtenerCategorias } from './categoriaService'
import { obtenerContactos } from './contactoService'
import { obtenerIngresosAlmacen } from './ingresoAlmacenService'
import { obtenerProductos } from './productoService'
import { obtenerProveedores } from './proveedorService'
import { obtenerTiposDocumento } from './tipoDocumentoService'
import { obtenerTiposProducto } from './tipoProductoService'
import { obtenerUnidadesMedida } from './unidadMedidaService'
import { coincidenIds } from '../utils/identificadores'

function normalizarTexto(
  valor: string,
): string {
  return valor
    .trim()
    .toLocaleLowerCase('es')
}

function redondearImporte(
  valor: number,
): number {
  return Number(valor.toFixed(2))
}

export function obtenerFilasReporteIngresos():
  FilaReporteIngreso[] {
  const ingresos =
    obtenerIngresosAlmacen()

  const proveedores =
    obtenerProveedores()

  const contactos = obtenerContactos()

  const tiposDocumento =
    obtenerTiposDocumento()

  const tiposProducto =
    obtenerTiposProducto()

  const productos = obtenerProductos()
  const categorias = obtenerCategorias()

  const unidadesMedida =
    obtenerUnidadesMedida()

  return ingresos
    .flatMap((ingreso) => {
      const proveedor =
        proveedores.find(
          (item) =>
            coincidenIds(item.id, ingreso.proveedorId, 'PROV-'),
        )

      const contacto = contactos.find(
        (item) =>
            coincidenIds(item.id, ingreso.contactoId, 'CONT-'),
      )

      const tipoDocumento =
        tiposDocumento.find(
          (item) =>
            coincidenIds(item.id, ingreso.tipoDocumentoId, 'TD-'),
        )

      return ingreso.detalles.map(
        (detalle) => {
          const producto =
            productos.find(
              (item) =>
                coincidenIds(item.id, detalle.productoId, 'PROD-'),
            )

          const tipoProducto =
            tiposProducto.find(
              (item) =>
                coincidenIds(item.id, producto?.tipoProductoId, 'TP-'),
            )

          const categoria =
            categorias.find(
              (item) =>
                coincidenIds(item.id, producto?.categoriaId, 'CAT-'),
            )

          const unidad =
            unidadesMedida.find(
              (item) =>
                coincidenIds(item.id, producto?.unidadMedidaId, 'UM-'),
            )

          const subtotal =
            redondearImporte(
              detalle.cantidad *
                detalle.precioUnitario,
            )

          return {
            ingresoId: ingreso.id,
            numeroIngreso:
              ingreso.numeroIngreso,
            fechaIngreso:
              ingreso.fechaIngreso,
            estado: ingreso.estado,
            tipoDocumento:
              tipoDocumento?.nombre ??
              'No disponible',
            numeroDocumento:
              ingreso.numeroDocumento,
            proveedorId:
              ingreso.proveedorId,
            proveedor:
              proveedor?.razonSocial ??
              'No disponible',
            contacto:
              contacto?.nombreCompleto ??
              'No disponible',
            tipoProductoId: String(
              producto?.tipoProductoId ?? '',
            ),
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
              unidad?.nombre ??
              'No disponible',
            cantidad:
              detalle.cantidad,
            precioUnitario:
              detalle.precioUnitario,
            subtotal,
            observacion:
              ingreso.observacion,
          }
        },
      )
    })
    .sort((primero, segundo) => {
      const fecha =
        segundo.fechaIngreso.localeCompare(
          primero.fechaIngreso,
        )

      if (fecha !== 0) {
        return fecha
      }

      return segundo.numeroIngreso.localeCompare(
        primero.numeroIngreso,
      )
    })
}

export function filtrarReporteIngresos(
  filas: FilaReporteIngreso[],
  filtros: FiltrosReporteIngresos,
): FilaReporteIngreso[] {
  const busqueda =
    normalizarTexto(filtros.busqueda)

  return filas.filter((fila) => {
    const coincideBusqueda =
      !busqueda ||
      normalizarTexto(
        fila.numeroIngreso,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.numeroDocumento,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.proveedor,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.codigoProducto,
      ).includes(busqueda) ||
      normalizarTexto(
        fila.producto,
      ).includes(busqueda)

    const coincideDesde =
      !filtros.fechaDesde ||
      fila.fechaIngreso >=
        filtros.fechaDesde

    const coincideHasta =
      !filtros.fechaHasta ||
      fila.fechaIngreso <=
        filtros.fechaHasta

    const coincideProveedor =
      !filtros.proveedorId ||
      coincidenIds(
        fila.proveedorId,
        filtros.proveedorId,
        'PROV-',
      )

    const coincideTipo =
      !filtros.tipoProductoId ||
      coincidenIds(
        fila.tipoProductoId,
        filtros.tipoProductoId,
        'TP-',
      )

    const coincideProducto =
      !filtros.productoId ||
      coincidenIds(
        fila.productoId,
        filtros.productoId,
        'PROD-',
      )

    const coincideEstado =
      !filtros.estado ||
      fila.estado === filtros.estado

    return (
      coincideBusqueda &&
      coincideDesde &&
      coincideHasta &&
      coincideProveedor &&
      coincideTipo &&
      coincideProducto &&
      coincideEstado
    )
  })
}

export function obtenerResumenReporteIngresos(
  filas: FilaReporteIngreso[],
): ResumenReporteIngresos {
  const ingresosUnicos = new Map<
    string,
    FilaReporteIngreso
  >()

  filas.forEach((fila) => {
    if (
      !ingresosUnicos.has(
        fila.ingresoId,
      )
    ) {
      ingresosUnicos.set(
        fila.ingresoId,
        fila,
      )
    }
  })

  const ingresos =
    Array.from(ingresosUnicos.values())

  const ingresosRegistrados =
    ingresos.filter(
      (ingreso) =>
        ingreso.estado ===
        'REGISTRADO',
    ).length

  const ingresosAnulados =
    ingresos.filter(
      (ingreso) =>
        ingreso.estado === 'ANULADO',
    ).length

  const totalValorizado = filas
    .filter(
      (fila) =>
        fila.estado === 'REGISTRADO',
    )
    .reduce(
      (total, fila) =>
        total + fila.subtotal,
      0,
    )

  return {
    totalIngresos: ingresos.length,
    ingresosRegistrados,
    ingresosAnulados,
    lineasProductos: filas.length,
    totalValorizado:
      redondearImporte(
        totalValorizado,
      ),
  }
}

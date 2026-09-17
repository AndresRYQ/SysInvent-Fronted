import type {
  DetalleIngresoAlmacen,
  IngresoAlmacenFormData,
  IngresoAlmacenRegistro,
} from '../types/ingresoAlmacen'

import { obtenerContactos } from './contactoService'
import {
  ajustarStockProducto,
  obtenerProductos,
} from './productoService'
import { obtenerProveedores } from './proveedorService'
import { obtenerTiposDocumento } from './tipoComprobanteService'
import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_ingresos_almacen'

function copiarIngreso(
  ingreso: IngresoAlmacenRegistro,
): IngresoAlmacenRegistro {
  return {
    ...ingreso,
    detalles: ingreso.detalles.map(
      (detalle) => ({
        ...detalle,
      }),
    ),
  }
}

function guardarIngresos(
  ingresos: IngresoAlmacenRegistro[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(ingresos),
  )
}

function esIngresoValido(
  valor: unknown,
): valor is IngresoAlmacenRegistro {
  if (
    typeof valor !== 'object' ||
    valor === null
  ) {
    return false
  }

  const ingreso =
    valor as Partial<IngresoAlmacenRegistro>

  return (
    typeof ingreso.id === 'string' &&
    typeof ingreso.numeroIngreso === 'string' &&
    Array.isArray(ingreso.detalles)
  )
}

export function obtenerIngresosAlmacen():
  IngresoAlmacenRegistro[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    return []
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      return []
    }

    return datos
      .filter(esIngresoValido)
      .map(copiarIngreso)
  } catch {
    return []
  }
}

export function obtenerIngresoAlmacenPorId(
  id: string,
): IngresoAlmacenRegistro | null {
  const ingreso =
    obtenerIngresosAlmacen().find(
      (item) => item.id === id,
    )

  return ingreso
    ? copiarIngreso(ingreso)
    : null
}

function crearSiguienteId(
  ingresos: IngresoAlmacenRegistro[],
): string {
  const numeroMayor = ingresos.reduce(
    (mayor, ingreso) => {
      const numero = Number(
        ingreso.id.replace('ING-', ''),
      )

      return Number.isNaN(numero)
        ? mayor
        : Math.max(mayor, numero)
    },
    0,
  )

  return `ING-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

export function obtenerSiguienteNumeroIngreso():
  string {
  const anio = new Date().getFullYear()
  const prefijo = `ING-${anio}-`

  const numeroMayor =
    obtenerIngresosAlmacen().reduce(
      (mayor, ingreso) => {
        if (
          !ingreso.numeroIngreso.startsWith(
            prefijo,
          )
        ) {
          return mayor
        }

        const numero = Number(
          ingreso.numeroIngreso.replace(
            prefijo,
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `${prefijo}${String(
    numeroMayor + 1,
  ).padStart(4, '0')}`
}

function normalizarTexto(
  valor: string,
): string {
  return valor.trim().toLowerCase()
}

function validarDatosIngreso(
  datos: IngresoAlmacenFormData,
  ingresos: IngresoAlmacenRegistro[],
  ingresoIdExcluir?: string,
): void {
  if (
    !datos.fechaIngreso ||
    Number.isNaN(
      Date.parse(datos.fechaIngreso),
    )
  ) {
    throw new Error(
      'Selecciona una fecha de ingreso válida.',
    )
  }

  const proveedor =
    obtenerProveedores().find(
      (item) =>
        item.id === datos.proveedorId,
    )

  if (!proveedor) {
    throw new Error(
      'El proveedor seleccionado no existe.',
    )
  }

  if (!proveedor.estado) {
    throw new Error(
      'El proveedor seleccionado está inactivo.',
    )
  }

  const contacto =
    obtenerContactos().find(
      (item) =>
        item.id === datos.contactoId,
    )

  if (!contacto) {
    throw new Error(
      'El contacto seleccionado no existe.',
    )
  }

  if (!contacto.estado) {
    throw new Error(
      'El contacto seleccionado está inactivo.',
    )
  }

  if (
    contacto.proveedorId !==
    datos.proveedorId
  ) {
    throw new Error(
      'El contacto no pertenece al proveedor seleccionado.',
    )
  }

  const tipoDocumento =
    obtenerTiposDocumento().find(
      (item) =>
        item.id ===
        datos.tipoComprobanteId,
    )

  if (!tipoDocumento) {
    throw new Error(
      'El tipo de documento seleccionado no existe.',
    )
  }

  if (!tipoDocumento.estado) {
    throw new Error(
      'El tipo de documento seleccionado está inactivo.',
    )
  }

  const numeroDocumento =
    datos.numeroDocumento.trim()

  if (numeroDocumento.length < 3) {
    throw new Error(
      'El número de documento debe tener al menos 3 caracteres.',
    )
  }

  if (numeroDocumento.length > 50) {
    throw new Error(
      'El número de documento no puede superar los 50 caracteres.',
    )
  }

  const documentoDuplicado =
    ingresos.some(
      (ingreso) =>
        ingreso.id !== ingresoIdExcluir &&
        ingreso.proveedorId ===
          datos.proveedorId &&
        ingreso.tipoComprobanteId ===
          datos.tipoComprobanteId &&
        normalizarTexto(
          ingreso.numeroDocumento,
        ) ===
          normalizarTexto(
            numeroDocumento,
          ),
    )

  if (documentoDuplicado) {
    throw new Error(
      'Ya existe un ingreso con ese proveedor, tipo y número de documento.',
    )
  }

  if (
    !Array.isArray(datos.detalles) ||
    datos.detalles.length === 0
  ) {
    throw new Error(
      'Agrega al menos un producto al ingreso.',
    )
  }

  const productos = obtenerProductos()

  const productosSeleccionados =
    new Set<string>()

  datos.detalles.forEach(
    (detalle, indice) => {
      const numeroFila = indice + 1

      if (
        productosSeleccionados.has(
          detalle.productoId,
        )
      ) {
        throw new Error(
          `El producto de la fila ${numeroFila} ya fue agregado al ingreso.`,
        )
      }

      productosSeleccionados.add(
        detalle.productoId,
      )

      const producto = productos.find(
        (item) =>
          item.id === detalle.productoId,
      )

      if (!producto) {
        throw new Error(
          `El producto de la fila ${numeroFila} no existe.`,
        )
      }

      if (!producto.estado) {
        throw new Error(
          `El producto "${producto.nombre}" está inactivo.`,
        )
      }

      if (
        producto.proveedorId !==
        datos.proveedorId
      ) {
        throw new Error(
          `El producto "${producto.nombre}" no pertenece al proveedor seleccionado.`,
        )
      }

      if (
        !Number.isFinite(
          detalle.cantidad,
        ) ||
        detalle.cantidad <= 0
      ) {
        throw new Error(
          `La cantidad de la fila ${numeroFila} debe ser mayor que cero.`,
        )
      }

      if (
        !Number.isFinite(
          detalle.precioUnitario,
        ) ||
        detalle.precioUnitario < 0
      ) {
        throw new Error(
          `El precio de la fila ${numeroFila} no es válido.`,
        )
      }
    },
  )

  if (
    datos.observacion.trim().length > 500
  ) {
    throw new Error(
      'La observación no puede superar los 500 caracteres.',
    )
  }
}

function crearDetalles(
  ingresoId: string,
  datos: IngresoAlmacenFormData,
): DetalleIngresoAlmacen[] {
  return datos.detalles.map(
    (detalle, indice) => ({
      id: `${ingresoId}-DET-${String(
        indice + 1,
      ).padStart(3, '0')}`,
      productoId: detalle.productoId,
      cantidad: Number(
        detalle.cantidad.toFixed(3),
      ),
      precioUnitario: Number(
        detalle.precioUnitario.toFixed(2),
      ),
    }),
  )
}

function obtenerCantidadesPorProducto(
  detalles: DetalleIngresoAlmacen[],
): Map<string, number> {
  const cantidades =
    new Map<string, number>()

  detalles.forEach((detalle) => {
    const cantidadActual =
      cantidades.get(detalle.productoId) ??
      0

    cantidades.set(
      detalle.productoId,
      cantidadActual + detalle.cantidad,
    )
  })

  return cantidades
}

function calcularAjustesStock(
  detallesAnteriores:
    DetalleIngresoAlmacen[],
  detallesNuevos:
    DetalleIngresoAlmacen[],
): Map<string, number> {
  const anteriores =
    obtenerCantidadesPorProducto(
      detallesAnteriores,
    )

  const nuevos =
    obtenerCantidadesPorProducto(
      detallesNuevos,
    )

  const productosIds = new Set([
    ...anteriores.keys(),
    ...nuevos.keys(),
  ])

  const ajustes = new Map<
    string,
    number
  >()

  productosIds.forEach((productoId) => {
    const cantidadAnterior =
      anteriores.get(productoId) ?? 0

    const cantidadNueva =
      nuevos.get(productoId) ?? 0

    const diferencia =
      cantidadNueva - cantidadAnterior

    if (diferencia !== 0) {
      ajustes.set(
        productoId,
        Number(diferencia.toFixed(3)),
      )
    }
  })

  return ajustes
}

function validarAjustesStock(
  ajustes: Map<string, number>,
): void {
  const productos = obtenerProductos()

  ajustes.forEach(
    (cantidad, productoId) => {
      if (cantidad >= 0) {
        return
      }

      const producto = productos.find(
        (item) =>
          item.id === productoId,
      )

      if (!producto) {
        throw new Error(
          'Uno de los productos del ingreso ya no existe.',
        )
      }

      if (
        producto.stockActual + cantidad <
        0
      ) {
        throw new Error(
          `No se puede realizar la operación porque "${producto.nombre}" ya tiene salidas registradas o stock insuficiente.`,
        )
      }
    },
  )
}

function aplicarAjustesStock(
  ajustes: Map<string, number>,
): void {
  const ajustesAplicados: Array<{
    productoId: string
    cantidad: number
  }> = []

  try {
    ajustes.forEach(
      (cantidad, productoId) => {
        ajustarStockProducto(
          productoId,
          cantidad,
        )

        ajustesAplicados.push({
          productoId,
          cantidad,
        })
      },
    )
  } catch (error) {
    ajustesAplicados
      .reverse()
      .forEach(
        ({
          productoId,
          cantidad,
        }) => {
          ajustarStockProducto(
            productoId,
            -cantidad,
          )
        },
      )

    throw error
  }
}

function revertirAjustesStock(
  ajustes: Map<string, number>,
): void {
  Array.from(ajustes.entries())
    .reverse()
    .forEach(
      ([productoId, cantidad]) => {
        ajustarStockProducto(
          productoId,
          -cantidad,
        )
      },
    )
}

export function crearIngresoAlmacen(
  datos: IngresoAlmacenFormData,
): IngresoAlmacenRegistro {
  const ingresos =
    obtenerIngresosAlmacen()

  validarDatosIngreso(datos, ingresos)

  const ingresoId =
    crearSiguienteId(ingresos)

  const nuevoIngreso:
    IngresoAlmacenRegistro = {
      id: ingresoId,
      numeroIngreso:
        obtenerSiguienteNumeroIngreso(),
      fechaIngreso: datos.fechaIngreso,
      proveedorId: datos.proveedorId,
      contactoId: datos.contactoId,
      tipoComprobanteId:
        datos.tipoComprobanteId,
      numeroDocumento:
        datos.numeroDocumento
          .trim()
          .toUpperCase(),
      observacion:
        datos.observacion.trim(),
      estado: 'REGISTRADO',
      detalles: crearDetalles(
        ingresoId,
        datos,
      ),
      fechaRegistro:
        new Date().toISOString(),
    }

  const ajustes = calcularAjustesStock(
    [],
    nuevoIngreso.detalles,
  )

  validarAjustesStock(ajustes)
  aplicarAjustesStock(ajustes)

  try {
    guardarIngresos([
      nuevoIngreso,
      ...ingresos,
    ])
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Ingreso de almacén',
    accion: 'CREAR',
    detalle:
      `Se registró el ingreso ${nuevoIngreso.numeroIngreso} con ${nuevoIngreso.detalles.length} producto(s).`,
    registroId: nuevoIngreso.id,
  })

  return copiarIngreso(nuevoIngreso)
}

export function actualizarIngresoAlmacen(
  id: string,
  datos: IngresoAlmacenFormData,
): IngresoAlmacenRegistro {
  const ingresos =
    obtenerIngresosAlmacen()

  const ingresoActual =
    ingresos.find(
      (ingreso) => ingreso.id === id,
    )

  if (!ingresoActual) {
    throw new Error(
      'El ingreso no existe.',
    )
  }

  if (
    ingresoActual.estado === 'ANULADO'
  ) {
    throw new Error(
      'No se puede editar un ingreso anulado.',
    )
  }

  validarDatosIngreso(
    datos,
    ingresos,
    id,
  )

  const ingresoActualizado:
    IngresoAlmacenRegistro = {
      ...ingresoActual,
      fechaIngreso: datos.fechaIngreso,
      proveedorId: datos.proveedorId,
      contactoId: datos.contactoId,
      tipoComprobanteId:
        datos.tipoComprobanteId,
      numeroDocumento:
        datos.numeroDocumento
          .trim()
          .toUpperCase(),
      observacion:
        datos.observacion.trim(),
      detalles: crearDetalles(
        ingresoActual.id,
        datos,
      ),
    }

  const ajustes = calcularAjustesStock(
    ingresoActual.detalles,
    ingresoActualizado.detalles,
  )

  validarAjustesStock(ajustes)
  aplicarAjustesStock(ajustes)

  try {
    guardarIngresos(
      ingresos.map((ingreso) =>
        ingreso.id === id
          ? ingresoActualizado
          : ingreso,
      ),
    )
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Ingreso de almacén',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el ingreso ${ingresoActualizado.numeroIngreso}.`,
    registroId:
      ingresoActualizado.id,
  })

  return copiarIngreso(
    ingresoActualizado,
  )
}

export function anularIngresoAlmacen(
  id: string,
): IngresoAlmacenRegistro {
  const ingresos =
    obtenerIngresosAlmacen()

  const ingresoActual =
    ingresos.find(
      (ingreso) => ingreso.id === id,
    )

  if (!ingresoActual) {
    throw new Error(
      'El ingreso no existe.',
    )
  }

  if (
    ingresoActual.estado === 'ANULADO'
  ) {
    throw new Error(
      'El ingreso ya se encuentra anulado.',
    )
  }

  const ingresoAnulado:
    IngresoAlmacenRegistro = {
      ...ingresoActual,
      estado: 'ANULADO',
    }

  const ajustes = calcularAjustesStock(
    ingresoActual.detalles,
    [],
  )

  validarAjustesStock(ajustes)
  aplicarAjustesStock(ajustes)

  try {
    guardarIngresos(
      ingresos.map((ingreso) =>
        ingreso.id === id
          ? ingresoAnulado
          : ingreso,
      ),
    )
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Ingreso de almacén',
    accion: 'ELIMINAR',
    detalle:
      `Se anuló el ingreso ${ingresoAnulado.numeroIngreso} y se descontaron sus productos del stock.`,
    registroId: ingresoAnulado.id,
  })

  return copiarIngreso(ingresoAnulado)
}

export function calcularTotalIngreso(
  ingreso: IngresoAlmacenRegistro,
): number {
  const total = ingreso.detalles.reduce(
    (acumulado, detalle) =>
      acumulado +
      detalle.cantidad *
        detalle.precioUnitario,
    0,
  )

  return Number(total.toFixed(2))
}

import type {
  DetalleValeConsumo,
  ValeConsumo,
  ValeConsumoFormData,
} from '../types/valeConsumo'

import { registrarEventoBitacora } from './bitacoraService'
import { obtenerCentrosCosto } from './centroCostoService'
import { obtenerDestinos } from './destinoService'
import { obtenerPartesEquipo } from './parteEquipoService'

import {
  ajustarStockProducto,
  obtenerProductos,
} from './productoService'

const STORAGE_KEY =
  'agrihusac_vales_consumo'

function copiarVale(
  vale: ValeConsumo,
): ValeConsumo {
  return {
    ...vale,
    detalles: vale.detalles.map(
      (detalle) => ({
        ...detalle,
        distribuciones:
          detalle.distribuciones.map(
            (distribucion) => ({
              ...distribucion,
            }),
          ),
      }),
    ),
  }
}

function guardarVales(
  vales: ValeConsumo[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(vales),
  )
}

function esValeValido(
  valor: unknown,
): valor is ValeConsumo {
  if (
    typeof valor !== 'object' ||
    valor === null
  ) {
    return false
  }

  const vale =
    valor as Partial<ValeConsumo>

  return (
    typeof vale.id === 'string' &&
    typeof vale.numeroVale === 'string' &&
    Array.isArray(vale.detalles)
  )
}

export function obtenerValesConsumo():
  ValeConsumo[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    return []
  }

  try {
    const datos = JSON.parse(
      datosGuardados,
    )

    if (!Array.isArray(datos)) {
      return []
    }

    return datos
      .filter(esValeValido)
      .map(copiarVale)
  } catch {
    return []
  }
}

export function obtenerValeConsumoPorId(
  id: string,
): ValeConsumo | null {
  const vale =
    obtenerValesConsumo().find(
      (item) => String(item.id) === String( id),
    )

  return vale ? copiarVale(vale) : null
}

function crearSiguienteId(
  vales: ValeConsumo[],
): string {
  const numeroMayor = vales.reduce(
    (mayor, vale) => {
      const numero = Number(
        vale.id.replace('VAL-', ''),
      )

      return Number.isNaN(numero)
        ? mayor
        : Math.max(mayor, numero)
    },
    0,
  )

  return `VAL-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

export function obtenerSiguienteNumeroVale():
  string {
  const anio = new Date().getFullYear()
  const prefijo = `VAL-${anio}-`

  const numeroMayor =
    obtenerValesConsumo().reduce(
      (mayor, vale) => {
        if (
          !vale.numeroVale.startsWith(
            prefijo,
          )
        ) {
          return mayor
        }

        const numero = Number(
          vale.numeroVale.replace(
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

export function calcularCantidadDetalle(
  detalle: DetalleValeConsumo,
): number {
  const cantidad =
    detalle.distribuciones.reduce(
      (total, distribucion) =>
        total + distribucion.cantidad,
      0,
    )

  return Number(cantidad.toFixed(3))
}

export function calcularTotalVale(
  vale: ValeConsumo,
): number {
  const total = vale.detalles.reduce(
    (acumulado, detalle) =>
      acumulado +
      calcularCantidadDetalle(detalle) *
        detalle.precioUnitario,
    0,
  )

  return Number(total.toFixed(2))
}

function validarDatosVale(
  datos: ValeConsumoFormData,
): void {
  if (
    !datos.fechaVale ||
    Number.isNaN(
      Date.parse(datos.fechaVale),
    )
  ) {
    throw new Error(
      'Selecciona una fecha vÃƒÂ¡lida.',
    )
  }

  const centroCosto =
    obtenerCentrosCosto().find(
      (item) =>
        String(item.id) === String( datos.centroCostoId),
    )

  if (!centroCosto) {
    throw new Error(
      'El centro de costo seleccionado no existe.',
    )
  }

  if (centroCosto.activo !== 1) {
    throw new Error(
      'El centro de costo seleccionado estÃƒÂ¡ inactivo.',
    )
  }

  const solicitante =
    datos.solicitante.trim()

  if (solicitante.length < 3) {
    throw new Error(
      'El solicitante debe tener al menos 3 caracteres.',
    )
  }

  if (solicitante.length > 120) {
    throw new Error(
      'El solicitante no puede superar los 120 caracteres.',
    )
  }

  const motivo = datos.motivo.trim()

  if (motivo.length < 5) {
    throw new Error(
      'El motivo debe tener al menos 5 caracteres.',
    )
  }

  if (motivo.length > 500) {
    throw new Error(
      'El motivo no puede superar los 500 caracteres.',
    )
  }

  if (
    !Array.isArray(datos.detalles) ||
    datos.detalles.length === 0
  ) {
    throw new Error(
      'Agrega al menos un producto al vale.',
    )
  }

  const productos = obtenerProductos()
  const destinos = obtenerDestinos()
  const partesEquipo =
    obtenerPartesEquipo()

  const productosAgregados =
    new Set<string>()

  datos.detalles.forEach(
    (detalle, indiceDetalle) => {
      const fila = indiceDetalle + 1

      if (
        productosAgregados.has(
          detalle.productoId,
        )
      ) {
        throw new Error(
          `El producto de la fila ${fila} estÃƒÂ¡ repetido.`,
        )
      }

      productosAgregados.add(
        detalle.productoId,
      )

      const producto = productos.find(
        (item) =>
          String(item.id) === String( detalle.productoId),
      )

      if (!producto) {
        throw new Error(
          `El producto de la fila ${fila} no existe.`,
        )
      }

      if (!producto.estado) {
        throw new Error(
          `El producto "${producto.nombre}" estÃƒÂ¡ inactivo.`,
        )
      }

      if (
        !Number.isFinite(
          detalle.precioUnitario,
        ) ||
        detalle.precioUnitario < 0
      ) {
        throw new Error(
          `El precio del producto "${producto.nombre}" no es vÃƒÂ¡lido.`,
        )
      }

      if (
        !Array.isArray(
          detalle.distribuciones,
        ) ||
        detalle.distribuciones.length ===
          0
      ) {
        throw new Error(
          `Agrega al menos un destino para "${producto.nombre}".`,
        )
      }

      const distribucionesAgregadas =
        new Set<string>()

      detalle.distribuciones.forEach(
        (
          distribucion,
          indiceDistribucion,
        ) => {
          const numeroDistribucion =
            indiceDistribucion + 1

          const destino =
            destinos.find(
              (item) =>
                String(item.id) === String(
                distribucion.destinoId),
            )

          if (!destino) {
            throw new Error(
              `El destino ${numeroDistribucion} de "${producto.nombre}" no existe.`,
            )
          }

          if (destino.activo !== 1) {
            throw new Error(
              `El destino "${destino.nombre}" estÃƒÂ¡ inactivo.`,
            )
          }

          if (
            distribucion.parteEquipoId
          ) {
            const parte =
              partesEquipo.find(
                (item) =>
                  String(item.id) === String(
                  distribucion.parteEquipoId),
              )

            if (!parte) {
              throw new Error(
                `La parte de equipo ${numeroDistribucion} de "${producto.nombre}" no existe.`,
              )
            }

            if (!parte.estado) {
              throw new Error(
                `La parte de equipo "${parte.nombre}" estÃƒÂ¡ inactiva.`,
              )
            }
          }

          if (
            !Number.isFinite(
              distribucion.cantidad,
            ) ||
            distribucion.cantidad <= 0
          ) {
            throw new Error(
              `La cantidad de la distribuciÃƒÂ³n ${numeroDistribucion} de "${producto.nombre}" debe ser mayor que cero.`,
            )
          }

          const claveDistribucion =
            `${distribucion.destinoId}|${distribucion.parteEquipoId ?? ''}`

          if (
            distribucionesAgregadas.has(
              claveDistribucion,
            )
          ) {
            throw new Error(
              `El destino y la parte de equipo estÃƒÂ¡n repetidos para "${producto.nombre}".`,
            )
          }

          distribucionesAgregadas.add(
            claveDistribucion,
          )
        },
      )
    },
  )
}

function crearDetalles(
  valeId: string,
  datos: ValeConsumoFormData,
): DetalleValeConsumo[] {
  return datos.detalles.map(
    (detalle, indiceDetalle) => {
      const detalleId =
        `${valeId}-DET-${String(
          indiceDetalle + 1,
        ).padStart(3, '0')}`

      return {
        id: detalleId,
        productoId: detalle.productoId,
        precioUnitario: Number(
          detalle.precioUnitario.toFixed(2),
        ),
        distribuciones:
          detalle.distribuciones.map(
            (
              distribucion,
              indiceDistribucion,
            ) => ({
              id:
                `${detalleId}-DIS-${String(
                  indiceDistribucion + 1,
                ).padStart(3, '0')}`,
              destinoId:
                distribucion.destinoId,
              parteEquipoId:
                distribucion.parteEquipoId ||
                null,
              cantidad: Number(
                distribucion.cantidad.toFixed(
                  3,
                ),
              ),
            }),
          ),
      }
    },
  )
}

function obtenerCantidadesPorProducto(
  detalles: DetalleValeConsumo[],
): Map<string, number> {
  const cantidades =
    new Map<string, number>()

  detalles.forEach((detalle) => {
    cantidades.set(
      detalle.productoId,
      calcularCantidadDetalle(detalle),
    )
  })

  return cantidades
}

/**
 * Calcula cuÃƒÂ¡nto debe modificarse el stock.
 *
 * Crear vale: resultado negativo.
 * Editar vale: solamente la diferencia.
 * Anular vale: resultado positivo.
 */
function calcularAjustesStock(
  detallesAnteriores:
    DetalleValeConsumo[],
  detallesNuevos:
    DetalleValeConsumo[],
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

  const ajustes =
    new Map<string, number>()

  productosIds.forEach((productoId) => {
    const cantidadAnterior =
      anteriores.get(productoId) ?? 0

    const cantidadNueva =
      nuevos.get(productoId) ?? 0

    const diferencia =
      cantidadAnterior - cantidadNueva

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
    (ajuste, productoId) => {
      const producto = productos.find(
        (item) =>
          String(item.id) === String( productoId),
      )

      if (!producto) {
        throw new Error(
          'Uno de los productos ya no existe.',
        )
      }

      if (
        ajuste < 0 &&
        producto.stockActual + ajuste < 0
      ) {
        throw new Error(
          `Stock insuficiente para "${producto.nombre}". Disponible: ${producto.stockActual}.`,
        )
      }
    },
  )
}

function aplicarAjustesStock(
  ajustes: Map<string, number>,
): void {
  const aplicados: Array<{
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

        aplicados.push({
          productoId,
          cantidad,
        })
      },
    )
  } catch (error) {
    aplicados
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

export function crearValeConsumo(
  datos: ValeConsumoFormData,
): ValeConsumo {
  validarDatosVale(datos)

  const vales = obtenerValesConsumo()
  const valeId = crearSiguienteId(vales)

  const nuevoVale: ValeConsumo = {
    id: valeId,
    numeroVale:
      obtenerSiguienteNumeroVale(),
    fechaVale: datos.fechaVale,
    centroCostoId:
      datos.centroCostoId,
    solicitante:
      datos.solicitante.trim(),
    motivo: datos.motivo.trim(),
    estado: 'REGISTRADO',
    detalles: crearDetalles(
      valeId,
      datos,
    ),
    fechaRegistro:
      new Date().toISOString(),
  }

  const ajustes = calcularAjustesStock(
    [],
    nuevoVale.detalles,
  )

  validarAjustesStock(ajustes)
  aplicarAjustesStock(ajustes)

  try {
    guardarVales([
      nuevoVale,
      ...vales,
    ])
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Vales de consumo',
    accion: 'CREAR',
    detalle:
      `Se registrÃƒÂ³ el vale ${nuevoVale.numeroVale} con ${nuevoVale.detalles.length} producto(s).`,
    registroId: nuevoVale.id,
  })

  return copiarVale(nuevoVale)
}

export function actualizarValeConsumo(
  id: string,
  datos: ValeConsumoFormData,
): ValeConsumo {
  const vales = obtenerValesConsumo()

  const valeActual = vales.find(
    (vale) => String(vale.id) === String( id),
  )

  if (!valeActual) {
    throw new Error(
      'El vale de consumo no existe.',
    )
  }

  if (
    valeActual.estado === 'ANULADO'
  ) {
    throw new Error(
      'No se puede editar un vale anulado.',
    )
  }

  validarDatosVale(datos)

  const valeActualizado:
    ValeConsumo = {
      ...valeActual,
      fechaVale: datos.fechaVale,
      centroCostoId:
        datos.centroCostoId,
      solicitante:
        datos.solicitante.trim(),
      motivo: datos.motivo.trim(),
      detalles: crearDetalles(
        valeActual.id,
        datos,
      ),
    }

  const ajustes = calcularAjustesStock(
    valeActual.detalles,
    valeActualizado.detalles,
  )

  validarAjustesStock(ajustes)
  aplicarAjustesStock(ajustes)

  try {
    guardarVales(
      vales.map((vale) =>
        vale.id === id
          ? valeActualizado
          : vale,
      ),
    )
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Vales de consumo',
    accion: 'EDITAR',
    detalle:
      `Se actualizÃƒÂ³ el vale ${valeActualizado.numeroVale}.`,
    registroId:
      valeActualizado.id,
  })

  return copiarVale(valeActualizado)
}

export function anularValeConsumo(
  id: string,
): ValeConsumo {
  const vales = obtenerValesConsumo()

  const valeActual = vales.find(
    (vale) => String(vale.id) === String( id),
  )

  if (!valeActual) {
    throw new Error(
      'El vale de consumo no existe.',
    )
  }

  if (
    valeActual.estado === 'ANULADO'
  ) {
    throw new Error(
      'El vale ya se encuentra anulado.',
    )
  }

  const valeAnulado: ValeConsumo = {
    ...valeActual,
    estado: 'ANULADO',
  }

  const ajustes = calcularAjustesStock(
    valeActual.detalles,
    [],
  )

  aplicarAjustesStock(ajustes)

  try {
    guardarVales(
      vales.map((vale) =>
        vale.id === id
          ? valeAnulado
          : vale,
      ),
    )
  } catch (error) {
    revertirAjustesStock(ajustes)
    throw error
  }

  registrarEventoBitacora({
    modulo: 'Vales de consumo',
    accion: 'ELIMINAR',
    detalle:
      `Se anulÃƒÂ³ el vale ${valeAnulado.numeroVale} y se devolvieron sus productos al stock.`,
    registroId: valeAnulado.id,
  })

  return copiarVale(valeAnulado)
}




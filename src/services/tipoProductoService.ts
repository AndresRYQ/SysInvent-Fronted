import type {
  TipoProducto,
  TipoProductoFormData,
} from '../types/tipoProducto'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_tipos_producto'

const TIPOS_PRODUCTO_INICIALES:
  TipoProducto[] = [
    {
      id: 'TP-001',
      nombre: 'Insumo',
      descripcion:
        'Materia prima utilizada en los procesos.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'TP-002',
      nombre: 'Producto terminado',
      descripcion:
        'Artículos listos para su comercialización.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'TP-003',
      nombre: 'Material de empaque',
      descripcion:
        'Insumos para el embalaje de los productos.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'TP-004',
      nombre: 'Repuesto',
      descripcion:
        'Piezas de reemplazo para mantenimiento.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'TP-005',
      nombre: 'Material de oficina',
      descripcion:
        'Útiles y suministros para labores administrativas.',
      estado: false,
      fechaRegistro: '14/08/2026',
    },
  ]

function guardarTiposProducto(
  tiposProducto: TipoProducto[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tiposProducto),
  )
}

function copiarTiposProducto(
  tiposProducto: TipoProducto[],
): TipoProducto[] {
  return tiposProducto.map(
    (tipoProducto) => ({
      ...tipoProducto,
    }),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function validarDatos(
  datos: TipoProductoFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre del tipo de producto es obligatorio.',
    )
  }

  if (nombre.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.',
    )
  }

  if (nombre.length > 80) {
    throw new Error(
      'El nombre no puede superar los 80 caracteres.',
    )
  }

  if (!descripcion) {
    throw new Error(
      'La descripción es obligatoria.',
    )
  }

  if (descripcion.length > 250) {
    throw new Error(
      'La descripción no puede superar los 250 caracteres.',
    )
  }
}

function crearSiguienteId(
  tiposProducto: TipoProducto[],
): string {
  const numeroMayor =
    tiposProducto.reduce(
      (mayor, tipoProducto) => {
        const numero = Number(
          tipoProducto.id.replace(
            'TP-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `TP-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerTiposProducto():
  TipoProducto[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarTiposProducto(
      TIPOS_PRODUCTO_INICIALES,
    )

    return copiarTiposProducto(
      TIPOS_PRODUCTO_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(
      datosGuardados,
    )

    if (!Array.isArray(datos)) {
      throw new Error(
        'Formato inválido',
      )
    }

    return copiarTiposProducto(
      datos as TipoProducto[],
    )
  } catch {
    guardarTiposProducto(
      TIPOS_PRODUCTO_INICIALES,
    )

    return copiarTiposProducto(
      TIPOS_PRODUCTO_INICIALES,
    )
  }
}

export function crearTipoProducto(
  datos: TipoProductoFormData,
): TipoProducto {
  validarDatos(datos)

  const tiposProducto =
    obtenerTiposProducto()

  const nombreNormalizado =
    normalizarTexto(datos.nombre)

  const nombreDuplicado =
    tiposProducto.some(
      (tipoProducto) =>
        normalizarTexto(
          tipoProducto.nombre,
        ) === nombreNormalizado,
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un tipo de producto con ese nombre.',
    )
  }

  const nuevoTipoProducto:
    TipoProducto = {
      id: crearSiguienteId(
        tiposProducto,
      ),
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
      fechaRegistro:
        crearFechaActual(),
    }

  guardarTiposProducto([
    nuevoTipoProducto,
    ...tiposProducto,
  ])

  registrarEventoBitacora({
    modulo: 'Tipos de producto',
    accion: 'CREAR',
    detalle:
      `Se creó el tipo de producto "${nuevoTipoProducto.nombre}".`,
    registroId:
      nuevoTipoProducto.id,
  })

  return { ...nuevoTipoProducto }
}

export function actualizarTipoProducto(
  id: string,
  datos: TipoProductoFormData,
): TipoProducto {
  validarDatos(datos)

  const tiposProducto =
    obtenerTiposProducto()

  const tipoProductoActual =
    tiposProducto.find(
      (tipoProducto) =>
        tipoProducto.id === id,
    )

  if (!tipoProductoActual) {
    throw new Error(
      'El tipo de producto no existe.',
    )
  }

  const nombreNormalizado =
    normalizarTexto(datos.nombre)

  const nombreDuplicado =
    tiposProducto.some(
      (tipoProducto) =>
        tipoProducto.id !== id &&
        normalizarTexto(
          tipoProducto.nombre,
        ) === nombreNormalizado,
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un tipo de producto con ese nombre.',
    )
  }

  const tipoProductoActualizado:
    TipoProducto = {
      ...tipoProductoActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarTiposProducto(
    tiposProducto.map(
      (tipoProducto) =>
        tipoProducto.id === id
          ? tipoProductoActualizado
          : tipoProducto,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Tipos de producto',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el tipo de producto "${tipoProductoActualizado.nombre}".`,
    registroId:
      tipoProductoActualizado.id,
  })

  return {
    ...tipoProductoActualizado,
  }
}

export function eliminarTipoProducto(
  id: string,
): void {
  const tiposProducto =
    obtenerTiposProducto()

  const tipoProductoAEliminar =
    tiposProducto.find(
      (tipoProducto) =>
        tipoProducto.id === id,
    )

  if (!tipoProductoAEliminar) {
    throw new Error(
      'El tipo de producto no existe.',
    )
  }

  guardarTiposProducto(
    tiposProducto.filter(
      (tipoProducto) =>
        tipoProducto.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Tipos de producto',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el tipo de producto "${tipoProductoAEliminar.nombre}".`,
    registroId:
      tipoProductoAEliminar.id,
  })
}
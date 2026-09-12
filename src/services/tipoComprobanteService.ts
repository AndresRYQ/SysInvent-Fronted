import type {
  TipoComprobante,
  TipoComprobanteFormData,
} from '../types/tipoComprobante'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_tipos_documento'

const TIPOS_DOCUMENTO_INICIALES:
  TipoComprobante[] = [
    {
      id: 'TD-001',
      nombre: 'Factura',
      descripcion:
        'Comprobante de compra que permite sustentar el crédito fiscal.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'TD-002',
      nombre: 'Boleta de venta',
      descripcion:
        'Comprobante emitido en operaciones con consumidores finales.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'TD-003',
      nombre: 'Guía de remisión',
      descripcion:
        'Documento que sustenta el traslado de bienes.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'TD-004',
      nombre: 'Nota de crédito',
      descripcion:
        'Documento utilizado para modificar o anular una operación.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'TD-005',
      nombre: 'Orden de compra',
      descripcion:
        'Documento que formaliza una solicitud de adquisición.',
      estado: false,
      fechaRegistro: '14/08/2026',
    },
  ]

function copiarTiposDocumento(
  tiposDocumento: TipoComprobante[],
): TipoComprobante[] {
  return tiposDocumento.map(
    (tipoDocumento) => ({
      ...tipoDocumento,
    }),
  )
}

function guardarTiposDocumento(
  tiposDocumento: TipoComprobante[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(tiposDocumento),
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
  datos: TipoComprobanteFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre del tipo de documento es obligatorio.',
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
  tiposDocumento: TipoComprobante[],
): string {
  const numeroMayor =
    tiposDocumento.reduce(
      (mayor, tipoDocumento) => {
        const numero = Number(
          tipoDocumento.id.replace(
            'TD-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `TD-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerTiposDocumento():
  TipoComprobante[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarTiposDocumento(
      TIPOS_DOCUMENTO_INICIALES,
    )

    return copiarTiposDocumento(
      TIPOS_DOCUMENTO_INICIALES,
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

    return copiarTiposDocumento(
      datos as TipoComprobante[],
    )
  } catch {
    guardarTiposDocumento(
      TIPOS_DOCUMENTO_INICIALES,
    )

    return copiarTiposDocumento(
      TIPOS_DOCUMENTO_INICIALES,
    )
  }
}

export function crearTipoDocumento(
  datos: TipoComprobanteFormData,
): TipoComprobante {
  validarDatos(datos)

  const tiposDocumento =
    obtenerTiposDocumento()

  const nombreDuplicado =
    tiposDocumento.some(
      (tipoDocumento) =>
        normalizarTexto(
          tipoDocumento.nombre,
        ) ===
        normalizarTexto(
          datos.nombre,
        ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un tipo de documento con ese nombre.',
    )
  }

  const nuevoTipoDocumento:
    TipoComprobante = {
      id: crearSiguienteId(
        tiposDocumento,
      ),
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
      fechaRegistro:
        crearFechaActual(),
    }

  guardarTiposDocumento([
    nuevoTipoDocumento,
    ...tiposDocumento,
  ])

  registrarEventoBitacora({
    modulo: 'Tipos de documento',
    accion: 'CREAR',
    detalle:
      `Se creó el tipo de documento "${nuevoTipoDocumento.nombre}".`,
    registroId:
      nuevoTipoDocumento.id,
  })

  return { ...nuevoTipoDocumento }
}

export function actualizarTipoDocumento(
  id: string,
  datos: TipoComprobanteFormData,
): TipoComprobante {
  validarDatos(datos)

  const tiposDocumento =
    obtenerTiposDocumento()

  const tipoDocumentoActual =
    tiposDocumento.find(
      (tipoDocumento) =>
        tipoDocumento.id === id,
    )

  if (!tipoDocumentoActual) {
    throw new Error(
      'El tipo de documento no existe.',
    )
  }

  const nombreDuplicado =
    tiposDocumento.some(
      (tipoDocumento) =>
        tipoDocumento.id !== id &&
        normalizarTexto(
          tipoDocumento.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otro tipo de documento con ese nombre.',
    )
  }

  const tipoDocumentoActualizado:
    TipoComprobante = {
      ...tipoDocumentoActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarTiposDocumento(
    tiposDocumento.map(
      (tipoDocumento) =>
        tipoDocumento.id === id
          ? tipoDocumentoActualizado
          : tipoDocumento,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Tipos de documento',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el tipo de documento "${tipoDocumentoActualizado.nombre}".`,
    registroId:
      tipoDocumentoActualizado.id,
  })

  return {
    ...tipoDocumentoActualizado,
  }
}

export function eliminarTipoDocumento(
  id: string,
): void {
  const tiposDocumento =
    obtenerTiposDocumento()

  const tipoDocumentoAEliminar =
    tiposDocumento.find(
      (tipoDocumento) =>
        tipoDocumento.id === id,
    )

  if (!tipoDocumentoAEliminar) {
    throw new Error(
      'El tipo de documento no existe.',
    )
  }

  guardarTiposDocumento(
    tiposDocumento.filter(
      (tipoDocumento) =>
        tipoDocumento.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Tipos de documento',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el tipo de documento "${tipoDocumentoAEliminar.nombre}".`,
    registroId:
      tipoDocumentoAEliminar.id,
  })
}
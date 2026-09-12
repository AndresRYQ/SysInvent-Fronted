import type {
  CentroCosto,
  CentroCostoFormData,
} from '../types/centroCosto'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_centros_costo'

const VALES_STORAGE_KEY =
  'agrihusac_vales_consumo'

const CENTROS_INICIALES:
  CentroCosto[] = [
    {
      id: 'CC-001',
      nombre: 'Administración',
      descripcion:
        'Gestión general y dirección de la organización.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'CC-002',
      nombre: 'Producción',
      descripcion:
        'Procesos productivos y operaciones de planta.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'CC-003',
      nombre: 'Mantenimiento',
      descripcion:
        'Conservación de equipos e instalaciones.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'CC-004',
      nombre: 'Logística',
      descripcion:
        'Almacenamiento y distribución de materiales.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'CC-005',
      nombre: 'Ventas',
      descripcion:
        'Comercialización y atención de clientes.',
      estado: false,
      fechaRegistro: '14/08/2026',
    },
  ]

function copiarCentros(
  centrosCosto: CentroCosto[],
): CentroCosto[] {
  return centrosCosto.map(
    (centroCosto) => ({
      ...centroCosto,
    }),
  )
}

function guardarCentros(
  centrosCosto: CentroCosto[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(centrosCosto),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '').trim().toLowerCase()
}

function validarDatos(
  datos: CentroCostoFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre del centro de costo es obligatorio.',
    )
  }

  if (nombre.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.',
    )
  }

  if (nombre.length > 100) {
    throw new Error(
      'El nombre no puede superar los 100 caracteres.',
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
  centrosCosto: CentroCosto[],
): string {
  const numeroMayor =
    centrosCosto.reduce(
      (mayor, centroCosto) => {
        const numero = Number(
          centroCosto.id.replace(
            'CC-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `CC-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

function centroCostoEstaEnUso(
  centroCostoId: string,
): boolean {
  try {
    const datosGuardados =
      localStorage.getItem(
        VALES_STORAGE_KEY,
      )

    if (!datosGuardados) {
      return false
    }

    const vales = JSON.parse(
      datosGuardados,
    )

    if (!Array.isArray(vales)) {
      return false
    }

    return vales.some(
      (vale) =>
        typeof vale === 'object' &&
        vale !== null &&
        vale.centroCostoId ===
          centroCostoId,
    )
  } catch {
    return false
  }
}

export function obtenerCentrosCosto():
  CentroCosto[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarCentros(CENTROS_INICIALES)

    return copiarCentros(
      CENTROS_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      throw new Error('Formato inválido')
    }

    return copiarCentros(
      datos as CentroCosto[],
    )
  } catch {
    guardarCentros(CENTROS_INICIALES)

    return copiarCentros(
      CENTROS_INICIALES,
    )
  }
}

export function crearCentroCosto(
  datos: CentroCostoFormData,
): CentroCosto {
  validarDatos(datos)

  const centrosCosto =
    obtenerCentrosCosto()

  const nombreDuplicado =
    centrosCosto.some(
      (centroCosto) =>
        normalizarTexto(
          centroCosto.nombre,
        ) ===
        normalizarTexto(datos.nombre),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un centro de costo con ese nombre.',
    )
  }

  const nuevoCentro: CentroCosto = {
    id: crearSiguienteId(
      centrosCosto,
    ),
    nombre: datos.nombre.trim(),
    descripcion:
      datos.descripcion.trim(),
    estado: datos.estado,
    fechaRegistro: crearFechaActual(),
  }

  guardarCentros([
    nuevoCentro,
    ...centrosCosto,
  ])

  registrarEventoBitacora({
    modulo: 'Centros de costo',
    accion: 'CREAR',
    detalle:
      `Se creó el centro de costo "${nuevoCentro.nombre}".`,
    registroId: nuevoCentro.id,
  })

  return { ...nuevoCentro }
}

export function actualizarCentroCosto(
  id: string,
  datos: CentroCostoFormData,
): CentroCosto {
  validarDatos(datos)

  const centrosCosto =
    obtenerCentrosCosto()

  const centroActual =
    centrosCosto.find(
      (centroCosto) =>
        centroCosto.id === id,
    )

  if (!centroActual) {
    throw new Error(
      'El centro de costo no existe.',
    )
  }

  const nombreDuplicado =
    centrosCosto.some(
      (centroCosto) =>
        centroCosto.id !== id &&
        normalizarTexto(
          centroCosto.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otro centro de costo con ese nombre.',
    )
  }

  const centroActualizado:
    CentroCosto = {
      ...centroActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarCentros(
    centrosCosto.map(
      (centroCosto) =>
        centroCosto.id === id
          ? centroActualizado
          : centroCosto,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Centros de costo',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el centro de costo "${centroActualizado.nombre}".`,
    registroId:
      centroActualizado.id,
  })

  return { ...centroActualizado }
}

export function eliminarCentroCosto(
  id: string,
): void {
  const centrosCosto =
    obtenerCentrosCosto()

  const centroCosto =
    centrosCosto.find(
      (item) => item.id === id,
    )

  if (!centroCosto) {
    throw new Error(
      'El centro de costo no existe.',
    )
  }

  if (centroCostoEstaEnUso(id)) {
    throw new Error(
      'No puedes eliminar este centro de costo porque está asignado a uno o más vales. Puedes desactivarlo.',
    )
  }

  guardarCentros(
    centrosCosto.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Centros de costo',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el centro de costo "${centroCosto.nombre}".`,
    registroId: centroCosto.id,
  })
}
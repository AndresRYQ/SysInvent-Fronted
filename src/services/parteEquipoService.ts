import type {
  ParteEquipo,
  ParteEquipoFormData,
} from '../types/parteEquipo'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_partes_equipo'

const VALES_STORAGE_KEY =
  'agrihusac_vales_consumo'

const PARTES_INICIALES:
  ParteEquipo[] = [
    {
      id: 'PE-001',
      codigo: 'MOT-001',
      nombre: 'Motor principal',
      descripcion:
        'Motor principal utilizado en equipos de producción.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'PE-002',
      codigo: 'SIS-HID-001',
      nombre: 'Sistema hidráulico',
      descripcion:
        'Componentes hidráulicos para maquinaria industrial.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'PE-003',
      codigo: 'TAB-ELE-001',
      nombre: 'Tablero eléctrico',
      descripcion:
        'Tablero de control y distribución eléctrica.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'PE-004',
      codigo: 'BOM-001',
      nombre: 'Bomba de agua',
      descripcion:
        'Bomba utilizada para circulación y suministro de agua.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'PE-005',
      codigo: 'TRA-001',
      nombre: 'Sistema de transmisión',
      descripcion:
        'Conjunto de piezas para transmisión de movimiento.',
      estado: false,
      fechaRegistro: '14/08/2026',
    },
  ]

function copiarPartes(
  partes: ParteEquipo[],
): ParteEquipo[] {
  return partes.map((parte) => ({
    ...parte,
  }))
}

function guardarPartes(
  partes: ParteEquipo[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(partes),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '')
    .trim()
    .toLowerCase()
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

function crearSiguienteId(
  partes: ParteEquipo[],
): string {
  const numeroMayor =
    partes.reduce(
      (mayor, parte) => {
        const numero = Number(
          parte.id.replace('PE-', ''),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `PE-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function validarDatos(
  datos: ParteEquipoFormData,
): void {
  const codigo = datos.codigo
    .trim()
    .toUpperCase()

  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (
    !/^[A-Z0-9-]{3,30}$/.test(codigo)
  ) {
    throw new Error(
      'El código debe tener entre 3 y 30 caracteres y solo puede contener letras, números y guiones.',
    )
  }

  if (nombre.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.',
    )
  }

  if (nombre.length > 120) {
    throw new Error(
      'El nombre no puede superar los 120 caracteres.',
    )
  }

  if (descripcion.length < 5) {
    throw new Error(
      'La descripción debe tener al menos 5 caracteres.',
    )
  }

  if (descripcion.length > 250) {
    throw new Error(
      'La descripción no puede superar los 250 caracteres.',
    )
  }
}

function parteEstaEnUso(
  parteEquipoId: string,
): boolean {
  try {
    const datosGuardados =
      localStorage.getItem(
        VALES_STORAGE_KEY,
      )

    if (!datosGuardados) {
      return false
    }

    const datos: unknown =
      JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      return false
    }

    return datos.some(
      (valorVale: unknown) => {
        if (
          typeof valorVale !== 'object' ||
          valorVale === null
        ) {
          return false
        }

        const vale = valorVale as {
          detalles?: unknown
        }

        if (
          !Array.isArray(vale.detalles)
        ) {
          return false
        }

        return vale.detalles.some(
          (valorDetalle: unknown) => {
            if (
              typeof valorDetalle !==
                'object' ||
              valorDetalle === null
            ) {
              return false
            }

            const detalle =
              valorDetalle as {
                distribuciones?: unknown
              }

            if (
              !Array.isArray(
                detalle.distribuciones,
              )
            ) {
              return false
            }

            return detalle.distribuciones.some(
              (
                valorDistribucion:
                  unknown,
              ) => {
                if (
                  typeof valorDistribucion !==
                    'object' ||
                  valorDistribucion ===
                    null
                ) {
                  return false
                }

                const distribucion =
                  valorDistribucion as {
                    parteEquipoId?: unknown
                  }

                return (
                  distribucion.parteEquipoId ===
                  parteEquipoId
                )
              },
            )
          },
        )
      },
    )
  } catch {
    return false
  }
}

export function obtenerPartesEquipo():
  ParteEquipo[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarPartes(
      PARTES_INICIALES,
    )

    return copiarPartes(
      PARTES_INICIALES,
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

    return copiarPartes(
      datos as ParteEquipo[],
    )
  } catch {
    guardarPartes(
      PARTES_INICIALES,
    )

    return copiarPartes(
      PARTES_INICIALES,
    )
  }
}

export function obtenerParteEquipoPorId(
  id: string,
): ParteEquipo | null {
  const parte =
    obtenerPartesEquipo().find(
      (item) => item.id === id,
    )

  return parte
    ? { ...parte }
    : null
}

export function crearParteEquipo(
  datos: ParteEquipoFormData,
): ParteEquipo {
  validarDatos(datos)

  const partes =
    obtenerPartesEquipo()

  const codigo = datos.codigo
    .trim()
    .toUpperCase()

  const codigoDuplicado =
    partes.some(
      (parte) =>
        parte.codigo
          .trim()
          .toUpperCase() === codigo,
    )

  if (codigoDuplicado) {
    throw new Error(
      'Ya existe una parte de equipo con ese código.',
    )
  }

  const nombreDuplicado =
    partes.some(
      (parte) =>
        normalizarTexto(
          parte.nombre,
        ) ===
        normalizarTexto(datos.nombre),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe una parte de equipo con ese nombre.',
    )
  }

  const nuevaParte: ParteEquipo = {
    id: crearSiguienteId(partes),
    codigo,
    nombre: datos.nombre.trim(),
    descripcion:
      datos.descripcion.trim(),
    estado: datos.estado,
    fechaRegistro:
      crearFechaActual(),
  }

  guardarPartes([
    nuevaParte,
    ...partes,
  ])

  registrarEventoBitacora({
    modulo: 'Partes de equipo',
    accion: 'CREAR',
    detalle:
      `Se creó la parte de equipo "${nuevaParte.nombre}" con código ${nuevaParte.codigo}.`,
    registroId: nuevaParte.id,
  })

  return { ...nuevaParte }
}

export function actualizarParteEquipo(
  id: string,
  datos: ParteEquipoFormData,
): ParteEquipo {
  validarDatos(datos)

  const partes =
    obtenerPartesEquipo()

  const parteActual = partes.find(
    (parte) => parte.id === id,
  )

  if (!parteActual) {
    throw new Error(
      'La parte de equipo no existe.',
    )
  }

  const codigo = datos.codigo
    .trim()
    .toUpperCase()

  const codigoDuplicado =
    partes.some(
      (parte) =>
        parte.id !== id &&
        parte.codigo
          .trim()
          .toUpperCase() === codigo,
    )

  if (codigoDuplicado) {
    throw new Error(
      'Ya existe otra parte de equipo con ese código.',
    )
  }

  const nombreDuplicado =
    partes.some(
      (parte) =>
        parte.id !== id &&
        normalizarTexto(
          parte.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otra parte de equipo con ese nombre.',
    )
  }

  const parteActualizada:
    ParteEquipo = {
      ...parteActual,
      codigo,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarPartes(
    partes.map((parte) =>
      parte.id === id
        ? parteActualizada
        : parte,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Partes de equipo',
    accion: 'EDITAR',
    detalle:
      `Se actualizó la parte de equipo "${parteActualizada.nombre}".`,
    registroId:
      parteActualizada.id,
  })

  return { ...parteActualizada }
}

export function eliminarParteEquipo(
  id: string,
): void {
  const partes =
    obtenerPartesEquipo()

  const parte = partes.find(
    (item) => item.id === id,
  )

  if (!parte) {
    throw new Error(
      'La parte de equipo no existe.',
    )
  }

  if (parteEstaEnUso(id)) {
    throw new Error(
      'No puedes eliminar esta parte porque está asignada a uno o más vales de consumo. Puedes desactivarla.',
    )
  }

  guardarPartes(
    partes.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Partes de equipo',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó la parte de equipo "${parte.nombre}".`,
    registroId: parte.id,
  })
}
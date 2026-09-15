import type {
  ParteEquipo,
  ParteEquipoFormData,
} from '../types/parteEquipo'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_partes_equipo'

type RegistroGuardado = Partial<ParteEquipo> & { id?: number | string }

const PARTES_INICIALES:
  ParteEquipo[] = [
    {
      id: 1,
      codigo: 'MOT-001',
      nombre: 'Motor principal',
      descripcion:
        'Motor principal utilizado en equipos de producción.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 2,
      codigo: 'SIS-HID-001',
      nombre: 'Sistema hidráulico',
      descripcion:
        'Componentes hidráulicos para maquinaria industrial.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 3,
      codigo: 'TAB-ELE-001',
      nombre: 'Tablero eléctrico',
      descripcion:
        'Tablero de control y distribución eléctrica.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 4,
      codigo: 'BOM-001',
      nombre: 'Bomba de agua',
      descripcion:
        'Bomba utilizada para circulación y suministro de agua.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 5,
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
  return partes.map((parte) => ({ ...parte })).sort((a, b) => a.id - b.id)
}

function normalizarParte(registro: RegistroGuardado): ParteEquipo | null {
  const id = typeof registro.id === 'number'
    ? registro.id
    : Number(String(registro.id ?? '').match(/\d+/)?.[0] ?? '')
  if (!Number.isInteger(id) || id <= 0 || !registro.nombre) return null
  return {
    id,
    codigo: String(registro.codigo ?? '').trim(),
    nombre: String(registro.nombre).trim(),
    descripcion: String(registro.descripcion ?? '').trim(),
    estado: registro.estado !== false,
    fechaRegistro: String(registro.fechaRegistro ?? ''),
  }
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
): number {
  return partes.reduce((mayor, parte) => Math.max(mayor, parte.id), 0) + 1
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

    const normalizados = datos
      .map((registro) => normalizarParte(registro as RegistroGuardado))
      .filter((parte): parte is ParteEquipo => Boolean(parte))
    guardarPartes(normalizados)
    return copiarPartes(normalizados)
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
  id: number,
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
    estado: true,
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
    registroId: String(nuevaParte.id),
  })

  return { ...nuevaParte }
}

export function actualizarParteEquipo(
  id: number,
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
      estado: parteActual.estado,
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
    registroId: String(parteActualizada.id),
  })

  return { ...parteActualizada }
}

export function eliminarParteEquipo(
  id: number,
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

  guardarPartes(
    partes.map((item) =>
      item.id === id ? { ...item, estado: false } : item,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Partes de equipo',
    accion: 'EDITAR',
    detalle:
      `Se desactivó la parte de equipo "${parte.nombre}".`,
    registroId: String(parte.id),
  })
}

export function reactivarParteEquipo(id: number): void {
  const partes = obtenerPartesEquipo()
  const parte = partes.find((item) => item.id === id)
  if (!parte) throw new Error('La parte de equipo no existe.')
  guardarPartes(partes.map((item) => item.id === id ? { ...item, estado: true } : item))
}

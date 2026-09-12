import type {
  UnidadMedida,
  UnidadMedidaFormData,
} from '../types/unidadMedida'

import { registrarEventoBitacora } from './bitacoraService'
import { obtenerProductos } from './productoService'

const STORAGE_KEY =
  'agrihusac_unidades_medida'

const UNIDADES_INICIALES:
  UnidadMedida[] = [
    {
      id: 'UM-001',
      nombre: 'Unidad',
      descripcion:
        'Unidad individual de un producto.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'UM-002',
      nombre: 'Kilogramo',
      descripcion:
        'Unidad de masa equivalente a mil gramos.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'UM-003',
      nombre: 'Litro',
      descripcion:
        'Unidad utilizada para medir volumen.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'UM-004',
      nombre: 'Metro',
      descripcion:
        'Unidad utilizada para medir longitud.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'UM-005',
      nombre: 'Caja',
      descripcion:
        'Embalaje que contiene varias unidades.',
      estado: true,
      fechaRegistro: '14/08/2026',
    },
  ]

function copiarUnidades(
  unidades: UnidadMedida[],
): UnidadMedida[] {
  return unidades.map((unidad) => ({
    ...unidad,
  }))
}

function guardarUnidades(
  unidades: UnidadMedida[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(unidades),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '').trim().toLowerCase()
}

function validarDatos(
  datos: UnidadMedidaFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre de la unidad de medida es obligatorio.',
    )
  }

  if (nombre.length < 2) {
    throw new Error(
      'El nombre debe tener al menos 2 caracteres.',
    )
  }

  if (nombre.length > 60) {
    throw new Error(
      'El nombre no puede superar los 60 caracteres.',
    )
  }

  if (!descripcion) {
    throw new Error(
      'La descripción es obligatoria.',
    )
  }

  if (descripcion.length > 200) {
    throw new Error(
      'La descripción no puede superar los 200 caracteres.',
    )
  }
}

function crearSiguienteId(
  unidades: UnidadMedida[],
): string {
  const numeroMayor = unidades.reduce(
    (mayor, unidad) => {
      const numero = Number(
        unidad.id.replace('UM-', ''),
      )

      return Number.isNaN(numero)
        ? mayor
        : Math.max(mayor, numero)
    },
    0,
  )

  return `UM-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerUnidadesMedida():
  UnidadMedida[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarUnidades(UNIDADES_INICIALES)

    return copiarUnidades(
      UNIDADES_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      throw new Error('Formato inválido')
    }

    return copiarUnidades(
      datos as UnidadMedida[],
    )
  } catch {
    guardarUnidades(UNIDADES_INICIALES)

    return copiarUnidades(
      UNIDADES_INICIALES,
    )
  }
}

export function crearUnidadMedida(
  datos: UnidadMedidaFormData,
): UnidadMedida {
  validarDatos(datos)

  const unidades =
    obtenerUnidadesMedida()

  const nombreDuplicado =
    unidades.some(
      (unidad) =>
        normalizarTexto(
          unidad.nombre,
        ) ===
        normalizarTexto(datos.nombre),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe una unidad de medida con ese nombre.',
    )
  }

  const nuevaUnidad: UnidadMedida = {
    id: crearSiguienteId(unidades),
    nombre: datos.nombre.trim(),
    descripcion:
      datos.descripcion.trim(),
    estado: datos.estado,
    fechaRegistro: crearFechaActual(),
  }

  guardarUnidades([
    nuevaUnidad,
    ...unidades,
  ])

  registrarEventoBitacora({
    modulo: 'Unidades de medida',
    accion: 'CREAR',
    detalle:
      `Se creó la unidad de medida "${nuevaUnidad.nombre}".`,
    registroId: nuevaUnidad.id,
  })

  return { ...nuevaUnidad }
}

export function actualizarUnidadMedida(
  id: string,
  datos: UnidadMedidaFormData,
): UnidadMedida {
  validarDatos(datos)

  const unidades =
    obtenerUnidadesMedida()

  const unidadActual = unidades.find(
    (unidad) => unidad.id === id,
  )

  if (!unidadActual) {
    throw new Error(
      'La unidad de medida no existe.',
    )
  }

  const nombreDuplicado =
    unidades.some(
      (unidad) =>
        unidad.id !== id &&
        normalizarTexto(
          unidad.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otra unidad de medida con ese nombre.',
    )
  }

  const unidadActualizada:
    UnidadMedida = {
      ...unidadActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarUnidades(
    unidades.map((unidad) =>
      unidad.id === id
        ? unidadActualizada
        : unidad,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Unidades de medida',
    accion: 'EDITAR',
    detalle:
      `Se actualizó la unidad de medida "${unidadActualizada.nombre}".`,
    registroId:
      unidadActualizada.id,
  })

  return { ...unidadActualizada }
}

export function eliminarUnidadMedida(
  id: string,
): void {
  const unidades =
    obtenerUnidadesMedida()

  const unidad = unidades.find(
    (item) => item.id === id,
  )

  if (!unidad) {
    throw new Error(
      'La unidad de medida no existe.',
    )
  }

  const estaEnUso =
    obtenerProductos().some(
      (producto) =>
        producto.unidadMedidaId === id,
    )

  if (estaEnUso) {
    throw new Error(
      'No puedes eliminar esta unidad porque está asignada a uno o más productos. Puedes desactivarla.',
    )
  }

  guardarUnidades(
    unidades.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Unidades de medida',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó la unidad de medida "${unidad.nombre}".`,
    registroId: unidad.id,
  })
}
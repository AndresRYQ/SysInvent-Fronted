import type {
  Destino,
  DestinoFormData,
} from '../types/destino'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY =
  'agrihusac_destinos'

const DESTINOS_INICIALES: Destino[] = [
  {
    id: 'DES-001',
    nombre: 'Almacén Central',
    descripcion:
      'Almacén principal de la empresa.',
    estado: true,
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'DES-002',
    nombre:
      'Planta de procesamiento',
    descripcion:
      'Área donde se procesa la mercadería.',
    estado: true,
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'DES-003',
    nombre: 'Sucursal Norte',
    descripcion:
      'Sucursal ubicada en la zona norte.',
    estado: true,
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'DES-004',
    nombre: 'Punto de venta Sur',
    descripcion:
      'Punto de venta ubicado en la zona sur.',
    estado: true,
    fechaRegistro: '13/08/2026',
  },
  {
    id: 'DES-005',
    nombre: 'Depósito temporal',
    descripcion:
      'Espacio temporal para almacenamiento.',
    estado: false,
    fechaRegistro: '14/08/2026',
  },
]

function copiarDestinos(
  destinos: Destino[],
): Destino[] {
  return destinos.map((destino) => ({
    ...destino,
  }))
}

function guardarDestinos(
  destinos: Destino[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(destinos),
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
  datos: DestinoFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre del destino es obligatorio.',
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
  destinos: Destino[],
): string {
  const numeroMayor =
    destinos.reduce(
      (mayor, destino) => {
        const numero = Number(
          destino.id.replace(
            'DES-',
            '',
          ),
        )

        return Number.isNaN(numero)
          ? mayor
          : Math.max(mayor, numero)
      },
      0,
    )

  return `DES-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerDestinos():
  Destino[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarDestinos(
      DESTINOS_INICIALES,
    )

    return copiarDestinos(
      DESTINOS_INICIALES,
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

    return copiarDestinos(
      datos as Destino[],
    )
  } catch {
    guardarDestinos(
      DESTINOS_INICIALES,
    )

    return copiarDestinos(
      DESTINOS_INICIALES,
    )
  }
}

export function crearDestino(
  datos: DestinoFormData,
): Destino {
  validarDatos(datos)

  const destinos =
    obtenerDestinos()

  const nombreDuplicado =
    destinos.some(
      (destino) =>
        normalizarTexto(
          destino.nombre,
        ) ===
        normalizarTexto(
          datos.nombre,
        ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un destino con ese nombre.',
    )
  }

  const nuevoDestino: Destino = {
    id: crearSiguienteId(destinos),
    nombre: datos.nombre.trim(),
    descripcion:
      datos.descripcion.trim(),
    estado: datos.estado,
    fechaRegistro:
      crearFechaActual(),
  }

  guardarDestinos([
    nuevoDestino,
    ...destinos,
  ])

  registrarEventoBitacora({
    modulo: 'Destinos',
    accion: 'CREAR',
    detalle:
      `Se creó el destino "${nuevoDestino.nombre}".`,
    registroId: nuevoDestino.id,
  })

  return { ...nuevoDestino }
}

export function actualizarDestino(
  id: string,
  datos: DestinoFormData,
): Destino {
  validarDatos(datos)

  const destinos =
    obtenerDestinos()

  const destinoActual =
    destinos.find(
      (destino) =>
        destino.id === id,
    )

  if (!destinoActual) {
    throw new Error(
      'El destino no existe.',
    )
  }

  const nombreDuplicado =
    destinos.some(
      (destino) =>
        destino.id !== id &&
        normalizarTexto(
          destino.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otro destino con ese nombre.',
    )
  }

  const destinoActualizado:
    Destino = {
      ...destinoActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarDestinos(
    destinos.map((destino) =>
      destino.id === id
        ? destinoActualizado
        : destino,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Destinos',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el destino "${destinoActualizado.nombre}".`,
    registroId:
      destinoActualizado.id,
  })

  return { ...destinoActualizado }
}

export function eliminarDestino(
  id: string,
): void {
  const destinos =
    obtenerDestinos()

  const destinoAEliminar =
    destinos.find(
      (destino) =>
        destino.id === id,
    )

  if (!destinoAEliminar) {
    throw new Error(
      'El destino no existe.',
    )
  }

  guardarDestinos(
    destinos.filter(
      (destino) =>
        destino.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Destinos',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el destino "${destinoAEliminar.nombre}".`,
    registroId:
      destinoAEliminar.id,
  })
}
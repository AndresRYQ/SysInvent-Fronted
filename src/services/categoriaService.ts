import type {
  Categoria,
  CategoriaFormData,
} from '../types/categoria'

import { registrarEventoBitacora } from './bitacoraService'
import { obtenerProductos } from './productoService'

const STORAGE_KEY =
  'agrihusac_categorias'

const CATEGORIAS_INICIALES:
  Categoria[] = [
    {
      id: 'CAT-001',
      nombre: 'Herramientas',
      descripcion:
        'Implementos y accesorios de uso técnico.',
      estado: true,
      fechaRegistro: '10/08/2026',
    },
    {
      id: 'CAT-002',
      nombre: 'Seguridad Industrial',
      descripcion:
        'Equipos para protección personal.',
      estado: true,
      fechaRegistro: '11/08/2026',
    },
    {
      id: 'CAT-003',
      nombre: 'Ferretería',
      descripcion:
        'Materiales y piezas de soporte operativo.',
      estado: true,
      fechaRegistro: '12/08/2026',
    },
    {
      id: 'CAT-004',
      nombre: 'Repuestos',
      descripcion:
        'Piezas de reemplazo para mantenimiento.',
      estado: true,
      fechaRegistro: '13/08/2026',
    },
    {
      id: 'CAT-005',
      nombre: 'Limpieza',
      descripcion:
        'Insumos para orden e higiene del almacén.',
      estado: true,
      fechaRegistro: '14/08/2026',
    },
  ]

function copiarCategorias(
  categorias: Categoria[],
): Categoria[] {
  return categorias.map((categoria) => ({
    ...categoria,
  }))
}

function guardarCategorias(
  categorias: Categoria[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(categorias),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '').trim().toLowerCase()
}

function validarDatos(
  datos: CategoriaFormData,
): void {
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!nombre) {
    throw new Error(
      'El nombre de la categoría es obligatorio.',
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

  if (descripcion.length > 200) {
    throw new Error(
      'La descripción no puede superar los 200 caracteres.',
    )
  }
}

function crearSiguienteId(
  categorias: Categoria[],
): string {
  const numeroMayor = categorias.reduce(
    (mayor, categoria) => {
      const numero = Number(
        categoria.id.replace('CAT-', ''),
      )

      return Number.isNaN(numero)
        ? mayor
        : Math.max(mayor, numero)
    },
    0,
  )

  return `CAT-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerCategorias():
  Categoria[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarCategorias(
      CATEGORIAS_INICIALES,
    )

    return copiarCategorias(
      CATEGORIAS_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      throw new Error('Formato inválido')
    }

    return copiarCategorias(
      datos as Categoria[],
    )
  } catch {
    guardarCategorias(
      CATEGORIAS_INICIALES,
    )

    return copiarCategorias(
      CATEGORIAS_INICIALES,
    )
  }
}

export function crearCategoria(
  datos: CategoriaFormData,
): Categoria {
  validarDatos(datos)

  const categorias =
    obtenerCategorias()

  const nombreDuplicado =
    categorias.some(
      (categoria) =>
        normalizarTexto(
          categoria.nombre,
        ) ===
        normalizarTexto(datos.nombre),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe una categoría con ese nombre.',
    )
  }

  const nuevaCategoria: Categoria = {
    id: crearSiguienteId(categorias),
    nombre: datos.nombre.trim(),
    descripcion:
      datos.descripcion.trim(),
    estado: datos.estado,
    fechaRegistro: crearFechaActual(),
  }

  guardarCategorias([
    nuevaCategoria,
    ...categorias,
  ])

  registrarEventoBitacora({
    modulo: 'Categorías',
    accion: 'CREAR',
    detalle:
      `Se creó la categoría "${nuevaCategoria.nombre}".`,
    registroId: nuevaCategoria.id,
  })

  return { ...nuevaCategoria }
}

export function actualizarCategoria(
  id: string,
  datos: CategoriaFormData,
): Categoria {
  validarDatos(datos)

  const categorias =
    obtenerCategorias()

  const categoriaActual =
    categorias.find(
      (categoria) =>
        categoria.id === id,
    )

  if (!categoriaActual) {
    throw new Error(
      'La categoría no existe.',
    )
  }

  const nombreDuplicado =
    categorias.some(
      (categoria) =>
        categoria.id !== id &&
        normalizarTexto(
          categoria.nombre,
        ) ===
          normalizarTexto(
            datos.nombre,
          ),
    )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otra categoría con ese nombre.',
    )
  }

  const categoriaActualizada:
    Categoria = {
      ...categoriaActual,
      nombre: datos.nombre.trim(),
      descripcion:
        datos.descripcion.trim(),
      estado: datos.estado,
    }

  guardarCategorias(
    categorias.map((categoria) =>
      categoria.id === id
        ? categoriaActualizada
        : categoria,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Categorías',
    accion: 'EDITAR',
    detalle:
      `Se actualizó la categoría "${categoriaActualizada.nombre}".`,
    registroId:
      categoriaActualizada.id,
  })

  return { ...categoriaActualizada }
}

export function eliminarCategoria(
  id: string,
): void {
  const categorias =
    obtenerCategorias()

  const categoria = categorias.find(
    (item) => item.id === id,
  )

  if (!categoria) {
    throw new Error(
      'La categoría no existe.',
    )
  }

  const estaEnUso =
    obtenerProductos().some(
      (producto) =>
        producto.categoriaId === id,
    )

  if (estaEnUso) {
    throw new Error(
      'No puedes eliminar esta categoría porque está asignada a uno o más productos. Puedes desactivarla.',
    )
  }

  guardarCategorias(
    categorias.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Categorías',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó la categoría "${categoria.nombre}".`,
    registroId: categoria.id,
  })
}
import type {
  Producto,
  ProductoFormData,
} from '../types/producto'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY = 'agrihusac_productos'

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 1,
    codigo: 'HER-001',
    nombre: 'Taladro industrial',
    descripcion:
      'Taladro eléctrico para trabajos de mantenimiento.',
    tipoProductoId: 2,
    categoriaId: 1,
    unidadMedidaId: 1,
    proveedorId: 1,
    stockActual: 0,
    stockMinimo: 0,
    precioUnitario: 350,
    estado: true,
    fechaRegistro: '10/08/2026',
  },
  {
    id: 2,
    codigo: 'SEG-001',
    nombre: 'Guantes de nitrilo',
    descripcion:
      'Guantes para protección durante operaciones.',
    tipoProductoId: 1,
    categoriaId: 2,
    unidadMedidaId: 5,
    proveedorId: 2,
    stockActual: 0,
    stockMinimo: 0,
    precioUnitario: 28.5,
    estado: true,
    fechaRegistro: '11/08/2026',
  },
  {
    id: 3,
    codigo: 'FER-001',
    nombre: 'Aceite lubricante',
    descripcion:
      'Lubricante para equipos y maquinaria.',
    tipoProductoId: 1,
    categoriaId: 3,
    unidadMedidaId: 3,
    proveedorId: 3,
    stockActual: 0,
    stockMinimo: 0,
    precioUnitario: 45.9,
    estado: true,
    fechaRegistro: '12/08/2026',
  },
  {
    id: 4,
    codigo: 'REP-001',
    nombre: 'Rodamiento industrial',
    descripcion:
      'Repuesto para mantenimiento de maquinaria.',
    tipoProductoId: 4,
    categoriaId: 4,
    unidadMedidaId: 1,
    proveedorId: 3,
    stockActual: 0,
    stockMinimo: 0,
    precioUnitario: 85,
    estado: true,
    fechaRegistro: '13/08/2026',
  },
]

function copiarProductos(
  productos: Producto[],
): Producto[] {
  return productos.map((producto) => ({
    ...producto,
  }))
}

function guardarProductos(
  productos: Producto[],
): void {
  localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(productos),
  )
}

function normalizarTexto(
  valor: string | null | undefined,
): string {
  return (valor ?? '').trim().toLowerCase()
}

function validarDatos(
  datos: ProductoFormData,
): void {
  const codigo = datos.codigo
    .trim()
    .toUpperCase()
  const nombre = datos.nombre.trim()
  const descripcion =
    datos.descripcion.trim()

  if (!/^[A-Z0-9-]{3,30}$/.test(codigo)) {
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

  if (!datos.tipoProductoId) {
    throw new Error(
      'Selecciona un tipo de producto.',
    )
  }

  if (!datos.categoriaId) {
    throw new Error(
      'Selecciona una categoría.',
    )
  }

  if (!datos.unidadMedidaId) {
    throw new Error(
      'Selecciona una unidad de medida.',
    )
  }

  if (!datos.proveedorId) {
    throw new Error(
      'Selecciona un proveedor.',
    )
  }

  if (
    !Number.isFinite(datos.stockMinimo) ||
    datos.stockMinimo < 0
  ) {
    throw new Error(
      'El stock mínimo debe ser igual o mayor que cero.',
    )
  }

  if (
    !Number.isFinite(datos.precioUnitario) ||
    datos.precioUnitario < 0
  ) {
    throw new Error(
      'El precio unitario debe ser igual o mayor que cero.',
    )
  }
}

function normalizarIdProducto(
  id: unknown,
): number | null {
  const texto = String(id ?? '').trim()
  const numero = Number(
    texto.replace(/^PROD-0*/i, ''),
  )

  return Number.isInteger(numero) && numero > 0
    ? numero
    : null
}

function normalizarIdForaneo(
  id: unknown,
  prefijo: string,
): number {
  return Number(
    String(id ?? '').replace(
      new RegExp(`^${prefijo}-0*`, 'i'),
      '',
    ),
  )
}

function normalizarProducto(
  registro: Partial<Producto>,
): Producto | null {
  const id = normalizarIdProducto(registro.id)

  if (!id || !registro.codigo || !registro.nombre) {
    return null
  }

  return {
    ...registro,
    id,
    codigo: String(registro.codigo),
    nombre: String(registro.nombre),
    descripcion: String(registro.descripcion ?? ''),
    tipoProductoId: normalizarIdForaneo(registro.tipoProductoId, 'TP'),
    categoriaId: normalizarIdForaneo(registro.categoriaId, 'CAT'),
    unidadMedidaId: normalizarIdForaneo(registro.unidadMedidaId, 'UM'),
    proveedorId: normalizarIdForaneo(registro.proveedorId, 'PROV'),
    stockActual: Number(registro.stockActual ?? 0),
    stockMinimo: Number(registro.stockMinimo ?? 0),
    precioUnitario: Number(registro.precioUnitario ?? 0),
    estado: registro.estado !== false,
    fechaRegistro: String(registro.fechaRegistro ?? ''),
  }
}

function crearSiguienteId(
  productos: Producto[],
): number {
  return productos.reduce(
    (mayor, producto) => Math.max(mayor, producto.id),
    0,
  ) + 1
}

function crearFechaActual(): string {
  return new Intl.DateTimeFormat(
    'es-PE',
  ).format(new Date())
}

export function obtenerProductos():
  Producto[] {
  const datosGuardados =
    localStorage.getItem(STORAGE_KEY)

  if (!datosGuardados) {
    guardarProductos(PRODUCTOS_INICIALES)

    return copiarProductos(
      PRODUCTOS_INICIALES,
    )
  }

  try {
    const datos = JSON.parse(datosGuardados)

    if (!Array.isArray(datos)) {
      throw new Error('Formato inválido')
    }

    const productos = datos
      .map((item) => normalizarProducto(item as Partial<Producto>))
      .filter((item): item is Producto => item !== null)

    guardarProductos(productos)

    return copiarProductos(productos)
  } catch {
    guardarProductos(PRODUCTOS_INICIALES)

    return copiarProductos(
      PRODUCTOS_INICIALES,
    )
  }
}

export function obtenerProductoPorId(
  id: string | number,
): Producto | null {
  const producto = obtenerProductos().find(
    (item) => item.id === Number(id),
  )

  return producto ? { ...producto } : null
}

export function crearProducto(
  datos: ProductoFormData,
): Producto {
  validarDatos(datos)

  const productos = obtenerProductos()
  const codigo = datos.codigo
    .trim()
    .toUpperCase()

  const codigoDuplicado = productos.some(
    (producto) =>
      producto.codigo.toUpperCase() ===
      codigo,
  )

  if (codigoDuplicado) {
    throw new Error(
      'Ya existe un producto con ese código.',
    )
  }

  const nombreDuplicado = productos.some(
    (producto) =>
      normalizarTexto(producto.nombre) ===
      normalizarTexto(datos.nombre),
  )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe un producto con ese nombre.',
    )
  }

  const nuevoProducto: Producto = {
    id: crearSiguienteId(productos),
    codigo,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    tipoProductoId: normalizarIdForaneo(datos.tipoProductoId, 'TP'),
    categoriaId: normalizarIdForaneo(datos.categoriaId, 'CAT'),
    unidadMedidaId: normalizarIdForaneo(datos.unidadMedidaId, 'UM'),
    proveedorId: normalizarIdForaneo(datos.proveedorId, 'PROV'),
    stockActual: 0,
    stockMinimo: datos.stockMinimo,
    precioUnitario:
      datos.precioUnitario,
    estado: true,
    fechaRegistro: crearFechaActual(),
  }

  guardarProductos([
    nuevoProducto,
    ...productos,
  ])

  registrarEventoBitacora({
    modulo: 'Productos',
    accion: 'CREAR',
    detalle:
      `Se creó el producto "${nuevoProducto.nombre}" con código ${nuevoProducto.codigo}.`,
    registroId: String(nuevoProducto.id),
  })

  return { ...nuevoProducto }
}

export function actualizarProducto(
  id: number,
  datos: ProductoFormData,
): Producto {
  validarDatos(datos)

  const productos = obtenerProductos()

  const productoActual = productos.find(
    (producto) => producto.id === id,
  )

  if (!productoActual) {
    throw new Error(
      'El producto no existe.',
    )
  }

  const codigo = datos.codigo
    .trim()
    .toUpperCase()

  const codigoDuplicado = productos.some(
    (producto) =>
      producto.id !== id &&
      producto.codigo.toUpperCase() ===
        codigo,
  )

  if (codigoDuplicado) {
    throw new Error(
      'Ya existe otro producto con ese código.',
    )
  }

  const nombreDuplicado = productos.some(
    (producto) =>
      producto.id !== id &&
      normalizarTexto(producto.nombre) ===
        normalizarTexto(datos.nombre),
  )

  if (nombreDuplicado) {
    throw new Error(
      'Ya existe otro producto con ese nombre.',
    )
  }

  const productoActualizado: Producto = {
    ...productoActual,
    codigo,
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim(),
    tipoProductoId: normalizarIdForaneo(datos.tipoProductoId, 'TP'),
    categoriaId: normalizarIdForaneo(datos.categoriaId, 'CAT'),
    unidadMedidaId: normalizarIdForaneo(datos.unidadMedidaId, 'UM'),
    proveedorId: normalizarIdForaneo(datos.proveedorId, 'PROV'),
    stockMinimo: datos.stockMinimo,
    precioUnitario:
      datos.precioUnitario,
    estado: productoActual.estado,
  }

  guardarProductos(
    productos.map((producto) =>
      producto.id === id
        ? productoActualizado
        : producto,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Productos',
    accion: 'EDITAR',
    detalle:
      `Se actualizó el producto "${productoActualizado.nombre}" con código ${productoActualizado.codigo}.`,
    registroId:
      String(productoActualizado.id),
  })

  return { ...productoActualizado }
}

export function ajustarStockProducto(
  id: number,
  cantidad: number,
): Producto {
  if (!Number.isFinite(cantidad)) {
    throw new Error(
      'La cantidad de stock no es válida.',
    )
  }

  const productos = obtenerProductos()

  const productoActual = productos.find(
    (producto) => producto.id === id,
  )

  if (!productoActual) {
    throw new Error(
      'El producto no existe.',
    )
  }

  const nuevoStock =
    productoActual.stockActual + cantidad

  if (nuevoStock < 0) {
    throw new Error(
      'La operación dejaría el producto sin stock suficiente.',
    )
  }

  const productoActualizado: Producto = {
    ...productoActual,
    stockActual: Number(
      nuevoStock.toFixed(3),
    ),
  }

  guardarProductos(
    productos.map((producto) =>
      producto.id === id
        ? productoActualizado
        : producto,
    ),
  )

  return { ...productoActualizado }
}

export function obtenerProductosBajoStock():
  Producto[] {
  return obtenerProductos().filter(
    (producto) =>
      producto.estado &&
      producto.stockActual <=
        producto.stockMinimo,
  )
}

export function eliminarProducto(
  id: number,
): void {
  const productos = obtenerProductos()

  const producto = productos.find(
    (item) => item.id === id,
  )

  if (!producto) {
    throw new Error(
      'El producto no existe.',
    )
  }

  if (producto.stockActual > 0) {
    throw new Error(
      'No puedes eliminar un producto con stock. Primero debe quedar sin existencias o puedes desactivarlo.',
    )
  }

  guardarProductos(
    productos.filter(
      (item) => item.id !== id,
    ),
  )

  registrarEventoBitacora({
    modulo: 'Productos',
    accion: 'ELIMINAR',
    detalle:
      `Se eliminó el producto "${producto.nombre}" con código ${producto.codigo}.`,
    registroId: String(producto.id),
  })
}

import type {
  Producto,
  ProductoFormData,
} from '../types/producto'

import { registrarEventoBitacora } from './bitacoraService'

const STORAGE_KEY = 'agrihusac_productos'

const PRODUCTOS_INICIALES: Producto[] = [
  {
    id: 'PROD-001',
    codigo: 'HER-001',
    nombre: 'Taladro industrial',
    descripcion:
      'Taladro eléctrico para trabajos de mantenimiento.',
    tipoProductoId: 'TP-002',
    categoriaId: 'CAT-001',
    unidadMedidaId: 'UM-001',
    proveedorId: 'PROV-001',
    stockActual: 12,
    stockMinimo: 5,
    precioUnitario: 350,
    estado: true,
    fechaRegistro: '10/08/2026',
  },
  {
    id: 'PROD-002',
    codigo: 'SEG-001',
    nombre: 'Guantes de nitrilo',
    descripcion:
      'Guantes para protección durante operaciones.',
    tipoProductoId: 'TP-001',
    categoriaId: 'CAT-002',
    unidadMedidaId: 'UM-005',
    proveedorId: 'PROV-002',
    stockActual: 4,
    stockMinimo: 10,
    precioUnitario: 28.5,
    estado: true,
    fechaRegistro: '11/08/2026',
  },
  {
    id: 'PROD-003',
    codigo: 'FER-001',
    nombre: 'Aceite lubricante',
    descripcion:
      'Lubricante para equipos y maquinaria.',
    tipoProductoId: 'TP-001',
    categoriaId: 'CAT-003',
    unidadMedidaId: 'UM-003',
    proveedorId: 'PROV-003',
    stockActual: 18,
    stockMinimo: 8,
    precioUnitario: 45.9,
    estado: true,
    fechaRegistro: '12/08/2026',
  },
  {
    id: 'PROD-004',
    codigo: 'REP-001',
    nombre: 'Rodamiento industrial',
    descripcion:
      'Repuesto para mantenimiento de maquinaria.',
    tipoProductoId: 'TP-004',
    categoriaId: 'CAT-004',
    unidadMedidaId: 'UM-001',
    proveedorId: 'PROV-003',
    stockActual: 3,
    stockMinimo: 6,
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

function crearSiguienteId(
  productos: Producto[],
): string {
  const numeroMayor = productos.reduce(
    (mayor, producto) => {
      const numero = Number(
        producto.id.replace('PROD-', ''),
      )

      return Number.isNaN(numero)
        ? mayor
        : Math.max(mayor, numero)
    },
    0,
  )

  return `PROD-${String(
    numeroMayor + 1,
  ).padStart(3, '0')}`
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

    return copiarProductos(
      datos as Producto[],
    )
  } catch {
    guardarProductos(PRODUCTOS_INICIALES)

    return copiarProductos(
      PRODUCTOS_INICIALES,
    )
  }
}

export function obtenerProductoPorId(
  id: string,
): Producto | null {
  const producto = obtenerProductos().find(
    (item) => item.id === id,
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
    tipoProductoId:
      datos.tipoProductoId,
    categoriaId: datos.categoriaId,
    unidadMedidaId:
      datos.unidadMedidaId,
    proveedorId: datos.proveedorId,
    stockActual: 0,
    stockMinimo: datos.stockMinimo,
    precioUnitario:
      datos.precioUnitario,
    estado: datos.estado,
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
    registroId: nuevoProducto.id,
  })

  return { ...nuevoProducto }
}

export function actualizarProducto(
  id: string,
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
    tipoProductoId:
      datos.tipoProductoId,
    categoriaId: datos.categoriaId,
    unidadMedidaId:
      datos.unidadMedidaId,
    proveedorId: datos.proveedorId,
    stockMinimo: datos.stockMinimo,
    precioUnitario:
      datos.precioUnitario,
    estado: datos.estado,
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
      productoActualizado.id,
  })

  return { ...productoActualizado }
}

export function ajustarStockProducto(
  id: string,
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
  id: string,
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
    registroId: producto.id,
  })
}
import type { Producto, ProductoFormData } from '../types/producto'
import {
  CombosComunesApi,
  ProductosApi,
  type CustomPageProductoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let productosEnMemoria: Producto[] = []
const productosApi = new ProductosApi(apiConfiguration)
const combosComunesApi = new CombosComunesApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<Producto>>>()

export interface ListarProductosParams {
  nombre?: string
  pagina?: number
  tamPagina?: number
}

export interface ListarProductosComboParams {
  proveedorId: string | number
  tipoProductoId: string | number
}

export interface ProductoCombo {
  id: number
  descripcion: string
  unidadMedida: string
}

function convertirIdCombo(valor: string | number): number {
  const id = Number(String(valor).replace(/^[A-Z]+-0*/i, ''))
  if (!Number.isInteger(id) || id <= 0) {
    throw new Error('El identificador del producto no es válido.')
  }
  return id
}

export async function listarProductosCombo(
  params: ListarProductosComboParams,
): Promise<ProductoCombo[]> {
  const respuesta = await combosComunesApi.productos({
    proveedorId: convertirIdCombo(params.proveedorId),
    tipoProductoId: convertirIdCombo(params.tipoProductoId),
  })

  return respuesta
    .filter((producto) => producto.id != null)
    .map((producto) => ({
      id: producto.id as number,
      descripcion: producto.descripcion ?? '',
      unidadMedida: producto.value2 ?? '',
    }))
}

export function obtenerProductos(): Producto[] {
  return productosEnMemoria.map((producto) => ({ ...producto }))
}

function mapearRespuesta(response: CustomPageProductoResponse): CatalogoPaginado<Producto> {
  const resultado: CatalogoPaginado<Producto> = {
    datos: (response.datos ?? []).map((producto) => ({
      productoId: producto.productoId ?? 0,
      codigo: producto.codigo ?? '',
      nombre: producto.nombre ?? '',
      descripcion: producto.descripcion ?? '',
      tipoProductoId: producto.tipoProductoId ?? 0,
      categoriaId: producto.categoriaId ?? 0,
      unidadMedidaId: producto.unidadMedidaId ?? 0,
      proveedorId: producto.proveedorId ?? 0,
      stockActual: Number(producto.stockActual ?? 0),
      stockMinimo: Number(producto.stockMinimo ?? 0),
      precioUnitario: Number(producto.precioUnitario ?? 0),
      activo: producto.activo ?? true,
      fechaRegistro: producto.fechaRegistro ?? '',
      tipoProductoNombre: producto.tipoProductoNombre,
      categoriaNombre: producto.categoriaNombre,
      unidadMedidaNombre: producto.unidadMedidaNombre,
      proveedorRazonSocial: producto.proveedorRazonSocial,
    })),
    paginacion: response.paginacion ?? {},
  }

  productosEnMemoria = resultado.datos
  return resultado
}

export async function listarProductosApi(
  params: ListarProductosParams = {},
): Promise<CatalogoPaginado<Producto>> {
  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)
  if (solicitudExistente) return solicitudExistente

  const solicitud = productosApi
    .listarProductos(parametros)
    .then(mapearRespuesta)
    .finally(() => solicitudesEnCurso.delete(clave))

  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export function obtenerProductoPorId(id: string | number): Producto | null {
  const producto = productosEnMemoria.find((item) => item.productoId === Number(id))
  return producto ? { ...producto } : null
}

function validarDatos(datos: ProductoFormData): void {
  const codigo = datos.codigo.trim().toUpperCase()
  const nombre = datos.nombre.trim()
  const descripcion = datos.descripcion.trim()

  if (!/^[A-Z0-9-]{3,30}$/.test(codigo)) throw new Error('El código debe tener entre 3 y 30 caracteres y solo puede contener letras, números y guiones.')
  if (nombre.length < 2 || nombre.length > 120) throw new Error('El nombre debe tener entre 2 y 120 caracteres.')
  if (descripcion.length < 5 || descripcion.length > 250) throw new Error('La descripción debe tener entre 5 y 250 caracteres.')
  if (!datos.tipoProductoId) throw new Error('Selecciona un tipo de producto.')
  if (!datos.categoriaId) throw new Error('Selecciona una categoría.')
  if (!datos.unidadMedidaId) throw new Error('Selecciona una unidad de medida.')
  if (!datos.proveedorId) throw new Error('Selecciona un proveedor.')
  if (!Number.isFinite(datos.stockMinimo) || datos.stockMinimo < 0) throw new Error('El stock mínimo debe ser igual o mayor que cero.')
  if (!Number.isFinite(datos.precioUnitario) || datos.precioUnitario < 0) throw new Error('El precio unitario debe ser igual o mayor que cero.')
}

function convertirId(valor: string | number): number {
  const id = Number(String(valor).replace(/^[A-Z]+-0*/i, ''))
  if (!Number.isInteger(id) || id <= 0) throw new Error('El identificador del catálogo no es válido.')
  return id
}

function construirRequest(datos: ProductoFormData) {
  return {
    codigo: datos.codigo.trim().toUpperCase(),
    nombre: datos.nombre.trim(),
    descripcion: datos.descripcion.trim() || undefined,
    tipoProductoId: convertirId(datos.tipoProductoId),
    categoriaId: convertirId(datos.categoriaId),
    unidadMedidaId: convertirId(datos.unidadMedidaId),
    proveedorId: convertirId(datos.proveedorId),
    stockMinimo: datos.stockMinimo,
    precioUnitario: datos.precioUnitario,
  }
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) throw new Error(response.message ?? 'La operación de productos no fue completada.')
  return response
}

export async function crearProducto(datos: ProductoFormData): Promise<MessageResponse> {
  validarDatos(datos)
  return validarRespuesta(await productosApi.registrarProducto({ productoRequest: construirRequest(datos) }))
}

export async function actualizarProducto(id: number, datos: ProductoFormData): Promise<MessageResponse> {
  validarDatos(datos)
  return validarRespuesta(await productosApi.actualizarProducto({ id, productoRequest: construirRequest(datos) }))
}

export async function ajustarStockProducto(id: number, cantidad: number): Promise<Producto | null> {
  if (!Number.isFinite(cantidad)) throw new Error('La cantidad de stock no es válida.')
  const producto = obtenerProductoPorId(id)
  if (!producto) throw new Error('El producto no existe.')
  producto.stockActual = Number((producto.stockActual + cantidad).toFixed(3))
  productosEnMemoria = productosEnMemoria.map((item) => item.productoId === id ? producto : item)
  return { ...producto }
}

export function obtenerProductosBajoStock(): Producto[] {
  return obtenerProductos().filter((producto) => producto.activo && producto.stockActual <= producto.stockMinimo)
}

export async function eliminarProducto(id: number): Promise<MessageResponse> {
  return validarRespuesta(await productosApi.eliminarProducto({ id }))
}

export async function reactivarProducto(id: number): Promise<MessageResponse> {
  return validarRespuesta(await productosApi.cambiarEstadoProducto({
    id,
    estadoCatalogoRequest: { activo: true },
  }))
}

import type { Contacto, ContactoFormData } from '../types/contacto'
import {
  ContactosApi,
  type CustomPageContactoResponse,
  type MessageResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'
import type { CatalogoPaginado } from './catalogoApi'

let contactosEnMemoria: Contacto[] = []
const contactosApi = new ContactosApi(apiConfiguration)
const solicitudesEnCurso = new Map<string, Promise<CatalogoPaginado<Contacto>>>()

export interface ListarContactosParams {
  nombre?: string
  proveedorId?: string | number
  pagina?: number
  tamPagina?: number
}

export function obtenerContactos(): Contacto[] {
  return contactosEnMemoria.map((contacto) => ({ ...contacto }))
}

export function obtenerContactoPorId(id: number): Contacto | null {
  const contacto = contactosEnMemoria.find((item) => item.id === id)
  return contacto ? { ...contacto } : null
}

function mapearContacto(contacto: NonNullable<CustomPageContactoResponse['datos']>[number]): Contacto {
  return {
    id: contacto.contactoId ?? 0,
    proveedorId: contacto.proveedorId ?? 0,
    nombreCompleto: contacto.nombreCompleto ?? '',
    cargo: contacto.cargo ?? '',
    telefono: contacto.telefono ?? '',
    correo: contacto.correo ?? '',
    activo: contacto.activo ? 1 : 0,
    fechaRegistro: contacto.fechaRegistro ?? '',
  }
}

function mapearRespuesta(response: CustomPageContactoResponse): CatalogoPaginado<Contacto> {
  const resultado: CatalogoPaginado<Contacto> = {
    datos: (response.datos ?? []).map(mapearContacto),
    paginacion: response.paginacion ?? {},
  }
  contactosEnMemoria = resultado.datos
  return resultado
}

export async function listarContactos(
  params: ListarContactosParams = {},
): Promise<CatalogoPaginado<Contacto>> {
  const proveedorId = params.proveedorId === undefined || params.proveedorId === ''
    ? undefined
    : Number(String(params.proveedorId).replace(/^PROV-0*/i, ''))

  const parametros = {
    nombre: params.nombre?.trim() || undefined,
    proveedorId: Number.isFinite(proveedorId) ? proveedorId : undefined,
    pagina: params.pagina,
    tamPagina: params.tamPagina,
  }
  const clave = JSON.stringify(parametros)
  const solicitudExistente = solicitudesEnCurso.get(clave)
  if (solicitudExistente) return solicitudExistente

  const solicitud = contactosApi
    .listarContactos(parametros)
    .then(mapearRespuesta)
    .finally(() => solicitudesEnCurso.delete(clave))
  solicitudesEnCurso.set(clave, solicitud)
  return solicitud
}

export const listarContactosApi = listarContactos

function validar(datos: ContactoFormData): void {
  if (!datos.proveedorId) throw new Error('Selecciona un proveedor.')
  const nombre = datos.nombreCompleto.trim()
  const cargo = datos.cargo.trim()
  const telefono = datos.telefono.trim()
  const correo = datos.correo.trim()

  if (nombre.length < 3) throw new Error('El nombre completo debe tener al menos 3 caracteres.')
  if (nombre.length > 120) throw new Error('El nombre completo no puede superar los 120 caracteres.')
  if (cargo.length > 80) throw new Error('El cargo no puede superar los 80 caracteres.')
  const digitosTelefono = telefono.replace(/\D/g, '')
  if (telefono && (digitosTelefono.length < 7 || digitosTelefono.length > 15)) {
    throw new Error('Ingresa un teléfono válido.')
  }
  if (correo && !/^\S+@\S+\.\S+$/.test(correo)) throw new Error('Ingresa un correo válido.')
}

function validarRespuesta(response: MessageResponse): MessageResponse {
  if (response.success === false) {
    throw new Error(response.message ?? 'La operación de contactos no fue completada.')
  }
  return response
}

function construirRequest(datos: ContactoFormData) {
  return {
    proveedorId: Number(datos.proveedorId.replace(/^PROV-0*/i, '')),
    nombreCompleto: datos.nombreCompleto.trim(),
    cargo: datos.cargo.trim() || undefined,
    telefono: datos.telefono.trim() || undefined,
    correo: datos.correo.trim().toLowerCase() || undefined,
  }
}

export async function crearContacto(datos: ContactoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await contactosApi.registrarContacto({ contactoRequest: construirRequest(datos) }))
}

export async function actualizarContacto(id: number, datos: ContactoFormData): Promise<MessageResponse> {
  validar(datos)
  return validarRespuesta(await contactosApi.actualizarContacto({ id, contactoRequest: construirRequest(datos) }))
}

export async function cambiarEstadoContacto(id: number, activo: boolean): Promise<MessageResponse> {
  return validarRespuesta(await contactosApi.cambiarEstadoContacto({
    id,
    estadoCatalogoRequest: { activo },
  }))
}

export function desactivarContacto(id: number): Promise<MessageResponse> {
  return cambiarEstadoContacto(id, false)
}

export function reactivarContacto(id: number): Promise<MessageResponse> {
  return cambiarEstadoContacto(id, true)
}

export type AccionBitacora =
  | 'INICIO_SESION'
  | 'CIERRE_SESION'
  | 'CREAR'
  | 'EDITAR'
  | 'ELIMINAR'
  | 'ACCESO_DENEGADO'
  | 'BLOQUEO_LOGIN'

export interface RegistroBitacora {
  id: string
  fechaHora: string
  usuario: string
  nombreCompleto: string
  rol: string
  modulo: string
  accion: AccionBitacora
  detalle: string
  registroId: string | null
}

export interface EventoBitacoraInput {
  modulo: string
  accion: AccionBitacora
  detalle: string
  registroId?: string | null
  usuario?: string
  nombreCompleto?: string
  rol?: string
}
import {
  CombosComunesApi,
  type ComunResponse,
} from '../api/generated'
import { apiConfiguration } from '../api/client'

const combosApi = new CombosComunesApi(apiConfiguration)

export function listarProveedoresCombo(): Promise<ComunResponse[]> {
  return combosApi.proveedores()
}

export function listarContactosCombo(
  proveedorId: number,
): Promise<ComunResponse[]> {
  return combosApi.contactos({ proveedorId })
}

export function listarTiposDocumentoCombo(): Promise<ComunResponse[]> {
  return combosApi.tiposDocumento()
}

export function listarTiposProductoCombo(): Promise<ComunResponse[]> {
  return combosApi.tiposProducto()
}

import type { Proveedor, ProveedorFormData } from '../types/proveedor'
import { registrarEventoBitacora } from './bitacoraService'
const STORAGE_KEY = 'agrihusac_proveedores'
const PROVEEDORES_INICIALES: Proveedor[] = [
  {
    id: 1,
    ruc: '20100070970',
    razonSocial: 'Ferretería Industrial S.A.C.',
    correo: 'ventas@ferreteriaindustrial.pe',
    telefono: '987654321',
    direccion: 'Av. Industrial 450, Lima',
    activo: 1,
    fechaRegistro: '10/08/2026',
  },
  {
    id: 2,
    ruc: '20548796321',
    razonSocial: 'Suministros del Norte E.I.R.L.',
    correo: 'contacto@suministrosnorte.pe',
    telefono: '945678210',
    direccion: 'Av. Chancay 320, Huaral',
    activo: 1,
    fechaRegistro: '11/08/2026',
  },
  {
    id: 3,
    ruc: '20601234567',
    razonSocial: 'Equipos y Repuestos Perú S.A.C.',
    correo: 'pedidos@equiposrepuestos.pe',
    telefono: '912345678',
    direccion: 'Jr. Los Talleres 125, Lima',
    activo: 1,
    fechaRegistro: '12/08/2026',
  },
  {
    id: 4,
    ruc: '20456789123',
    razonSocial: 'Distribuidora Agrícola Huaral S.R.L.',
    correo: 'ventas@dahuaral.pe',
    telefono: '901234567',
    direccion: 'Carretera Huaral 780, Huaral',
    activo: 0,
    fechaRegistro: '13/08/2026',
  },
]
type Registro = Partial<Proveedor> & { id?: number | string; estado?: boolean }
function normalizarRegistro(r: Registro): Proveedor | null { const id = typeof r.id === 'number' ? r.id : Number(String(r.id ?? '').replace(/^PROV-/, '')); if (!Number.isInteger(id) || id <= 0 || !r.ruc || !r.razonSocial) return null; return { id, ruc: String(r.ruc), razonSocial: String(r.razonSocial).trim(), correo: String(r.correo ?? '').trim().toLowerCase(), telefono: String(r.telefono ?? '').trim(), direccion: String(r.direccion ?? '').trim(), activo: r.activo === 0 || r.activo === 1 ? r.activo : r.estado === false ? 0 : 1, fechaRegistro: r.fechaRegistro ?? '' } }
function leer(): Proveedor[] { try { const datos: unknown = JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '[]'); return Array.isArray(datos) ? datos.map((x) => normalizarRegistro(x as Registro)).filter((x): x is Proveedor => x !== null) : [] } catch { return [] } }
function guardar(datos: Proveedor[]): void { localStorage.setItem(STORAGE_KEY, JSON.stringify(datos)) }
function texto(v: string): string { return v.trim().toLowerCase() }
function validar(d: ProveedorFormData): void { if (!/^\d{11}$/.test(d.ruc.trim())) throw new Error('El RUC debe contener exactamente 11 números.'); if (d.razonSocial.trim().length < 2) throw new Error('La razón social debe tener al menos 2 caracteres.'); if (d.razonSocial.trim().length > 120) throw new Error('La razón social no puede superar los 120 caracteres.'); if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(d.correo.trim())) throw new Error('Ingresa un correo electrónico válido.'); const t = d.telefono.replace(/\D/g, ''); if (t.length !== 9) throw new Error('El teléfono debe contener exactamente 9 dígitos.'); if (d.direccion.trim().length < 5) throw new Error('La dirección debe tener al menos 5 caracteres.'); if (d.direccion.trim().length > 200) throw new Error('La dirección no puede superar los 200 caracteres.') }
export function obtenerProveedores(): Proveedor[] { const datos = leer(); const proveedores = datos.length > 0 ? datos.sort((a, b) => a.id - b.id) : PROVEEDORES_INICIALES.map((x) => ({ ...x })); guardar(proveedores); return proveedores.map((x) => ({ ...x })) }
export function obtenerProveedorPorId(id: number | string): Proveedor | null { const n = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, '')); const item = obtenerProveedores().find((x) => x.id === n); return item ? { ...item } : null }
export function crearProveedor(d: ProveedorFormData): Proveedor { validar(d); const lista = obtenerProveedores(); if (lista.some((x) => x.ruc === d.ruc.trim())) throw new Error('Ya existe un proveedor con ese RUC.'); if (lista.some((x) => texto(x.razonSocial) === texto(d.razonSocial))) throw new Error('Ya existe un proveedor con esa razón social.'); const nuevo: Proveedor = { id: lista.reduce((m, x) => Math.max(m, x.id), 0) + 1, ruc: d.ruc.trim(), razonSocial: d.razonSocial.trim(), correo: d.correo.trim().toLowerCase(), telefono: d.telefono.trim(), direccion: d.direccion.trim(), activo: 1, fechaRegistro: new Intl.DateTimeFormat('es-PE').format(new Date()) }; guardar([...lista, nuevo].sort((a, b) => a.id - b.id)); registrarEventoBitacora({ modulo: 'Proveedores', accion: 'CREAR', detalle: `Se creó el proveedor "${nuevo.razonSocial}".`, registroId: String(nuevo.id) }); return nuevo }
export function actualizarProveedor(id: number | string, d: ProveedorFormData): Proveedor { const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, '')); validar(d); const lista = obtenerProveedores(); const actual = lista.find((x) => x.id === numericId); if (!actual) throw new Error('El proveedor no existe.'); if (actual.activo === 0) throw new Error('Un proveedor inactivo solo puede visualizarse o reactivarse.'); if (lista.some((x) => x.id !== numericId && x.ruc === d.ruc.trim())) throw new Error('Ya existe otro proveedor con ese RUC.'); const actualizado = { ...actual, ruc: d.ruc.trim(), razonSocial: d.razonSocial.trim(), correo: d.correo.trim().toLowerCase(), telefono: d.telefono.trim(), direccion: d.direccion.trim() }; guardar(lista.map((x) => x.id === numericId ? actualizado : x)); return actualizado }
export function eliminarProveedor(id: number | string): void { const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, '')); const lista = obtenerProveedores(); const actual = lista.find((x) => x.id === numericId); if (!actual) throw new Error('El proveedor no existe.'); guardar(lista.map((x) => x.id === numericId ? { ...x, activo: 0 as const } : x)) }
export function reactivarProveedor(id: number | string): void { const numericId = typeof id === 'number' ? id : Number(String(id).replace(/^PROV-/, '')); const lista = obtenerProveedores(); if (!lista.some((x) => x.id === numericId)) throw new Error('El proveedor no existe.'); guardar(lista.map((x) => x.id === numericId ? { ...x, activo: 1 as const } : x)) }

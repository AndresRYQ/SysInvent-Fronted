import type { Proveedor } from '../types/proveedor';

const API_URL = '/api/proveedores';

export async function obtenerProveedores(): Promise<Proveedor[]> {
  const res = await fetch(API_URL);
  if (!res.ok) throw new Error('Error al obtener proveedores');
  return res.json();
}

export async function obtenerProveedorPorId(id: number): Promise<Proveedor> {
  const res = await fetch(`${API_URL}/${id}`);
  if (!res.ok) throw new Error('Error al obtener proveedor');
  return res.json();
}

export async function crearProveedor(data: Omit<Proveedor, 'id'>): Promise<Proveedor> {
  const res = await fetch(API_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al crear proveedor');
  return res.json();
}

export async function actualizarProveedor(id: number, data: Omit<Proveedor, 'id'>): Promise<Proveedor> {
  const res = await fetch(`${API_URL}/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error('Error al actualizar proveedor');
  return res.json();
}

export async function eliminarProveedor(id: number): Promise<void> {
  const res = await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Error al eliminar proveedor');
}

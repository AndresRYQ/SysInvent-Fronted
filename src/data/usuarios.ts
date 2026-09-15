import type { UsuarioLogin } from '../types/auth'

export const USUARIOS_INICIALES: UsuarioLogin[] = [
  {
    id: 'USR-001',
    usuario: 'admin',
    contrasena: 'admin123',
    email: 'admin@sistemainventario.com',
    nombreCompleto: 'Administrador del Sistema',
    rol: 'Administrador',
    estado: true,
  },
  {
    id: 'USR-002',
    usuario: 'almacen',
    contrasena: 'almacen123',
    email: 'almacen@sistemainventario.com',
    nombreCompleto: 'Usuario de Almacén',
    rol: 'Almacenero',
    estado: true,
  },
]
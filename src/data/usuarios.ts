import type {  UsuarioLogin,} from '../types/auth'

export const USUARIOS_INICIALES:
  UsuarioLogin[] = [
    {
      id: 'USR-001',
      usuario: 'admin',
      contrasena: 'admin123',
      nombreCompleto:
        'Administrador del Sistema',
      rol: 'Administrador',
      estado: true,
    },
    {
      id: 'USR-002',
      usuario: 'almacen',
      contrasena: 'almacen123',
      nombreCompleto:
        'Usuario de Almacén',
      rol: 'Almacenero',
      estado: true,
    },
  ]
# SysInvent Frontend

Aplicación web del sistema de control de almacén **SysInvent**. Permite administrar el inventario, registrar ingresos y vales de consumo, consultar reportes y gestionar los catálogos utilizados por la operación.

El frontend está desarrollado con React, TypeScript y Vite, y consume una API REST configurada mediante variables de entorno.

## Características

- Autenticación de usuarios y protección de rutas.
- Control de acceso por módulos y roles.
- Dashboard con indicadores de inventario y actividad reciente.
- Administración de proveedores, contactos, productos y catálogos.
- Registro y consulta de ingresos de almacén.
- Registro y consulta de vales de consumo.
- Control de existencias y movimientos del almacén.
- Reportes de ingresos, vales, Kardex y productos más solicitados.
- Bitácora de auditoría en modo consulta.
- Perfil de usuario.
- Diseño responsive para escritorio y dispositivos con pantallas reducidas.
- Tema claro y modo oscuro.
- Exportación de información a CSV cuando el módulo lo permite.

## Tecnologías

- React 19
- TypeScript
- Vite
- React Router
- Bootstrap y Material UI
- React Select y React Datepicker
- Lucide React para iconos
- ExcelJS para exportaciones
- Cliente generado a partir de OpenAPI

## Requisitos

- Node.js 20 o superior.
- npm.

## Configuración local

1. Instalar las dependencias:

   ```bash
   npm install
   ```

2. Crear el archivo `.env` a partir de `.env.example`:

   ```env
   VITE_API_URL=http://localhost:8085
   ```

   `VITE_API_URL` debe apuntar a la URL de la API utilizada por la aplicación. En un despliegue de Vercel se configura desde las variables de entorno del proyecto.

3. Iniciar el frontend:

   ```bash
   npm run dev
   ```

   La aplicación estará disponible normalmente en `http://localhost:5173`.

## Scripts disponibles

| Comando | Descripción |
|---|---|
| `npm run dev` | Inicia el servidor de desarrollo. |
| `npm run build` | Verifica TypeScript y genera la compilación de producción. |
| `npm run preview` | Sirve localmente la compilación generada. |
| `npm run lint` | Ejecuta el análisis estático del código. |
| `npm run openapi:generate` | Regenera el cliente TypeScript a partir de `openapi/api.json`. |

## Módulos de la aplicación

### General

- Dashboard.
- Perfil de usuario.

### Inventario

- Control de almacén.
- Ingresos de almacén.
- Vales de consumo.

### Reportes

- Reporte de ingresos.
- Reporte de vales.
- Reporte Kardex.
- Reporte de productos más solicitados.

### Maestros

- Proveedores.
- Contactos.
- Productos.
- Partes de equipo.
- Categorías.
- Tipos de producto.
- Tipos de documento.
- Unidades de medida.
- Destinos.
- Centros de costo.

### Seguridad

- Usuarios.
- Roles.
- Bitácora de auditoría.

## Roles y permisos

El acceso a los módulos se valida mediante la sesión autenticada y los permisos asociados al rol del usuario. Un usuario sin permiso es redirigido a la pantalla de acceso restringido.

El rol **Administrador** se utiliza para las pruebas funcionales y tiene acceso a todos los módulos de la aplicación. Los demás roles pueden configurarse desde el módulo de roles, asignando únicamente los módulos que necesiten utilizar.

## Usuario administrador para pruebas

| Campo | Valor |
|---|---|
| Usuario | `71477205` |
| Contraseña | `agrihusac2026*` |
| Rol | Administrador |

Estas credenciales son únicamente para el entorno local y las pruebas funcionales. No deben utilizarse en un entorno productivo.

## Rutas principales

| Ruta | Pantalla |
|---|---|
| `/login` | Inicio de sesión |
| `/dashboard` | Panel principal |
| `/perfil` | Perfil del usuario |
| `/control-almacen` | Control de almacén |
| `/ingresos-almacen` | Ingresos de almacén |
| `/vales-consumo` | Vales de consumo |
| `/reportes/ingresos` | Reporte de ingresos |
| `/reportes/vales` | Reporte de vales |
| `/reportes/kardex` | Reporte Kardex |
| `/proveedores` | Proveedores |
| `/productos` | Productos |
| `/contactos` | Contactos |
| `/partes-equipo` | Partes de equipo |
| `/bitacora` | Bitácora |
| `/usuarios` | Usuarios |
| `/roles` | Roles |

## Estructura principal del frontend

```text
src/
├── api/             Cliente y modelos generados desde OpenAPI
├── components/      Componentes reutilizables de la interfaz
├── constants/       Códigos de módulos y constantes
├── pages/           Pantallas de la aplicación
├── routes/          Rutas protegidas y navegación
├── services/        Autenticación y consumo de la API
└── styles/          Estilos globales y por pantalla
```

## Nota de despliegue

Antes de publicar el frontend, configurar `VITE_API_URL` con la URL de la API y reemplazar las credenciales de prueba por usuarios administrados de forma segura.

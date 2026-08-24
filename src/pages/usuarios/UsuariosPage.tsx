import { useMemo, useState } from 'react'
import { LayoutDashboard } from 'lucide-react'

import { FiltrosUsuarios } from '../../components/usuarios/FiltrosUsuarios'
import { TablaUsuarios } from '../../components/usuarios/TablaUsuarios'
import { USUARIOS_INICIALES } from '../../data/usuarios'
import {
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import type { UsuarioLogin } from '../../types/auth'
import './UsuariosPage.css'

interface FiltrosUsuariosState {
  busqueda: string
  rol: string
  estado: string
}

const FILTROS_INICIALES: FiltrosUsuariosState = {
  busqueda: '',
  rol: '',
  estado: '',
}

function obtenerUsuarios(): UsuarioLogin[] {
  return obtenerStorage<UsuarioLogin[]>(
    STORAGE_KEYS.usuarios,
    USUARIOS_INICIALES,
  )
}

function filtrarUsuarios(
  usuarios: UsuarioLogin[],
  filtros: FiltrosUsuariosState,
) {
  const termino = filtros.busqueda
    .trim()
    .toLowerCase()

  return usuarios.filter((usuario) => {
    const coincideTexto =
      termino.length === 0 ||
      usuario.usuario.toLowerCase().includes(termino) ||
      usuario.nombreCompleto
        .toLowerCase()
        .includes(termino) ||
      usuario.id.toLowerCase().includes(termino)

    const coincideRol =
      filtros.rol.length === 0 ||
      usuario.rol === filtros.rol

    const coincideEstado =
      filtros.estado.length === 0 ||
      (filtros.estado === 'activo' && usuario.estado) ||
      (filtros.estado === 'inactivo' && !usuario.estado)

    return coincideTexto && coincideRol && coincideEstado
  })
}

export function UsuariosPage() {
  const [usuarios] = useState<UsuarioLogin[]>(
    () => obtenerUsuarios(),
  )

  const [filtros, setFiltros] =
    useState<FiltrosUsuariosState>(
      FILTROS_INICIALES,
    )

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosUsuariosState>(
      FILTROS_INICIALES,
    )

  const usuariosFiltrados = useMemo(
    () =>
      filtrarUsuarios(usuarios, filtrosAplicados),
    [usuarios, filtrosAplicados],
  )

  const usuariosActivos = useMemo(
    () =>
      usuarios.filter((usuario) => usuario.estado)
        .length,
    [usuarios],
  )

  const rolesActivos = useMemo(
    () =>
      new Set(
        usuarios.map((usuario) => usuario.rol),
      ).size,
    [usuarios],
  )

  return (
    <main className="users-page app-shell">
      <div className="container-xl px-0">
        <section className="users-hero">
          <span className="users-badge">
            <LayoutDashboard size={16} />
            Gestión segura
          </span>

          <h1>Gestión de usuarios</h1>

          <p>
            Pantalla de consulta con filtros rápidos, acciones claras y una tabla
            estilizada en línea con la referencia visual del proyecto.
          </p>

          <div className="row g-3 users-stat-grid">
            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">
                  Usuarios registrados
                </div>

                <div className="users-stat-value">
                  {usuarios.length}
                </div>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">
                  Activos
                </div>

                <div className="users-stat-value">
                  {usuariosActivos}
                </div>
              </article>
            </div>

            <div className="col-12 col-md-4">
              <article className="users-stat-card">
                <div className="users-stat-label">
                  Roles detectados
                </div>

                <div className="users-stat-value">
                  {rolesActivos}
                </div>
              </article>
            </div>
          </div>
        </section>

        <div className="users-panel">
          <FiltrosUsuarios
            valores={filtros}
            onChange={(campo, valor) =>
              setFiltros((actual) => ({
                ...actual,
                [campo]: valor,
              }))
            }
            onBuscar={() =>
              setFiltrosAplicados(filtros)
            }
            onLimpiar={() => {
              setFiltros(FILTROS_INICIALES)
              setFiltrosAplicados(FILTROS_INICIALES)
            }}
          />
        </div>

        <div className="users-panel">
          <TablaUsuarios
            usuarios={usuariosFiltrados}
          />
        </div>
      </div>
    </main>
  )
}

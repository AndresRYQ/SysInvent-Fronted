import { useEffect, useMemo, useState } from 'react'

import { FiltrosUsuarios } from '../../components/usuarios/FiltrosUsuarios'
import { TablaUsuarios } from '../../components/usuarios/TablaUsuarios'
import { USUARIOS_INICIALES } from '../../data/usuarios'
import {
  obtenerStorage,
  STORAGE_KEYS,
} from '../../services/storageService'
import type { UsuarioLogin } from '../../types/auth'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

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
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const usuariosFiltrados = useMemo(
    () =>
      filtrarUsuarios(usuarios, filtrosAplicados),
    [usuarios, filtrosAplicados],
  )

  const totalItems = usuariosFiltrados.length

  const usuariosPaginados = useMemo(() => {
    const startIndex = (page - 1) * pageSize
    const endIndex = startIndex + pageSize

    return usuariosFiltrados.slice(
      startIndex,
      endIndex,
    )
  }, [
    usuariosFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    const totalPages = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPages) {
      setPage(totalPages)
    }
  }, [page, pageSize, totalItems])

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Usuarios</h1>
              <p>Mantenimiento de usuarios del sistema</p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosUsuarios
              valores={filtros}
              onChange={(campo, valor) =>
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }))
              }
              onBuscar={() => {
                setFiltrosAplicados(filtros)
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros(FILTROS_INICIALES)
                setFiltrosAplicados(FILTROS_INICIALES)
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaUsuarios
              usuarios={usuariosPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onPageChange={(nextPage) =>
                setPage(nextPage)
              }
              onPageSizeChange={(nextPageSize) => {
                setPageSize(nextPageSize)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>
    </>
  )
}

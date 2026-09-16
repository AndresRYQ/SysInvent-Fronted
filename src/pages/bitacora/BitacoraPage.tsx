import {
  useEffect,
  useMemo,
  useState,
} from 'react'
import { ShieldCheck } from 'lucide-react'

import { DetalleBitacoraModal } from '../../components/bitacora/DetalleBitacoraModal'
import {
  FiltrosBitacora,
  type FiltrosBitacoraValores,
} from '../../components/bitacora/FiltrosBitacora'
import { TablaBitacora } from '../../components/bitacora/TablaBitacora'
import { obtenerRegistrosBitacora } from '../../services/bitacoraService'
import type { RegistroBitacora } from '../../types/bitacora'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES: FiltrosBitacoraValores = {
  busqueda: '',
  modulo: '',
  accion: '',
  fechaDesde: '',
  fechaHasta: '',
}

function filtrarRegistros(
  registros: RegistroBitacora[],
  filtros: FiltrosBitacoraValores,
): RegistroBitacora[] {
  const busqueda = filtros.busqueda
    .trim()
    .toLowerCase()

  const fechaDesde = filtros.fechaDesde
    ? new Date(
        `${filtros.fechaDesde}T00:00:00`,
      ).getTime()
    : null

  const fechaHasta = filtros.fechaHasta
    ? new Date(
        `${filtros.fechaHasta}T23:59:59.999`,
      ).getTime()
    : null

  return registros.filter((registro) => {
    const fechaRegistro = new Date(
      registro.fechaHora,
    ).getTime()

    const coincideBusqueda =
      busqueda.length === 0 ||
      registro.usuario
        .toLowerCase()
        .includes(busqueda) ||
      registro.nombreCompleto
        .toLowerCase()
        .includes(busqueda) ||
      registro.rol
        .toLowerCase()
        .includes(busqueda) ||
      registro.modulo
        .toLowerCase()
        .includes(busqueda) ||
      registro.detalle
        .toLowerCase()
        .includes(busqueda) ||
      Boolean(
        registro.registroId
          ?.toLowerCase()
          .includes(busqueda),
      )

    const coincideModulo =
      filtros.modulo.length === 0 ||
      registro.modulo === filtros.modulo

    const coincideAccion =
      filtros.accion.length === 0 ||
      registro.accion === filtros.accion

    const coincideFechaDesde =
      fechaDesde === null ||
      (!Number.isNaN(fechaRegistro) &&
        fechaRegistro >= fechaDesde)

    const coincideFechaHasta =
      fechaHasta === null ||
      (!Number.isNaN(fechaRegistro) &&
        fechaRegistro <= fechaHasta)

    return (
      coincideBusqueda &&
      coincideModulo &&
      coincideAccion &&
      coincideFechaDesde &&
      coincideFechaHasta
    )
  })
}

export function BitacoraPage() {
  const [registros] = useState<
    RegistroBitacora[]
  >(() => obtenerRegistrosBitacora())

  const [filtros, setFiltros] =
    useState<FiltrosBitacoraValores>({
      ...FILTROS_INICIALES,
    })

  const [filtrosAplicados, setFiltrosAplicados] =
    useState<FiltrosBitacoraValores>({
      ...FILTROS_INICIALES,
    })

  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)

  const [registroSeleccionado, setRegistroSeleccionado] =
    useState<RegistroBitacora | null>(null)

  const modulos = useMemo(() => {
    return Array.from(
      new Set(
        registros
          .map((registro) =>
            registro.modulo.trim(),
          )
          .filter(Boolean),
      ),
    ).sort((primerModulo, segundoModulo) =>
      primerModulo.localeCompare(
        segundoModulo,
        'es',
      ),
    )
  }, [registros])

  const registrosFiltrados = useMemo(
    () =>
      filtrarRegistros(
        registros,
        filtrosAplicados,
      ),
    [registros, filtrosAplicados],
  )

  const totalItems = registrosFiltrados.length

  const registrosPaginados = useMemo(() => {
    const indiceInicial =
      (page - 1) * pageSize

    return registrosFiltrados.slice(
      indiceInicial,
      indiceInicial + pageSize,
    )
  }, [
    registrosFiltrados,
    page,
    pageSize,
  ])

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(totalItems / pageSize),
    )

    if (page > totalPaginas) {
      setPage(totalPaginas)
    }
  }, [page, pageSize, totalItems])

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Bitácora</h1>

              <p>
                Rastreo de accesos y acciones
                realizadas en el sistema.
              </p>
            </div>

          </section>

          <div className="alert alert-light border d-flex align-items-center gap-2 mb-3">
            <ShieldCheck
              size={20}
              className="text-success"
            />

            <span>
              Los registros de auditoría son
              únicamente de consulta y no pueden
              editarse ni eliminarse.
            </span>
          </div>

          <div className="maestro-panel">
            <FiltrosBitacora
              valores={filtros}
              modulos={modulos}
              onChange={(campo, valor) => {
                setFiltros((actual) => ({
                  ...actual,
                  [campo]: valor,
                }) as FiltrosBitacoraValores)
              }}
              onBuscar={() => {
                setFiltrosAplicados({
                  ...filtros,
                })
                setPage(1)
              }}
              onLimpiar={() => {
                setFiltros({
                  ...FILTROS_INICIALES,
                })
                setFiltrosAplicados({
                  ...FILTROS_INICIALES,
                })
                setPage(1)
              }}
            />
          </div>

          <div className="maestro-panel">
            <TablaBitacora
              registros={registrosPaginados}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onVerDetalle={(registro) =>
                setRegistroSeleccionado(
                  registro,
                )
              }
              onPageChange={(pagina) =>
                setPage(pagina)
              }
              onPageSizeChange={(cantidad) => {
                setPageSize(cantidad)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      <DetalleBitacoraModal
        registro={registroSeleccionado}
        onClose={() =>
          setRegistroSeleccionado(null)
        }
      />
    </>
  )
}

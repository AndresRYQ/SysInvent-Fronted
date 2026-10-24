import {
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { ShieldCheck } from 'lucide-react'

import { DetalleBitacoraModal } from '../../components/bitacora/DetalleBitacoraModal'
import {
  FiltrosBitacora,
  type FiltrosBitacoraValores,
} from '../../components/bitacora/FiltrosBitacora'
import { TablaBitacora } from '../../components/bitacora/TablaBitacora'
import { listarBitacoraBackend } from '../../services/bitacoraService'
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
  const [registros, setRegistros] = useState<RegistroBitacora[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const consultaCargada = useRef<string | null>(null)

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

  useEffect(() => {
    const claveConsulta = JSON.stringify({
      filtros: filtrosAplicados,
      page,
      pageSize,
    })

    if (consultaCargada.current === claveConsulta) {
      return
    }

    consultaCargada.current = claveConsulta
    setCargando(true)
    setError(null)

    listarBitacoraBackend({
      ...filtrosAplicados,
      pagina: page,
      tamPagina: pageSize,
    })
      .then((resultado) => {
        setRegistros(resultado.datos)
        setTotalItems(resultado.total)
      })
      .catch((errorActual: unknown) => {
        setError(
          errorActual instanceof Error
            ? errorActual.message
            : 'No se pudo cargar la bitácora.',
        )
        setRegistros([])
        setTotalItems(0)
      })
      .finally(() => setCargando(false))
  }, [filtrosAplicados, page, pageSize])

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

  const registrosPaginados = registros

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
            {cargando && (
              <div className="alert alert-info" role="status">
                Cargando bitácora...
              </div>
            )}

            {error && (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            )}

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

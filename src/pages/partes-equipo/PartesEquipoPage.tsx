import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  FiltrosPartesEquipo,
  type FiltrosPartesEquipoValores,
} from '../../components/partes-equipo/FiltrosPartesEquipo'

import { FormularioParteEquipo } from '../../components/partes-equipo/FormularioParteEquipo'
import { ParteEquipoDeleteModal } from '../../components/partes-equipo/ParteEquipoDeleteModal'
import { TablaPartesEquipo } from '../../components/partes-equipo/TablaPartesEquipo'

import {
  actualizarParteEquipo,
  crearParteEquipo,
  eliminarParteEquipo,
  obtenerPartesEquipo,
} from '../../services/parteEquipoService'

import type {
  ParteEquipo,
  ParteEquipoFormData,
} from '../../types/parteEquipo'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES:
  FiltrosPartesEquipoValores = {
    busqueda: '',
    estado: '',
  }

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
}

function filtrarPartesEquipo(
  partesEquipo: ParteEquipo[],
  filtros: FiltrosPartesEquipoValores,
): ParteEquipo[] {
  const busqueda = filtros.busqueda
    .trim()
    .toLowerCase()

  return partesEquipo.filter(
    (parte) => {
      const coincideBusqueda =
        !busqueda ||
        parte.codigo
          .toLowerCase()
          .includes(busqueda) ||
        parte.nombre
          .toLowerCase()
          .includes(busqueda) ||
        parte.descripcion
          .toLowerCase()
          .includes(busqueda)

      const coincideEstado =
        !filtros.estado ||
        (filtros.estado ===
          'activo' &&
          parte.estado) ||
        (filtros.estado ===
          'inactivo' &&
          !parte.estado)

      return (
        coincideBusqueda &&
        coincideEstado
      )
    },
  )
}

function obtenerMensajeError(
  error: unknown,
): string {
  return error instanceof Error
    ? error.message
    : 'Ocurrió un error inesperado.'
}

export function PartesEquipoPage() {
  const [
    partesEquipo,
    setPartesEquipo,
  ] = useState<ParteEquipo[]>(() =>
    obtenerPartesEquipo(),
  )

  const [filtros, setFiltros] =
    useState<FiltrosPartesEquipoValores>({
      ...FILTROS_INICIALES,
    })

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] =
    useState<FiltrosPartesEquipoValores>({
      ...FILTROS_INICIALES,
    })

  const [page, setPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const [
    formularioAbierto,
    setFormularioAbierto,
  ] = useState(false)

  const [
    parteEnEdicion,
    setParteEnEdicion,
  ] = useState<ParteEquipo | null>(
    null,
  )

  const [
    errorFormulario,
    setErrorFormulario,
  ] = useState('')

  const [
    eliminarAbierto,
    setEliminarAbierto,
  ] = useState(false)

  const [
    parteAEliminar,
    setParteAEliminar,
  ] = useState<ParteEquipo | null>(
    null,
  )

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(
      null,
    )

  const partesFiltradas =
    useMemo(
      () =>
        filtrarPartesEquipo(
          partesEquipo,
          filtrosAplicados,
        ),
      [
        partesEquipo,
        filtrosAplicados,
      ],
    )

  const totalItems =
    partesFiltradas.length

  const partesPaginadas =
    useMemo(() => {
      const indiceInicial =
        (page - 1) * pageSize

      return partesFiltradas.slice(
        indiceInicial,
        indiceInicial + pageSize,
      )
    }, [
      partesFiltradas,
      page,
      pageSize,
    ])

  useEffect(() => {
    const totalPaginas = Math.max(
      1,
      Math.ceil(
        totalItems / pageSize,
      ),
    )

    if (page > totalPaginas) {
      setPage(totalPaginas)
    }
  }, [
    page,
    pageSize,
    totalItems,
  ])

  function recargarPartes(): void {
    setPartesEquipo(
      obtenerPartesEquipo(),
    )
  }

  function abrirFormularioNuevo(): void {
    setMensaje(null)
    setErrorFormulario('')
    setParteEnEdicion(null)
    setFormularioAbierto(true)
  }

  function abrirFormularioEdicion(
    parte: ParteEquipo,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setParteEnEdicion(parte)
    setFormularioAbierto(true)
  }

  function cerrarFormulario(): void {
    setFormularioAbierto(false)
    setParteEnEdicion(null)
    setErrorFormulario('')
  }

  function guardarParte(
    datos: ParteEquipoFormData,
  ): void {
    try {
      if (parteEnEdicion) {
        actualizarParteEquipo(
          parteEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Parte de equipo actualizada correctamente.',
        })
      } else {
        crearParteEquipo(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Parte de equipo registrada correctamente.',
        })
      }

      recargarPartes()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    parte: ParteEquipo,
  ): void {
    setMensaje(null)
    setParteAEliminar(parte)
    setEliminarAbierto(true)
  }

  function cerrarConfirmacionEliminar():
    void {
    setEliminarAbierto(false)
    setParteAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!parteAEliminar) {
      return
    }

    try {
      eliminarParteEquipo(
        parteAEliminar.id,
      )

      recargarPartes()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Parte de equipo eliminada correctamente.',
      })
    } catch (error) {
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'danger',
        texto:
          obtenerMensajeError(error),
      })
    }
  }

  return (
    <>
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Partes de equipo</h1>

              <p>
                Administración de partes y
                componentes utilizados por los
                equipos del almacén.
              </p>
            </div>
          </section>

          {mensaje && (
            <div
              className={`alert alert-${mensaje.tipo} alert-dismissible fade show`}
              role="alert"
            >
              {mensaje.texto}

              <button
                type="button"
                className="btn-close"
                aria-label="Cerrar"
                onClick={() =>
                  setMensaje(null)
                }
              />
            </div>
          )}

          <div className="maestro-panel">
            <FiltrosPartesEquipo
              valores={filtros}
              onChange={(
                campo,
                valor,
              ) =>
                setFiltros(
                  (actual) => ({
                    ...actual,
                    [campo]: valor,
                  }),
                )
              }
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
            <TablaPartesEquipo
              partesEquipo={
                partesPaginadas
              }
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={
                abrirFormularioNuevo
              }
              onEditar={
                abrirFormularioEdicion
              }
              onEliminar={
                abrirConfirmacionEliminar
              }
              onPageChange={setPage}
              onPageSizeChange={(
                cantidad,
              ) => {
                setPageSize(cantidad)
                setPage(1)
              }}
            />
          </div>
        </div>
      </main>

      <FormularioParteEquipo
        abierto={formularioAbierto}
        parteEquipo={parteEnEdicion}
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarParte}
      />

      <ParteEquipoDeleteModal
        abierto={eliminarAbierto}
        parteEquipo={parteAEliminar}
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={
          confirmarEliminacion
        }
      />
    </>
  )
}
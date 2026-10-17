import { useEffect, useState } from 'react'

import { ContactoDeleteModal } from '../../components/contactos/ContactoDeleteModal'
import { SnackbarAlert, useSnackbar } from '../../components/common/SnackbarAlert'
import {
  FiltrosContactos,
  type FiltrosContactosValores,
} from '../../components/contactos/FiltrosContactos'
import { FormularioContacto } from '../../components/contactos/FormularioContacto'
import { TablaContactos } from '../../components/contactos/TablaContactos'

import {
  actualizarContacto,
  crearContacto,
  desactivarContacto,
  listarContactos,
  reactivarContacto,
} from '../../services/contactoService'

import { obtenerProveedores } from '../../services/proveedorService'
import { coincidenIds } from '../../utils/identificadores'

import type {
  Contacto,
  ContactoFormData,
} from '../../types/contacto'

import type { Proveedor } from '../../types/proveedor'

import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const FILTROS_INICIALES:
  FiltrosContactosValores = {
    busqueda: '',
    proveedorId: '',
    estado: '',
  }

function filtrarContactos(
  contactos: Contacto[],
  proveedores: Proveedor[],
  filtros: FiltrosContactosValores,
): Contacto[] {
  const busqueda = filtros.busqueda
    .trim()
    .toLowerCase()

  return contactos.filter(
    (contacto) => {
      const nombreProveedor =
        proveedores.find(
          (proveedor) =>
          coincidenIds(
            proveedor.id,
            contacto.proveedorId,
            'PROV-',
          ),
        )?.razonSocial ?? ''

      const coincideBusqueda =
        !busqueda ||
        contacto.nombreCompleto
          .toLowerCase()
          .includes(busqueda) ||
        contacto.cargo
          .toLowerCase()
          .includes(busqueda) ||
        contacto.telefono
          .toLowerCase()
          .includes(busqueda) ||
        contacto.correo
          .toLowerCase()
          .includes(busqueda) ||
        nombreProveedor
          .toLowerCase()
          .includes(busqueda)

      const coincideProveedor =
        !filtros.proveedorId ||
        coincidenIds(
          contacto.proveedorId,
          filtros.proveedorId,
          'PROV-',
        )

      const coincideEstado =
        !filtros.estado ||
        (filtros.estado ===
          'activo' &&
          contacto.activo === 1) ||
        (filtros.estado ===
          'inactivo' &&
          contacto.activo === 0)

      return (
        coincideBusqueda &&
        coincideProveedor &&
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

export function ContactosPage() {
  const [contactos, setContactos] = useState<Contacto[]>([])
  const [totalItems, setTotalItems] = useState(0)

  const [proveedores] = useState<
    Proveedor[]
  >(() => obtenerProveedores())

  const [filtros, setFiltros] =
    useState<FiltrosContactosValores>({
      ...FILTROS_INICIALES,
    })

  const [
    filtrosAplicados,
    setFiltrosAplicados,
  ] = useState<FiltrosContactosValores>({
    ...FILTROS_INICIALES,
  })

  const [page, setPage] =
    useState(1)

  const [pageSize, setPageSize] =
    useState(10)

  const [
    modalFormularioAbierto,
    setModalFormularioAbierto,
  ] = useState(false)

  const [modoConfirmacion, setModoConfirmacion] =
    useState<'desactivar' | 'reactivar'>('desactivar')

  const [
    contactoEnEdicion,
    setContactoEnEdicion,
  ] = useState<Contacto | null>(
    null,
  )

  const [soloLectura, setSoloLectura] = useState(false)

  const [
    errorFormulario,
    setErrorFormulario,
  ] = useState('')
  const { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta } = useSnackbar()

  const [
    modalEliminarAbierto,
    setModalEliminarAbierto,
  ] = useState(false)

  const [
    contactoAEliminar,
    setContactoAEliminar,
  ] = useState<Contacto | null>(
    null,
  )

  useEffect(() => {
    let cancelado = false
    listarContactos({ nombre: filtrosAplicados.busqueda, pagina: page, tamPagina: pageSize })
      .then((respuesta) => {
        if (cancelado) return
        const datos = filtrarContactos(respuesta.datos, proveedores, { ...filtrosAplicados, busqueda: '' })
        setContactos(datos)
        setTotalItems(respuesta.paginacion.totalElementos ?? datos.length)
      })
      .catch((error) => {
        if (!cancelado) mostrarAlerta('error', obtenerMensajeError(error))
      })
    return () => { cancelado = true }
  }, [page, pageSize, filtrosAplicados, proveedores])

  function recargarContactos(): void {
    void listarContactos({ nombre: filtrosAplicados.busqueda, pagina: page, tamPagina: pageSize })
      .then((respuesta) => {
        const datos = filtrarContactos(respuesta.datos, proveedores, { ...filtrosAplicados, busqueda: '' })
        setContactos(datos)
        setTotalItems(respuesta.paginacion.totalElementos ?? datos.length)
      })
  }

  function abrirFormularioNuevo(): void {
    setErrorFormulario('')
    setContactoEnEdicion(null)
    setSoloLectura(false)
    setModalFormularioAbierto(true)
  }

  function abrirFormularioEdicion(
    contacto: Contacto,
  ): void {
    setErrorFormulario('')
    setContactoEnEdicion(contacto)
    setSoloLectura(false)
    setModalFormularioAbierto(true)
  }

  function abrirVisualizacion(contacto: Contacto): void {
    setErrorFormulario('')
    setContactoEnEdicion(contacto)
    setSoloLectura(true)
    setModalFormularioAbierto(true)
  }

  function cerrarFormulario(): void {
    setModalFormularioAbierto(false)
    setContactoEnEdicion(null)
    setSoloLectura(false)
    setErrorFormulario('')
  }

  async function guardarContacto(
    datos: ContactoFormData,
  ): Promise<void> {
    try {
      const mensajePorDefecto = contactoEnEdicion
        ? 'Contacto actualizado correctamente.'
        : 'Contacto registrado correctamente.'

      if (contactoEnEdicion) {
        const respuesta = await actualizarContacto(
          contactoEnEdicion.id,
          datos,
        )
        mostrarAlerta('success', respuesta.message ?? mensajePorDefecto)
      } else {
        const respuesta = await crearContacto(datos)
        mostrarAlerta('success', respuesta.message ?? mensajePorDefecto)
      }

      recargarContactos()
      cerrarFormulario()
      setPage(1)
    } catch (error) {
      setErrorFormulario(
        obtenerMensajeError(error),
      )
    }
  }

  function abrirConfirmacionEliminar(
    contacto: Contacto,
  ): void {
    setModoConfirmacion('desactivar')
    setContactoAEliminar(contacto)
    setModalEliminarAbierto(true)
  }

  function abrirConfirmacionReactivar(
    contacto: Contacto,
  ): void {
    setModoConfirmacion('reactivar')
    setContactoAEliminar(contacto)
    setModalEliminarAbierto(true)
  }

  function cerrarConfirmacionEliminar():
    void {
    setModalEliminarAbierto(false)
    setContactoAEliminar(null)
  }

  async function confirmarEliminacion(): Promise<void> {
    if (!contactoAEliminar) {
      return
    }

    try {
      if (modoConfirmacion === 'reactivar') {
        await reactivarContacto(contactoAEliminar.id)
      } else {
        await desactivarContacto(contactoAEliminar.id)
      }

      recargarContactos()
      cerrarConfirmacionEliminar()
      mostrarAlerta('success', modoConfirmacion === 'reactivar' ? 'Contacto reactivado correctamente.' : 'Contacto eliminado correctamente.')

    } catch (error) {
      cerrarConfirmacionEliminar()
      mostrarAlerta('error', obtenerMensajeError(error))
    }
  }

  return (
    <>
      <div className="contactos-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Contactos</h1>

              <p>
                Administración de contactos
                comerciales asociados a los
                proveedores.
              </p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosContactos
              valores={filtros}
              proveedores={proveedores}
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
            <TablaContactos
              contactos={contactos}
              proveedores={proveedores}
              totalItems={totalItems}
              page={page}
              pageSize={pageSize}
              onAgregar={
                abrirFormularioNuevo
              }
              onEditar={
                abrirFormularioEdicion
              }
              onVisualizar={
                abrirVisualizacion
              }
              onEliminar={
                abrirConfirmacionEliminar
              }
              onReactivar={
                abrirConfirmacionReactivar
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
      </div>

      <FormularioContacto
        abierto={
          modalFormularioAbierto
        }
        contacto={
          contactoEnEdicion
        }
        proveedores={proveedores}
        error={errorFormulario}
        soloLectura={soloLectura}
        onClose={cerrarFormulario}
        onSubmit={guardarContacto}
      />

      <SnackbarAlert
        mensaje={mensaje}
        abierta={abierta}
        onClose={cerrarAlerta}
        onExited={limpiarAlerta}
      />

      <ContactoDeleteModal
        abierto={
          modalEliminarAbierto
        }
        contacto={
          contactoAEliminar
        }
        onClose={
          cerrarConfirmacionEliminar
        }
        onConfirm={
          confirmarEliminacion
        }
        modo={modoConfirmacion}
      />
    </>
  )
}

import {
  useEffect,
  useMemo,
  useState,
} from 'react'

import { ContactoDeleteModal } from '../../components/contactos/ContactoDeleteModal'
import {
  FiltrosContactos,
  type FiltrosContactosValores,
} from '../../components/contactos/FiltrosContactos'
import { FormularioContacto } from '../../components/contactos/FormularioContacto'
import { TablaContactos } from '../../components/contactos/TablaContactos'

import {
  actualizarContacto,
  crearContacto,
  eliminarContacto,
  obtenerContactos,
} from '../../services/contactoService'

import { obtenerProveedores } from '../../services/proveedorService'

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

interface MensajePagina {
  tipo: 'success' | 'danger'
  texto: string
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
            proveedor.id ===
            contacto.proveedorId,
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
        contacto.proveedorId ===
          filtros.proveedorId

      const coincideEstado =
        !filtros.estado ||
        (filtros.estado ===
          'activo' &&
          contacto.estado) ||
        (filtros.estado ===
          'inactivo' &&
          !contacto.estado)

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
  const [contactos, setContactos] =
    useState<Contacto[]>(() =>
      obtenerContactos(),
    )

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

  const [
    contactoEnEdicion,
    setContactoEnEdicion,
  ] = useState<Contacto | null>(
    null,
  )

  const [
    errorFormulario,
    setErrorFormulario,
  ] = useState('')

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

  const [mensaje, setMensaje] =
    useState<MensajePagina | null>(
      null,
    )

  const contactosFiltrados =
    useMemo(
      () =>
        filtrarContactos(
          contactos,
          proveedores,
          filtrosAplicados,
        ),
      [
        contactos,
        proveedores,
        filtrosAplicados,
      ],
    )

  const totalItems =
    contactosFiltrados.length

  const contactosPaginados =
    useMemo(() => {
      const indiceInicial =
        (page - 1) * pageSize

      return contactosFiltrados.slice(
        indiceInicial,
        indiceInicial + pageSize,
      )
    }, [
      contactosFiltrados,
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

  function recargarContactos(): void {
    setContactos(
      obtenerContactos(),
    )
  }

  function abrirFormularioNuevo(): void {
    setMensaje(null)
    setErrorFormulario('')
    setContactoEnEdicion(null)
    setModalFormularioAbierto(true)
  }

  function abrirFormularioEdicion(
    contacto: Contacto,
  ): void {
    setMensaje(null)
    setErrorFormulario('')
    setContactoEnEdicion(contacto)
    setModalFormularioAbierto(true)
  }

  function cerrarFormulario(): void {
    setModalFormularioAbierto(false)
    setContactoEnEdicion(null)
    setErrorFormulario('')
  }

  function guardarContacto(
    datos: ContactoFormData,
  ): void {
    try {
      if (contactoEnEdicion) {
        actualizarContacto(
          contactoEnEdicion.id,
          datos,
        )

        setMensaje({
          tipo: 'success',
          texto:
            'Contacto actualizado correctamente.',
        })
      } else {
        crearContacto(datos)

        setMensaje({
          tipo: 'success',
          texto:
            'Contacto registrado correctamente.',
        })
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
    setMensaje(null)
    setContactoAEliminar(contacto)
    setModalEliminarAbierto(true)
  }

  function cerrarConfirmacionEliminar():
    void {
    setModalEliminarAbierto(false)
    setContactoAEliminar(null)
  }

  function confirmarEliminacion(): void {
    if (!contactoAEliminar) {
      return
    }

    try {
      eliminarContacto(
        contactoAEliminar.id,
      )

      recargarContactos()
      cerrarConfirmacionEliminar()

      setMensaje({
        tipo: 'success',
        texto:
          'Contacto eliminado correctamente.',
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
              <h1>Contactos</h1>

              <p>
                Administración de contactos
                comerciales asociados a los
                proveedores.
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
              contactos={
                contactosPaginados
              }
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

      <FormularioContacto
        abierto={
          modalFormularioAbierto
        }
        contacto={
          contactoEnEdicion
        }
        proveedores={proveedores}
        error={errorFormulario}
        onClose={cerrarFormulario}
        onSubmit={guardarContacto}
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
      />
    </>
  )
}
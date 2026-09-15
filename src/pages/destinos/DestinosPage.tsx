import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { CheckCircle2, XCircle } from 'lucide-react'
import { useEffect, useMemo, useState } from 'react'

import { DestinoDeleteModal } from '../../components/destinos/DestinoDeleteModal'
import { DestinoFormModal } from '../../components/destinos/DestinoFormModal'
import { FiltrosDestinos, type FiltrosDestinosValores } from '../../components/destinos/FiltrosDestinos'
import { TablaDestinos } from '../../components/destinos/TablaDestinos'
import { actualizarDestino, crearDestino, eliminarDestino, obtenerDestinos, reactivarDestino } from '../../services/destinoService'
import type { Destino, DestinoFormData } from '../../types/destino'
import '../../styles/DashboardPage.css'
import '../../styles/maestros.css'

const INICIALES: FiltrosDestinosValores = { nombre: '', estado: '' }

function filtrar(lista: Destino[], filtros: FiltrosDestinosValores) {
  const nombre = filtros.nombre.trim().toLowerCase()
  return lista.filter((item) => (
    (!nombre || item.nombre.toLowerCase().includes(nombre)) &&
    (!filtros.estado || (filtros.estado === 'activo' ? item.activo === 1 : item.activo === 0))
  ))
}

export function DestinosPage() {
  const [lista, setLista] = useState<Destino[]>(() => obtenerDestinos())
  const [filtros, setFiltros] = useState(INICIALES)
  const [aplicados, setAplicados] = useState(INICIALES)
  const [page, setPage] = useState(1)
  const [pageSize, setPageSize] = useState(10)
  const [formOpen, setFormOpen] = useState(false)
  const [soloLectura, setSoloLectura] = useState(false)
  const [seleccionado, setSeleccionado] = useState<Destino | null>(null)
  const [error, setError] = useState('')
  const [confirmOpen, setConfirmOpen] = useState(false)
  const [reactivarOpen, setReactivarOpen] = useState(false)
  const [objetivo, setObjetivo] = useState<Destino | null>(null)
  const [mensaje, setMensaje] = useState<{ tipo: 'success' | 'error'; texto: string } | null>(null)
  const [alertaAbierta, setAlertaAbierta] = useState(false)

  const filtrados = useMemo(() => filtrar(lista, aplicados), [lista, aplicados])
  const paginados = useMemo(() => filtrados.slice((page - 1) * pageSize, page * pageSize), [filtrados, page, pageSize])

  useEffect(() => {
    setPage((actual) => Math.min(actual, Math.max(1, Math.ceil(filtrados.length / pageSize))))
  }, [filtrados.length, pageSize])

  const mostrarAlerta = (tipo: 'success' | 'error', texto: string) => {
    setMensaje({ tipo, texto })
    setAlertaAbierta(true)
  }

  const recargar = () => setLista(obtenerDestinos())
  const cerrarForm = () => {
    setFormOpen(false)
    setSeleccionado(null)
    setSoloLectura(false)
    setError('')
  }

  const guardar = (datos: DestinoFormData) => {
    try {
      const editando = Boolean(seleccionado)
      editando ? actualizarDestino(seleccionado!.id, datos) : crearDestino(datos)
      recargar()
      cerrarForm()
      setPage(1)
      mostrarAlerta('success', editando ? 'Destino actualizado correctamente.' : 'Destino registrado correctamente.')
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Ocurrió un error inesperado.')
    }
  }

  const cerrarConfirmacion = () => {
    setConfirmOpen(false)
    setReactivarOpen(false)
    setObjetivo(null)
  }

  const confirmar = () => {
    if (!objetivo) return
    const reactivando = reactivarOpen
    try {
      reactivando ? reactivarDestino(objetivo.id) : eliminarDestino(objetivo.id)
      recargar()
      setPage(1)
      mostrarAlerta('success', reactivando ? 'Destino reactivado correctamente.' : 'Destino eliminado correctamente.')
    } catch (e) {
      mostrarAlerta('error', e instanceof Error ? e.message : 'No se pudo actualizar el destino.')
    } finally {
      cerrarConfirmacion()
    }
  }

  return (
    <div className="destinos-page">
      <main className="dashboard-shell maestro-page-shell">
        <div className="container-xl px-0 maestro-page-body">
          <section className="maestro-topbar">
            <div className="maestro-topbar__copy">
              <h1>Destinos</h1>
              <p>Administración de los destinos utilizados en las operaciones del almacén.</p>
            </div>
          </section>

          <div className="maestro-panel">
            <FiltrosDestinos
              valores={filtros}
              onChange={(campo, valor) => setFiltros((actual) => ({ ...actual, [campo]: valor }))}
              onBuscar={() => { setAplicados({ ...filtros }); setPage(1) }}
              onLimpiar={() => { setFiltros(INICIALES); setAplicados(INICIALES); setPage(1) }}
            />
          </div>

          <div className="maestro-panel">
            <TablaDestinos
              destinos={paginados}
              totalItems={filtrados.length}
              page={page}
              pageSize={pageSize}
              onAgregar={() => { setSeleccionado(null); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onEditar={(item) => { setSeleccionado(item); setSoloLectura(false); setError(''); setFormOpen(true) }}
              onVisualizar={(item) => { setSeleccionado(item); setSoloLectura(true); setError(''); setFormOpen(true) }}
              onEliminar={(item) => { setObjetivo(item); setConfirmOpen(true) }}
              onReactivar={(item) => { setObjetivo(item); setReactivarOpen(true) }}
              onPageChange={setPage}
              onPageSizeChange={(size) => { setPageSize(size); setPage(1) }}
            />
          </div>
        </div>
      </main>

      <Snackbar
        open={alertaAbierta && Boolean(mensaje)}
        autoHideDuration={3000}
        onClose={() => setAlertaAbierta(false)}
        slotProps={{ transition: { onExited: () => setMensaje(null) } }}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert
          severity={mensaje?.tipo ?? 'success'}
          icon={mensaje?.tipo === 'success' ? <CheckCircle2 fontSize="inherit" /> : <XCircle fontSize="inherit" />}
          onClose={() => setAlertaAbierta(false)}
          variant="filled"
          sx={{ width: '100%', minWidth: 320, boxShadow: 4 }}
        >
          {mensaje?.texto}
        </Alert>
      </Snackbar>

      <DestinoFormModal abierto={formOpen} destino={seleccionado} error={error} soloLectura={soloLectura} onClose={cerrarForm} onSubmit={guardar} />
      <DestinoDeleteModal abierto={confirmOpen || reactivarOpen} destino={objetivo} modo={reactivarOpen ? 'reactivar' : 'desactivar'} onClose={cerrarConfirmacion} onConfirm={confirmar} />
    </div>
  )
}

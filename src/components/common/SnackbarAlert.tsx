import Alert from '@mui/material/Alert'
import Snackbar from '@mui/material/Snackbar'
import { CheckCircle2, Info, TriangleAlert, XCircle } from 'lucide-react'
import { useState } from 'react'

export type SnackbarTipo = 'success' | 'error' | 'warning' | 'info'

export interface SnackbarMensaje {
  tipo: SnackbarTipo
  texto: string
}

export function useSnackbar() {
  const [mensaje, setMensaje] = useState<SnackbarMensaje | null>(null)
  const [abierta, setAbierta] = useState(false)

  function mostrarAlerta(tipo: SnackbarTipo, texto: string) {
    setMensaje({ tipo, texto })
    setAbierta(true)
  }

  function cerrarAlerta() {
    setAbierta(false)
  }

  function limpiarAlerta() {
    setMensaje(null)
  }

  return { mensaje, abierta, mostrarAlerta, cerrarAlerta, limpiarAlerta }
}

interface SnackbarAlertProps {
  mensaje: SnackbarMensaje | null
  abierta: boolean
  onClose: () => void
  onExited: () => void
}

export function SnackbarAlert({ mensaje, abierta, onClose, onExited }: SnackbarAlertProps) {
  return (
    <Snackbar
      open={abierta && Boolean(mensaje)}
      autoHideDuration={3000}
      onClose={onClose}
      slotProps={{ transition: { onExited } }}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
    >
      <Alert
        severity={mensaje?.tipo ?? 'success'}
        icon={mensaje?.tipo === 'success'
          ? <CheckCircle2 fontSize="inherit" />
          : mensaje?.tipo === 'error'
            ? <XCircle fontSize="inherit" />
            : mensaje?.tipo === 'warning'
              ? <TriangleAlert fontSize="inherit" />
              : <Info fontSize="inherit" />}
        onClose={onClose}
        variant="filled"
        sx={{ width: '100%', minWidth: 320, boxShadow: 4 }}
      >
        {mensaje?.texto}
      </Alert>
    </Snackbar>
  )
}

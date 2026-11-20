import { useCallback, useEffect, useState } from 'react'
import { cancelarSolicitudesApi } from '../services/api'

export function useModalSubmit() {
  const [guardando, setGuardando] = useState(false)

  useEffect(() => () => {
    cancelarSolicitudesApi()
  }, [])

  const ejecutar = useCallback(async (accion: () => void | Promise<void>) => {
    if (guardando) return

    setGuardando(true)
    try {
      await accion()
    } finally {
      setGuardando(false)
    }
  }, [guardando])

  return { guardando, ejecutar }
}

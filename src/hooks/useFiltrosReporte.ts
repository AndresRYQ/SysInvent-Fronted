import { useEffect, useState } from 'react'

import {
  obtenerFiltrosReporteApi,
  type FiltrosReporteCatalogos,
} from '../services/reportesApiService'

const CATALOGOS_VACIOS: FiltrosReporteCatalogos = {
  proveedores: [],
  centrosCosto: [],
  destinos: [],
  partesEquipo: [],
  tiposProducto: [],
  categorias: [],
  productos: [],
}

export interface EstadoFiltrosReporte {
  catalogos: FiltrosReporteCatalogos
  cargandoCatalogos: boolean
  errorCatalogos: string | null
}

/**
 * Carga desde el backend los catálogos activos para los filtros de reportes.
 * Reemplaza a las cachés en memoria de cada maestro, que solo se llenaban si
 * el usuario visitaba antes la pantalla del catálogo.
 */
export function useFiltrosReporte(): EstadoFiltrosReporte {
  const [catalogos, setCatalogos] = useState<FiltrosReporteCatalogos>(CATALOGOS_VACIOS)
  const [cargandoCatalogos, setCargandoCatalogos] = useState(true)
  const [errorCatalogos, setErrorCatalogos] = useState<string | null>(null)

  useEffect(() => {
    let activo = true

    obtenerFiltrosReporteApi()
      .then((resultado) => {
        if (!activo) return
        setCatalogos(resultado)
        setErrorCatalogos(null)
      })
      .catch((error: unknown) => {
        if (!activo) return
        setErrorCatalogos(
          `No se pudieron cargar las opciones de los filtros. ${
            error instanceof Error ? error.message : ''
          }`.trim(),
        )
      })
      .finally(() => {
        if (activo) setCargandoCatalogos(false)
      })

    return () => {
      activo = false
    }
  }, [])

  return { catalogos, cargandoCatalogos, errorCatalogos }
}

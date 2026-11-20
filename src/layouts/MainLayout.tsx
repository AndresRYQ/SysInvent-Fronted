import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import { ModalSubmitGuard } from '../components/common/ModalSubmitGuard'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso']
const TITULOS_PANTALLA: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/perfil': 'Perfil',
  '/bitacora': 'Bitácora',
  '/reportes/kardex': 'Reporte Kardex',
  '/reportes/ingresos': 'Reporte de ingresos',
  '/reportes/vales': 'Reporte de vales',
  '/reportes/productos-mas-pedidos': 'Productos más pedidos',
  '/control-almacen': 'Control de almacén',
  '/ingresos-almacen': 'Ingresos de almacén',
  '/proveedores': 'Proveedores',
  '/productos': 'Productos',
  '/contactos': 'Contactos',
}

export function MainLayout() {
  const { pathname } = useLocation()
  const [modoOscuro, setModoOscuro] = useState<boolean>(() =>
    localStorage.getItem('agrihusac_tema') === 'oscuro',
  )
  const [menuAbierto, setMenuAbierto] = useState<boolean>(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      return false
    }

    const guardado = localStorage.getItem('agrihusac_menu_abierto')
    return guardado === null ? true : guardado === 'true'
  })

  useEffect(() => {
    document.documentElement.dataset.theme = modoOscuro ? 'dark' : 'light'
    localStorage.setItem('agrihusac_tema', modoOscuro ? 'oscuro' : 'claro')
  }, [modoOscuro])

  useEffect(() => {
    const rutaBase = `/${pathname.split('/')[1] ?? ''}`
    const titulo = TITULOS_PANTALLA[pathname]
      ?? TITULOS_PANTALLA[rutaBase]
      ?? 'Sistema de almacén'

    document.title = `${titulo} | AGRIHUSAC`
  }, [pathname])

  const ocultarMenu = SIN_MENU.includes(pathname)
  const cerrarMenuMovil = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setMenuAbierto(false)
      localStorage.setItem('agrihusac_menu_abierto', 'false')
    }
  }

  useEffect(() => {
    localStorage.removeItem('agrihusac_tipos_documento')
    localStorage.removeItem('agrihusac_unidades_medida')
    localStorage.removeItem('agrihusac_categorias')
    localStorage.removeItem('agrihusac_centros_costo')
    localStorage.removeItem('agrihusac_contactos')
    localStorage.removeItem('agrihusac_partes_equipo')
    localStorage.removeItem('agrihusac_proveedores')
    localStorage.removeItem('agrihusac_productos')
    localStorage.removeItem('agrihusac_tipos_producto')

    if (window.matchMedia('(max-width: 1024px)').matches) {
      setMenuAbierto(false)
      localStorage.setItem('agrihusac_menu_abierto', 'false')
    }
  }, [pathname])

  return (
    <div className="app-layout">
      <ModalSubmitGuard />
      <header className="app-header">
        <Header
          menuAbierto={menuAbierto}
          onMenuToggle={() => setMenuAbierto((actual) => !actual)}
          modoOscuro={modoOscuro}
          onModoOscuroToggle={() => setModoOscuro((actual) => !actual)}
        />
      </header>

      <div className="app-content-container">
        {!ocultarMenu && (
          <>
            <button
              type="button"
              className={`sidebar-overlay ${menuAbierto ? 'sidebar-overlay--visible' : ''}`}
              aria-label="Cerrar menú"
              aria-hidden={!menuAbierto}
              tabIndex={menuAbierto ? 0 : -1}
              onClick={cerrarMenuMovil}
            />
            <Sidebar
              abierto={menuAbierto}
              onNavigate={cerrarMenuMovil}
              onToggle={() => setMenuAbierto((actual) => {
                const siguiente = !actual
                localStorage.setItem('agrihusac_menu_abierto', String(siguiente))
                return siguiente
              })}
            />
          </>
        )}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

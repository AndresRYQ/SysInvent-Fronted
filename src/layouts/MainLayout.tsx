import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso']
export function MainLayout() {
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState<boolean>(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      return false
    }

    const guardado = localStorage.getItem('agrihusac_menu_abierto')
    return guardado === null ? true : guardado === 'true'
  })

  const ocultarMenu = SIN_MENU.includes(pathname)
  const cerrarMenuMovil = () => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setMenuAbierto(false)
      localStorage.setItem('agrihusac_menu_abierto', 'false')
    }
  }

  useEffect(() => {
    if (window.matchMedia('(max-width: 1024px)').matches) {
      setMenuAbierto(false)
      localStorage.setItem('agrihusac_menu_abierto', 'false')
    }
  }, [pathname])

  return (
    <div className="app-layout">
      <header className="app-header">
        <Header
          menuAbierto={menuAbierto}
          onMenuToggle={() => setMenuAbierto((actual) => !actual)}
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

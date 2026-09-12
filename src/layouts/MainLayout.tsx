import { useEffect, useRef, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso']
export function MainLayout() {
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState<boolean>(() => {
    const guardado = localStorage.getItem('agrihusac_menu_abierto')
    return guardado === null ? true : guardado === 'true'
  })
  const pathnameAnterior = useRef(pathname)

  const ocultarMenu = SIN_MENU.includes(pathname)

  useEffect(() => {
    if (pathnameAnterior.current === '/dashboard' && pathname !== '/dashboard') {
      setMenuAbierto(true)
      localStorage.setItem('agrihusac_menu_abierto', 'true')
    }

    pathnameAnterior.current = pathname
  }, [pathname])

  return (
    <div className="app-layout">
      <header className="app-header">
        <Header />
      </header>

      <div className="app-content-container">
        {!ocultarMenu && (
          <Sidebar
            abierto={menuAbierto}
            onToggle={() => setMenuAbierto((actual) => {
              const siguiente = !actual
              localStorage.setItem('agrihusac_menu_abierto', String(siguiente))
              return siguiente
            })}
          />
        )}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

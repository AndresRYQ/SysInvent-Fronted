import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso', '/categorias']

export function MainLayout() {
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState(true)

  const ocultarMenu = SIN_MENU.includes(pathname)

  useEffect(() => {
    if (!ocultarMenu) {
      setMenuAbierto(true)
    }
  }, [ocultarMenu])

  return (
    <div className="app-layout">
      <header className="app-header">
        <Header />
      </header>

      <div className="app-content-container">
        {!ocultarMenu && (
          <Sidebar
            abierto={menuAbierto}
            onToggle={() => setMenuAbierto((actual) => !actual)}
          />
        )}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

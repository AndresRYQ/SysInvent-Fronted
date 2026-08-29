import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso']

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
        <Header
          menuAbierto={menuAbierto}
          onMenuClick={() => setMenuAbierto((actual) => !actual)}
          ocultarToggle={ocultarMenu}
        />
      </header>

      <div className="app-content-container">
        {!ocultarMenu && <Sidebar abierto={menuAbierto} />}

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

import { useEffect, useState } from 'react'
import { Outlet, useLocation } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

const SIN_MENU = ['/dashboard', '/sin-permiso']
const ABRE_CERRADO = [
  '/categorias',
  '/centros-costo',
  '/tipos-producto',
  '/tipos-comprobante',
  '/unidades-medida',
  '/destinos',
  '/vales-consumo',
]

export function MainLayout() {
  const { pathname } = useLocation()
  const [menuAbierto, setMenuAbierto] = useState<boolean>(() =>
    ABRE_CERRADO.includes(pathname) ? false : true,
  )

  const ocultarMenu = SIN_MENU.includes(pathname)
  const abrirCerrado = ABRE_CERRADO.includes(pathname)

  useEffect(() => {
    if (abrirCerrado) {
      setMenuAbierto(false)
    } else if (!ocultarMenu) {
      setMenuAbierto(true)
    }
  }, [ocultarMenu, abrirCerrado])

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

import { useState } from 'react'
import { Outlet } from 'react-router-dom'

import { Header } from '../components/common/Header'
import { Sidebar } from '../components/common/Sidebar'
import '../styles/MainLayout.css'

export function MainLayout() {
  const [menuAbierto, setMenuAbierto] = useState(true)

  return (
    <div className="app-layout">
      <header className="app-header">
        <Header
          menuAbierto={menuAbierto}
          onMenuClick={() => setMenuAbierto((actual) => !actual)}
        />
      </header>

      <div className="app-content-container">
        <Sidebar abierto={menuAbierto} />

        <main className="app-main">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

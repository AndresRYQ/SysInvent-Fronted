import { ShieldX } from 'lucide-react'

import {
  Link,
  useNavigate,
} from 'react-router-dom'

import { useAuth } from '../hooks/useAuth'

export function AccessDeniedPage() {
  const { logout } = useAuth()
  const navigate = useNavigate()

  const cerrarSesionActual = () => {
    logout()

    navigate('/login', {
      replace: true,
    })
  }

  return (
    <main
      style={{
        display: 'grid',
        minHeight: '100vh',
        placeItems: 'center',
        padding: '24px',
        background: '#f4f7f4',
      }}
    >
      <section
        style={{
          width: 'min(100%, 520px)',
          padding: '42px 32px',
          borderRadius: '18px',
          background: '#ffffff',
          boxShadow:
            '0 12px 35px rgb(0 0 0 / 10%)',
          textAlign: 'center',
        }}
      >
        <ShieldX
          size={64}
          strokeWidth={1.7}
          color="#b3261e"
          aria-hidden="true"
        />

        <h1
          style={{
            margin: '20px 0 10px',
            color: '#303a33',
            fontSize: '30px',
          }}
        >
          Acceso denegado
        </h1>

        <p
          style={{
            margin: '0 auto',
            color: '#6d716e',
            lineHeight: 1.6,
          }}
        >
          Tu rol no tiene permiso para
          acceder a este módulo.
        </p>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '12px',
            marginTop: '30px',
          }}
        >
          <Link
            to="/dashboard"
            style={{
              padding: '12px 18px',
              borderRadius: '9px',
              color: '#ffffff',
              background: '#338f3c',
              textDecoration: 'none',
            }}
          >
            Ir al inicio
          </Link>

          <button
            type="button"
            onClick={cerrarSesionActual}
            style={{
              padding: '12px 18px',
              border: '1px solid #cfd2cf',
              borderRadius: '9px',
              color: '#4c514e',
              background: '#ffffff',
              cursor: 'pointer',
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </section>
    </main>
  )
}

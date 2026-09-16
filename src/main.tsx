import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { es } from 'date-fns/locale'
import 'bootstrap/dist/css/bootstrap.min.css'
import './index.css'
import 'react-datepicker/dist/react-datepicker.css'
import App from './App.tsx'

import { registerLocale, setDefaultLocale } from 'react-datepicker'

registerLocale('es', es)
setDefaultLocale('es')

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>,
)

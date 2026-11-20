import { useEffect } from 'react'
import {
  cancelarSolicitudesApi,
  haySolicitudesApiEnCurso,
  suscribirseCargaApi,
} from '../../services/api'

const SELECTOR_EXCLUIDO = '.maestro-modal-close, .btn-maestro-danger'

function restaurarFormulario(formulario: HTMLFormElement) {
  formulario.removeAttribute('data-api-submitting')

  formulario.querySelectorAll<HTMLElement>('[data-api-disabled="true"]').forEach((elemento) => {
    elemento.removeAttribute('data-api-disabled')
    if (elemento instanceof HTMLButtonElement || elemento instanceof HTMLInputElement || elemento instanceof HTMLSelectElement || elemento instanceof HTMLTextAreaElement) {
      elemento.disabled = false
    }
  })

  formulario.querySelectorAll<HTMLButtonElement>('[data-api-original-html]').forEach((boton) => {
    const contenido = boton.dataset.apiOriginalHtml
    if (contenido) boton.innerHTML = contenido
    boton.removeAttribute('data-api-original-html')
  })
}

function bloquearFormulario(formulario: HTMLFormElement) {
  formulario.setAttribute('data-api-submitting', 'true')

  formulario.querySelectorAll<HTMLButtonElement>('button[type="submit"]').forEach((boton) => {
    boton.dataset.apiOriginalHtml = boton.innerHTML
    boton.textContent = 'Guardando...'
    boton.disabled = true
  })

  formulario.querySelectorAll<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>('input, select, textarea').forEach((control) => {
    if (control.disabled) return
    control.disabled = true
    control.dataset.apiDisabled = 'true'
  })
}

export function ModalSubmitGuard() {
  useEffect(() => {
    const restaurarTodos = () => {
      document.querySelectorAll<HTMLFormElement>('form[data-api-submitting="true"]').forEach(restaurarFormulario)
    }

    const manejarSubmit = (evento: Event) => {
      const formulario = (evento.target as HTMLElement | null)?.closest<HTMLFormElement>('.maestro-modal-card form, form.maestro-modal-card')
      if (!formulario || formulario.dataset.apiSubmitting === 'true') return

      bloquearFormulario(formulario)
      window.setTimeout(() => {
        if (!haySolicitudesApiEnCurso() && formulario.isConnected) restaurarFormulario(formulario)
      }, 0)
    }

    const manejarClick = (evento: MouseEvent) => {
      const elemento = (evento.target as HTMLElement | null)?.closest<HTMLElement>(SELECTOR_EXCLUIDO)
      const tarjeta = elemento?.closest<HTMLElement>('.maestro-modal-card')
      const formulario = elemento?.closest<HTMLFormElement>('.maestro-modal-card form, form.maestro-modal-card')
        ?? tarjeta?.querySelector<HTMLFormElement>('form[data-api-submitting="true"]')
      if (formulario?.dataset.apiSubmitting === 'true') cancelarSolicitudesApi()
    }

    document.addEventListener('submit', manejarSubmit, true)
    document.addEventListener('click', manejarClick, true)
    const cancelarSuscripcion = suscribirseCargaApi((cargando) => {
      if (!cargando) restaurarTodos()
    })

    return () => {
      document.removeEventListener('submit', manejarSubmit, true)
      document.removeEventListener('click', manejarClick, true)
      cancelarSuscripcion()
    }
  }, [])

  return null
}


import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import '../../styles/maestros.css'
import './Modal.css'

export interface ModalProps {
  open: boolean
  title: string
  onClose: () => void
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg'
  closeOnBackdrop?: boolean
}

/** dialog nativo contiene el foco, maneja Escape y desactiva el fondo. */
export function Modal({ open, title, onClose, children, footer, size = 'md', closeOnBackdrop = true }: ModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null)
  const titleId = useId()
  useEffect(() => {
    const dialog = dialogRef.current
    if (!open || !dialog) return
    const previousFocus = document.activeElement instanceof HTMLElement ? document.activeElement : null
    dialog.showModal()
    return () => {
      dialog.close()
      previousFocus?.focus()
    }
  }, [open])

  if (!open) return null
  return createPortal(<dialog ref={dialogRef} className={`ui-modal ui-modal--${size}`} aria-labelledby={titleId}
    onCancel={(event) => { event.preventDefault(); onClose() }}
    onClick={(event) => {
      if (!closeOnBackdrop || event.target !== event.currentTarget) return
      const bounds = event.currentTarget.getBoundingClientRect()
      if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose()
    }}>
    <div className="ui-modal-header">
      <h2 id={titleId} className="maestro-modal-title">{title}</h2>
      <button type="button" className="btn maestro-action-btn" onClick={onClose} aria-label="Cerrar ventana"><X size={20} /></button>
    </div>
    <div>{children}</div>
    {footer && <div className="maestro-modal-footer">{footer}</div>}
  </dialog>, document.body)
}

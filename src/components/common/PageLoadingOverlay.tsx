interface PageLoadingOverlayProps {
  visible: boolean
  mensaje?: string
}

export function PageLoadingOverlay({
  visible,
  mensaje = 'Cargando información...',
}: PageLoadingOverlayProps) {
  if (!visible) {
    return null
  }

  return (
    <div
      className="maestro-fullscreen-loader"
      role="status"
      aria-live="polite"
    >
      <div
        className="spinner-border text-success"
        aria-hidden="true"
      />
      <span>{mensaje}</span>
    </div>
  )
}

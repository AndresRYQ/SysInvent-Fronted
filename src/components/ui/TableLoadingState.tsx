interface Props {
  visible: boolean
}

export function TableLoadingState({ visible }: Props) {
  if (!visible) return null

  return (
    <div className="table-loading-state" role="status" aria-live="polite">
      <span className="spinner-border spinner-border-sm" aria-hidden="true" />
      Cargando registros...
    </div>
  )
}

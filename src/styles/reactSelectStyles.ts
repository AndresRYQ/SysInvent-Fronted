interface OpcionesEstilosSelect {
  tieneError?: boolean
  altura?: number
  zIndex?: number
}

export function crearEstilosSelect({
  tieneError = false,
  altura = 36,
  zIndex = 10,
}: OpcionesEstilosSelect = {}) {
  const colorBorde = tieneError
    ? 'var(--color-red-danger)'
    : 'var(--color-border)'

  return {
    control: (base: any, state: any) => ({
      ...base,
      minHeight: altura,
      height: altura,
      borderRadius: 8,
      backgroundColor: 'var(--color-select-bg)',
      borderColor: state.isFocused
        ? 'var(--color-green-focus)'
        : colorBorde,
      boxShadow: tieneError
        ? '0 0 0 3px rgb(220 38 38 / 14%)'
        : state.isFocused
          ? '0 0 0 0.22rem var(--color-green-outline)'
          : 'none',
      '&:hover': {
        borderColor: tieneError
          ? 'var(--color-red-danger)'
          : state.isFocused
            ? 'var(--color-green-focus)'
            : 'var(--color-border)',
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      padding: '0 12px',
      fontSize: 'var(--form-control-font-size)',
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'var(--color-text-secondary)',
      fontSize: 'var(--form-control-font-size)',
    }),
    placeholder: (base: any) => ({
      ...base,
      color: 'var(--color-text-muted)',
      fontSize: 'var(--form-control-font-size)',
    }),
    indicatorsContainer: (base: any) => ({
      ...base,
      height: altura - 2,
    }),
    menu: (base: any) => ({
      ...base,
      zIndex,
    }),
    option: (base: any, state: any) => ({
      ...base,
      color: state.isSelected
        ? 'var(--color-white)'
        : 'var(--color-text-secondary)',
      fontSize: 'var(--form-control-font-size)',
      backgroundColor: state.isSelected
        ? 'var(--color-green)'
        : state.isFocused
          ? 'var(--color-green-soft)'
          : 'var(--color-white)',
    }),
  }
}

export class ValidadorRangoFechas {
  static validar(
    fechaInicio: string,
    fechaFin: string,
  ): string | null {
    if (!fechaInicio || !fechaFin) {
      return null
    }

    if (fechaInicio >= fechaFin) {
      return 'La fecha de inicio debe ser anterior a la fecha de fin.'
    }

    return null
  }

  static esValido(
    fechaInicio: string,
    fechaFin: string,
  ): boolean {
    return !this.validar(fechaInicio, fechaFin)
  }
}

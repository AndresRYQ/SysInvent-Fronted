/**
 * Permite convivir con datos heredados con prefijo (por ejemplo, PROV-001)
 * y los maestros actuales que usan IDs numéricos (1).
 */
export function coincidenIds(
  primero: string | number | null | undefined,
  segundo: string | number | null | undefined,
  prefijo: string,
): boolean {
  return normalizarId(primero, prefijo) === normalizarId(segundo, prefijo)
}

export function normalizarId(
  valor: string | number | null | undefined,
  prefijo: string,
): string {
  const texto = String(valor ?? '').trim()
  const inicio = prefijo.toUpperCase()

  if (!texto.toUpperCase().startsWith(inicio)) {
    return texto
  }

  const numero = texto.slice(prefijo.length)
  return /^\d+$/.test(numero) ? String(Number(numero)) : texto
}

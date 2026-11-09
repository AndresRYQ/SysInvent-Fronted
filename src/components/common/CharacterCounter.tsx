interface CharacterCounterProps {
  value: string
  maxLength: number
}

export function CharacterCounter({ value, maxLength }: CharacterCounterProps) {
  return (
    <small className="text-muted character-counter" aria-live="polite">
      {value.length}/{maxLength}
    </small>
  )
}

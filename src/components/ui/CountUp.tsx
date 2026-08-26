import { useEffect, useMemo, useState } from 'react'

type CountUpProps = {
  end: number
  duration?: number
  prefix?: string
  suffix?: string
}

function CountUp({ end, duration = 900, prefix = '', suffix = '' }: CountUpProps) {
  const [value, setValue] = useState(0)

  const formatter = useMemo(
    () =>
      new Intl.NumberFormat('es-PE', {
        maximumFractionDigits: 0,
      }),
    [],
  )

  useEffect(() => {
    let frame = 0
    let startTime: number | null = null

    const animate = (timestamp: number) => {
      if (startTime === null) startTime = timestamp

      const progress = Math.min((timestamp - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3)

      setValue(Math.round(end * eased))

      if (progress < 1) {
        frame = requestAnimationFrame(animate)
      }
    }

    frame = requestAnimationFrame(animate)

    return () => cancelAnimationFrame(frame)
  }, [duration, end])

  return (
    <span>
      {prefix}
      {formatter.format(value)}
      {suffix}
    </span>
  )
}

export default CountUp

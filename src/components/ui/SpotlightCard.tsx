import type { CSSProperties, ReactNode } from 'react'

type SpotlightCardProps = {
  children: ReactNode
  className?: string
  color?: string
}

function SpotlightCard({
  children,
  className = '',
  color = 'rgba(38, 170, 97, 0.22)',
}: SpotlightCardProps) {
  return (
    <article
      className={`rb-spotlight-card ${className}`}
      style={{ '--rb-spotlight': color } as CSSProperties}
    >
      {children}
    </article>
  )
}

export default SpotlightCard

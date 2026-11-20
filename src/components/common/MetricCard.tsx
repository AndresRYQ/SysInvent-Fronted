import type { ReactNode } from 'react'

import SpotlightCard from '../ui/SpotlightCard'
import './MetricCard.css'

type MetricCardStatus = 'positive' | 'alert' | 'neutral'

interface MetricCardProps {
  label: string
  value: ReactNode
  detail: string
  icon: ReactNode
  tone: string
  status?: MetricCardStatus
  spotlight?: boolean
}

export function MetricCard({
  label,
  value,
  detail,
  icon,
  tone,
  status = 'neutral',
  spotlight = false,
}: MetricCardProps) {
  const content = (
    <>
      <span className={`icon-bubble tone-${tone}`}>
        {icon}
      </span>

      <div>
        <p>{label}</p>
        <strong>{value}</strong>
        <small className={`metric-detail metric-detail--${status}`}>
          {detail}
        </small>
      </div>
    </>
  )

  if (spotlight) {
    return (
      <SpotlightCard
        className="metric-card"
        color={`var(--tone-${tone}-soft)`}
      >
        {content}
      </SpotlightCard>
    )
  }

  return <div className="metric-card">{content}</div>
}

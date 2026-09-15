import type { LucideIcon } from 'lucide-react'

interface EmptyStateProps {
  icon: LucideIcon
  title: string
  description: string
  iconSize?: number
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  iconSize = 38,
}: EmptyStateProps) {
  return (
    <div className="table-empty-state" role="status">
      <Icon size={iconSize} />
      <strong>{title}</strong>
      <span>{description}</span>
    </div>
  )
}

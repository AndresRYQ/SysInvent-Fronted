import type { CSSProperties, ReactNode } from 'react'

type AnimatedContentProps = {
  children: ReactNode
  className?: string
  delay?: number
}

function AnimatedContent({ children, className = '', delay = 0 }: AnimatedContentProps) {
  return (
    <div
      className={`rb-animated-content ${className}`}
      style={{ '--rb-delay': `${delay}ms` } as CSSProperties}
    >
      {children}
    </div>
  )
}

export default AnimatedContent

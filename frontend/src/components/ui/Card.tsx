import styles from './Card.module.css'

interface CardProps {
  title?: string
  subtitle?: string
  children: React.ReactNode
  className?: string
}

export function Card({ title, subtitle, children, className }: CardProps) {
  return (
    <div className={`${styles.card} ${className ?? ''}`}>
      {(title || subtitle) && (
        <div className={styles.cardHeader}>
          {title && <h3 className={styles.cardTitle}>{title}</h3>}
          {subtitle && <span className={styles.cardSubtitle}>{subtitle}</span>}
        </div>
      )}
      {children}
    </div>
  )
}
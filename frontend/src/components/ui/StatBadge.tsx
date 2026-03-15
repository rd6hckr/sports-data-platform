import styles from './StatBadge.module.css'

interface StatBadgeProps {
  label: string
  value: string | number
  accent?: boolean
  danger?: boolean
}

export function StatBadge({ label, value, accent, danger }: StatBadgeProps) {
  return (
    <div className={styles.badge}>
      <span className={styles.label}>{label}</span>
      <span
        className={styles.value}
        style={{
          color: accent
            ? 'var(--color-accent)'
            : danger
            ? 'var(--color-danger)'
            : 'var(--color-text)',
        }}
      >
        {value}
      </span>
    </div>
  )
}
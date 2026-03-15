import { useMatches } from '../hooks/useFootball'
import { Card } from '../components/ui/Card'
import { MatchList } from '../components/charts/MatchList'
import { COMPETITION_NAMES } from '../types'
import styles from './MatchesPage.module.css'

interface MatchesPageProps {
  competition: string
}

export function MatchesPage({ competition }: MatchesPageProps) {
  const { data, loading, error } = useMatches(competition, undefined, 30)

  if (loading) return <div className={styles.state}>Loading matches...</div>
  if (error) return <div className={styles.stateError}>{error}</div>
  if (!data.length) return <div className={styles.state}>No matches available</div>

  const totalGoals = data.reduce((sum, m) => sum + m.total_goals, 0)
  const avgGoals = (totalGoals / data.length).toFixed(1)
  const draws = data.filter(m => m.winner === 'Draw').length

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {COMPETITION_NAMES[competition] ?? competition}
        </h1>
        <p className={styles.heroSub}>Recent results</p>
      </div>

      <div className={styles.kpis}>
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{data.length}</span>
          <span className={styles.kpiLabel}>Matches</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiValue} style={{ color: 'var(--color-accent)' }}>{totalGoals}</span>
          <span className={styles.kpiLabel}>Total Goals</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{avgGoals}</span>
          <span className={styles.kpiLabel}>Avg Goals/Match</span>
        </div>
        <div className={styles.kpi}>
          <span className={styles.kpiValue}>{draws}</span>
          <span className={styles.kpiLabel}>Draws</span>
        </div>
      </div>

      <Card title="RECENT MATCHES" subtitle={`Last ${data.length} results`}>
        <MatchList data={data} />
      </Card>
    </div>
  )
}
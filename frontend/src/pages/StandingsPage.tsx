import { useStandings } from '../hooks/useFootball'
import { Card } from '../components/ui/Card'
import { StatBadge } from '../components/ui/StatBadge'
import { StandingsChart } from '../components/charts/StandingsChart'
import { GoalsChart } from '../components/charts/GoalsChart'
import { COMPETITION_NAMES } from '../types'
import styles from './StandingsPage.module.css'

interface StandingsPageProps {
  competition: string
}

export function StandingsPage({ competition }: StandingsPageProps) {
  const { data, loading, error } = useStandings(competition)

  if (loading) return <div className={styles.state}>Loading standings...</div>
  if (error) return <div className={styles.stateError}>{error}</div>
  if (!data.length) return <div className={styles.state}>No data available</div>

  const leader = data[0]
  const mostGoals = [...data].sort((a, b) => b.goals_for - a.goals_for)[0]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {COMPETITION_NAMES[competition] ?? competition}
        </h1>
        <p className={styles.heroSub}>Season standings & performance</p>
      </div>

      <div className={styles.kpis}>
        <StatBadge label="Leader" value={leader.team_name} accent />
        <StatBadge label="Points" value={leader.points} accent />
        <StatBadge label="Top Scorer" value={mostGoals.team_name} />
        <StatBadge label="Goals" value={mostGoals.goals_for} />
        <StatBadge label="Teams" value={data.length} />
      </div>

      <div className={styles.grid}>
        <Card title="POINTS TABLE" subtitle="Top 10">
          <StandingsChart data={data} />
        </Card>
        <Card title="GOALS" subtitle="Scored vs Conceded">
          <GoalsChart data={data} />
        </Card>
      </div>

      <Card title="FULL STANDINGS">
        <div className={styles.table}>
          <div className={styles.tableHeader}>
            <span>#</span>
            <span>Team</span>
            <span>P</span>
            <span>W</span>
            <span>D</span>
            <span>L</span>
            <span>GF</span>
            <span>GA</span>
            <span>GD</span>
            <span>PTS</span>
          </div>
          {data.map(row => (
            <div
              key={row.team_id}
              className={`${styles.tableRow} ${
                row.position <= 4 ? styles.champions :
                row.position > data.length - 3 ? styles.relegated : ''
              }`}
            >
              <span className={styles.position}>{row.position}</span>
              <span className={styles.teamName}>{row.team_name}</span>
              <span>{row.played_games}</span>
              <span>{row.won}</span>
              <span>{row.draw}</span>
              <span>{row.lost}</span>
              <span>{row.goals_for}</span>
              <span>{row.goals_against}</span>
              <span className={row.goal_difference > 0 ? styles.positive : styles.negative}>
                {row.goal_difference > 0 ? '+' : ''}{row.goal_difference}
              </span>
              <span className={styles.points}>{row.points}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  )
}
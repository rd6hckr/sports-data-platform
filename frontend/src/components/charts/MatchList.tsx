import type { Match } from '../../types'
import styles from './MatchList.module.css'

interface MatchListProps {
  data: Match[]
}

function formatDate(dateStr: string) {
  const date = new Date(dateStr)
  return date.toLocaleDateString('en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  })
}

export function MatchList({ data }: MatchListProps) {
  return (
    <div className={styles.list}>
      {data.map(match => (
        <div key={match.match_id} className={styles.match}>
          <span className={styles.date}>{formatDate(match.match_date)}</span>

          <div className={styles.teams}>
            <span className={`${styles.team} ${match.winner === match.home_team_name ? styles.winner : ''}`}>
              {match.home_team_name}
            </span>
            <div className={styles.score}>
              <span className={styles.scoreNum}>{match.home_score}</span>
              <span className={styles.scoreSep}>—</span>
              <span className={styles.scoreNum}>{match.away_score}</span>
            </div>
            <span className={`${styles.team} ${styles.teamRight} ${match.winner === match.away_team_name ? styles.winner : ''}`}>
              {match.away_team_name}
            </span>
          </div>

          <span className={`${styles.result} ${
            match.winner === 'Draw' ? styles.draw :
            match.winner === match.home_team_name ? styles.home : styles.away
          }`}>
            {match.winner === 'Draw' ? 'D' : match.winner === match.home_team_name ? 'H' : 'A'}
          </span>
        </div>
      ))}
    </div>
  )
}

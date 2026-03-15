import { useCompetitionStats, useTopTeams } from '../hooks/useFootball'
import { Card } from '../components/ui/Card'
import { StatBadge } from '../components/ui/StatBadge'
import { COMPETITION_NAMES } from '../types'
import styles from './StatsPage.module.css'

interface StatsPageProps {
  competition: string
}

export function StatsPage({ competition }: StatsPageProps) {
  const { data: stats, loading: loadingStats } = useCompetitionStats(competition)
  const { data: topTeams, loading: loadingTeams } = useTopTeams(competition, undefined, 5)

  if (loadingStats || loadingTeams) return <div className={styles.state}>Loading stats...</div>
  if (!stats.length) return <div className={styles.state}>No stats available</div>

  const latest = stats[0]

  return (
    <div className={styles.page}>
      <div className={styles.hero}>
        <h1 className={styles.heroTitle}>
          {COMPETITION_NAMES[competition] ?? competition}
        </h1>
        <p className={styles.heroSub}>Competition statistics</p>
      </div>

      <div className={styles.kpis}>
        <StatBadge label="Total Matches" value={latest.total_matches} />
        <StatBadge label="Total Goals" value={latest.total_goals} accent />
        <StatBadge label="Avg Goals/Match" value={latest.avg_goals_per_match} accent />
        <StatBadge label="Total Draws" value={latest.total_draws} />
        <StatBadge label="Draw %" value={`${latest.draw_percentage}%`} />
        <StatBadge label="Highest Scoring" value={`${latest.highest_scoring_match} goals`} />
        <StatBadge label="Goalless Matches" value={latest.total_goalless_matches} danger />
      </div>

      <Card title="TOP 5 TEAMS" subtitle="By points">
        <div className={styles.topTeams}>
          {topTeams.map((team, index) => (
            <div key={team.team_id} className={styles.teamRow}>
              <span className={styles.rank}>0{index + 1}</span>
              <div className={styles.teamInfo}>
                <span className={styles.teamName}>{team.team_name}</span>
                <div className={styles.teamStats}>
                  <span>{team.played_games} played</span>
                  <span>{team.won}W {team.draw}D {team.lost}L</span>
                  <span>{team.goals_for} goals</span>
                </div>
              </div>
              <div className={styles.pointsBar}>
                <div
                  className={styles.pointsFill}
                  style={{ width: `${team.points_percentage}%` }}
                />
              </div>
              <span className={styles.points}>{team.points} pts</span>
            </div>
          ))}
        </div>
      </Card>

      <div className={styles.grid}>
        <Card title="WIN RATES" subtitle="Top 5 teams">
          <div className={styles.winRates}>
            {topTeams.map(team => (
              <div key={team.team_id} className={styles.winRateRow}>
                <span className={styles.winRateTeam}>{team.team_name}</span>
                <div className={styles.winRateBar}>
                  <div
                    className={styles.winRateFill}
                    style={{ width: `${team.win_percentage}%` }}
                  />
                </div>
                <span className={styles.winRatePct}>{team.win_percentage}%</span>
              </div>
            ))}
          </div>
        </Card>

        <Card title="GOALS PER GAME" subtitle="Top 5 teams">
          <div className={styles.winRates}>
            {topTeams.map(team => (
              <div key={team.team_id} className={styles.winRateRow}>
                <span className={styles.winRateTeam}>{team.team_name}</span>
                <div className={styles.winRateBar}>
                  <div
                    className={styles.goalsFill}
                    style={{ width: `${(Number(team.avg_goals_per_game) / 4) * 100}%` }}
                  />
                </div>
                <span className={styles.winRatePct}>{team.avg_goals_per_game}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  )
}
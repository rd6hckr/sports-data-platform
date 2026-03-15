import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import type { Standing } from '../../types'
import styles from './GoalsChart.module.css'

interface GoalsChartProps {
  data: Standing[]
}

export function GoalsChart({ data }: GoalsChartProps) {
  const chartData = data.slice(0, 10).map(s => ({
    name: s.team_name.length > 10 ? s.team_name.slice(0, 10) + '…' : s.team_name,
    scored: s.goals_for,
    conceded: s.goals_against,
  }))

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="colorScored" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="colorConceded" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="var(--color-danger)" stopOpacity={0.3} />
              <stop offset="95%" stopColor="var(--color-danger)" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" vertical={false} />
          <XAxis
            dataKey="name"
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <YAxis
            tick={{ fill: 'var(--color-text-muted)', fontSize: 11 }}
            axisLine={false}
            tickLine={false}
          />
          <Tooltip
            contentStyle={{
              background: 'var(--color-surface-2)',
              border: '1px solid var(--color-border)',
              borderRadius: '8px',
              color: 'var(--color-text)',
              fontSize: '12px',
            }}
            cursor={{ stroke: 'var(--color-border)' }}
          />
          <Area
            type="monotone"
            dataKey="scored"
            stroke="var(--color-accent)"
            strokeWidth={2}
            fill="url(#colorScored)"
          />
          <Area
            type="monotone"
            dataKey="conceded"
            stroke="var(--color-danger)"
            strokeWidth={2}
            fill="url(#colorConceded)"
          />
        </AreaChart>
      </ResponsiveContainer>

      <div className={styles.legend}>
        <span className={styles.legendItem}>
          <span className={styles.dotAccent} /> Goals Scored
        </span>
        <span className={styles.legendItem}>
          <span className={styles.dotDanger} /> Goals Conceded
        </span>
      </div>
    </div>
  )
}
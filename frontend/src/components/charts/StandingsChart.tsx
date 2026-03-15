import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
} from 'recharts'
import type { Standing } from '../../types'
import styles from './StandingsChart.module.css'

interface StandingsChartProps {
  data: Standing[]
}

export function StandingsChart({ data }: StandingsChartProps) {
  const chartData = data.slice(0, 10).map(s => ({
    name: s.team_name.length > 10 ? s.team_name.slice(0, 10) + '…' : s.team_name,
    points: s.points,
    won: s.won,
    lost: s.lost,
    draw: s.draw,
  }))

  return (
    <div className={styles.container}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
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
            cursor={{ fill: 'rgba(255,255,255,0.03)' }}
          />
          <Bar dataKey="points" radius={[4, 4, 0, 0]}>
            {chartData.map((_, index) => (
              <Cell
                key={index}
                fill={index < 4 ? 'var(--color-accent)' : index > 16 ? 'var(--color-danger)' : 'var(--color-accent-2)'}
                fillOpacity={0.85}
              />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  )
}
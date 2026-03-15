import { useState } from 'react'
import styles from './Header.module.css'

const NAV_ITEMS = [
  { label: 'Standings', value: 'standings' },
  { label: 'Matches', value: 'matches' },
  { label: 'Stats', value: 'stats' },
]

interface HeaderProps {
  activePage: string
  onNavigate: (page: string) => void
  competition: string
  onCompetitionChange: (competition: string) => void
}

const COMPETITIONS = [
  { code: 'PL', name: 'Premier League' },
  { code: 'PD', name: 'La Liga' },
  { code: 'BL1', name: 'Bundesliga' },
  { code: 'SA', name: 'Serie A' },
  { code: 'CL', name: 'Champions League' },
]

export function Header({ activePage, onNavigate, competition, onCompetitionChange }: HeaderProps) {
  return (
    <header className={styles.header}>
      <div className={styles.logo}>
        <span className={styles.logoText}>
          SPORT<span className={styles.logoAccent}>DATA</span>
        </span>
      </div>

      <nav className={styles.nav}>
        {NAV_ITEMS.map(item => (
          <button
            key={item.value}
            className={`${styles.navItem} ${activePage === item.value ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.value)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <select
        value={competition}
        onChange={e => onCompetitionChange(e.target.value)}
        style={{
          background: 'var(--color-surface)',
          color: 'var(--color-text)',
          border: '1px solid var(--color-border)',
          borderRadius: 'var(--radius-sm)',
          padding: '6px 12px',
          fontFamily: 'var(--font-body)',
          fontSize: '13px',
          cursor: 'pointer',
        }}
      >
        {COMPETITIONS.map(c => (
          <option key={c.code} value={c.code}>{c.name}</option>
        ))}
      </select>
    </header>
  )
}
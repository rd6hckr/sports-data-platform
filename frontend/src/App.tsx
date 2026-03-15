import { useState } from 'react'
import { Header } from './components/layout/Header'
import { StandingsPage } from './pages/StandingsPage'
import { MatchesPage } from './pages/MatchesPage'
import { StatsPage } from './pages/StatsPage'
import './index.css'

function App() {
  const [activePage, setActivePage] = useState('standings')
  const [competition, setCompetition] = useState('PL')

  const renderPage = () => {
    switch (activePage) {
      case 'standings':
        return <StandingsPage competition={competition} />
      case 'matches':
        return <MatchesPage competition={competition} />
      case 'stats':
        return <StatsPage competition={competition} />
      default:
        return <StandingsPage competition={competition} />
    }
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--color-bg)' }}>
      <Header
        activePage={activePage}
        onNavigate={setActivePage}
        competition={competition}
        onCompetitionChange={setCompetition}
      />
      <main style={{ padding: '32px 40px', maxWidth: '1400px', margin: '0 auto' }}>
        {renderPage()}
      </main>
    </div>
  )
}

export default App
export interface Standing {
  competition_code: string
  season: string
  position: number
  team_id: number
  team_name: string
  points: number
  played_games: number
  won: number
  draw: number
  lost: number
  goals_for: number
  goals_against: number
  goal_difference: number
  home_games: number
  home_goals_scored: number
  home_wins: number
  away_games: number
  away_goals_scored: number
  away_wins: number
  avg_goals_per_game: number
  win_percentage: number
  points_percentage: number
}

export interface Match {
  match_id: number
  competition_code: string
  season: string
  matchday: number
  home_team_name: string
  away_team_name: string
  home_score: number
  away_score: number
  winner: string
  total_goals: number
  match_date: string
}

export interface CompetitionStat {
  competition_code: string
  season: string
  total_matches: number
  total_goals: number
  avg_goals_per_match: number
  total_draws: number
  highest_scoring_match: number
  total_goalless_matches: number
  draw_percentage: number
}

export interface Competition {
  competition_code: string
  season: string
}

export const COMPETITION_NAMES: Record<string, string> = {
  PL: 'Premier League',
  PD: 'La Liga',
  BL1: 'Bundesliga',
  SA: 'Serie A',
  CL: 'Champions League',
}
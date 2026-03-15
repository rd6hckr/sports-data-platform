import axios from 'axios'
import type { Standing, Match, CompetitionStat, Competition } from '../types'

const BASE_URL = '/api'

const client = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
})

export const api = {
  getCompetitions: async (): Promise<Competition[]> => {
    const { data } = await client.get('/competitions')
    return data
  },

  getStandings: async (competition: string, season?: string): Promise<Standing[]> => {
    const { data } = await client.get('/standings', {
      params: { competition, season },
    })
    return data
  },

  getMatches: async (competition: string, season?: string, limit = 20): Promise<Match[]> => {
    const { data } = await client.get('/matches', {
      params: { competition, season, limit },
    })
    return data
  },

  getCompetitionStats: async (competition: string): Promise<CompetitionStat[]> => {
    const { data } = await client.get('/competition-stats', {
      params: { competition },
    })
    return data
  },

  getTopTeams: async (competition: string, season?: string, limit = 10): Promise<Standing[]> => {
    const { data } = await client.get('/top-teams', {
      params: { competition, season, limit },
    })
    return data
  },
}
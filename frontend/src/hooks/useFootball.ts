import { useState, useEffect } from 'react'
import { api } from '../services/api'
import type { Standing, Match, CompetitionStat } from '../types'

export function useStandings(competition: string, season?: string) {
  const [data, setData] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getStandings(competition, season)
      .then(setData)
      .catch(() => setError('Failed to fetch standings'))
      .finally(() => setLoading(false))
  }, [competition, season])

  return { data, loading, error }
}

export function useMatches(competition: string, season?: string, limit = 20) {
  const [data, setData] = useState<Match[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getMatches(competition, season, limit)
      .then(setData)
      .catch(() => setError('Failed to fetch matches'))
      .finally(() => setLoading(false))
  }, [competition, season, limit])

  return { data, loading, error }
}

export function useCompetitionStats(competition: string) {
  const [data, setData] = useState<CompetitionStat[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getCompetitionStats(competition)
      .then(setData)
      .catch(() => setError('Failed to fetch stats'))
      .finally(() => setLoading(false))
  }, [competition])

  return { data, loading, error }
}

export function useTopTeams(competition: string, season?: string, limit = 10) {
  const [data, setData] = useState<Standing[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    setLoading(true)
    api.getTopTeams(competition, season, limit)
      .then(setData)
      .catch(() => setError('Failed to fetch top teams'))
      .finally(() => setLoading(false))
  }, [competition, season, limit])

  return { data, loading, error }
}
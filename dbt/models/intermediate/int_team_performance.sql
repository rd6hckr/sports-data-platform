WITH standings AS (
    SELECT * FROM {{ ref('stg_standings') }}
),

matches AS (
    SELECT * FROM {{ ref('stg_matches') }}
),

home_stats AS (
    SELECT
        competition_code,
        season,
        home_team_id AS team_id,
        home_team_name AS team_name,
        COUNT(*) AS home_games,
        SUM(home_score) AS home_goals_scored,
        SUM(away_score) AS home_goals_conceded,
        SUM(CASE WHEN winner = home_team_name THEN 1 ELSE 0 END) AS home_wins
    FROM matches
    GROUP BY competition_code, season, home_team_id, home_team_name
),

away_stats AS (
    SELECT
        competition_code,
        season,
        away_team_id AS team_id,
        away_team_name AS team_name,
        COUNT(*) AS away_games,
        SUM(away_score) AS away_goals_scored,
        SUM(home_score) AS away_goals_conceded,
        SUM(CASE WHEN winner = away_team_name THEN 1 ELSE 0 END) AS away_wins
    FROM matches
    GROUP BY competition_code, season, away_team_id, away_team_name
)

SELECT
    s.competition_code,
    s.season,
    s.team_id,
    s.team_name,
    s.position,
    s.points,
    s.played_games,
    s.won,
    s.draw,
    s.lost,
    s.goals_for,
    s.goals_against,
    s.goal_difference,
    COALESCE(h.home_games, 0) AS home_games,
    COALESCE(h.home_goals_scored, 0) AS home_goals_scored,
    COALESCE(h.home_wins, 0) AS home_wins,
    COALESCE(a.away_games, 0) AS away_games,
    COALESCE(a.away_goals_scored, 0) AS away_goals_scored,
    COALESCE(a.away_wins, 0) AS away_wins,
    ROUND(s.goals_for::numeric / NULLIF(s.played_games, 0), 2) AS avg_goals_per_game
FROM standings s
LEFT JOIN home_stats h ON h.team_id = s.team_id
    AND h.competition_code = s.competition_code
    AND h.season = s.season
LEFT JOIN away_stats a ON a.team_id = s.team_id
    AND a.competition_code = s.competition_code
    AND a.season = s.season

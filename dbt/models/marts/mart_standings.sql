WITH team_performance AS (
    SELECT * FROM {{ ref('int_team_performance') }}
)

SELECT
    competition_code,
    season,
    position,
    team_id,
    team_name,
    points,
    played_games,
    won,
    draw,
    lost,
    goals_for,
    goals_against,
    goal_difference,
    home_games,
    home_goals_scored,
    home_wins,
    away_games,
    away_goals_scored,
    away_wins,
    avg_goals_per_game,
    ROUND(won::numeric / NULLIF(played_games, 0) * 100, 1) AS win_percentage,
    ROUND(points::numeric / NULLIF(played_games * 3, 0) * 100, 1) AS points_percentage
FROM team_performance
ORDER BY competition_code, season, position

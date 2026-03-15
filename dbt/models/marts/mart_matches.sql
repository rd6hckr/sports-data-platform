WITH matches AS (
    SELECT * FROM {{ ref('stg_matches') }}
)

SELECT
    match_id,
    competition_code,
    season,
    matchday,
    home_team_name,
    away_team_name,
    home_score,
    away_score,
    winner,
    total_goals,
    match_date
FROM matches
ORDER BY match_date DESC

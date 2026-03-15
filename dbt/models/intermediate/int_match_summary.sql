WITH matches AS (
    SELECT * FROM {{ ref('stg_matches') }}
)

SELECT
    competition_code,
    season,
    matchday,
    COUNT(*) AS total_matches,
    SUM(total_goals) AS total_goals,
    ROUND(AVG(total_goals), 2) AS avg_goals_per_match,
    SUM(CASE WHEN winner = 'Draw' THEN 1 ELSE 0 END) AS draws,
    MAX(total_goals) AS highest_scoring_match,
    COUNT(CASE WHEN total_goals = 0 THEN 1 END) AS goalless_matches
FROM matches
GROUP BY competition_code, season, matchday
ORDER BY competition_code, season, matchday

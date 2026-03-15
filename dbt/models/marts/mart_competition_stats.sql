WITH summary AS (
    SELECT * FROM {{ ref('int_match_summary') }}
)

SELECT
    competition_code,
    season,
    SUM(total_matches) AS total_matches,
    SUM(total_goals) AS total_goals,
    ROUND(AVG(avg_goals_per_match), 2) AS avg_goals_per_match,
    SUM(draws) AS total_draws,
    MAX(highest_scoring_match) AS highest_scoring_match,
    SUM(goalless_matches) AS total_goalless_matches,
    ROUND(SUM(draws)::numeric / NULLIF(SUM(total_matches), 0) * 100, 1) AS draw_percentage
FROM summary
GROUP BY competition_code, season
ORDER BY competition_code, season

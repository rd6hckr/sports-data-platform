WITH source AS (
    SELECT * FROM raw.matches
),

renamed AS (
    SELECT
        id AS match_id,
        competition_code,
        season,
        matchday,
        status,
        home_team_id,
        home_team_name,
        away_team_id,
        away_team_name,
        home_score,
        away_score,
        CASE
            WHEN home_score > away_score THEN home_team_name
            WHEN away_score > home_score THEN away_team_name
            ELSE 'Draw'
        END AS winner,
        home_score + away_score AS total_goals,
        match_date,
        fetched_at
    FROM source
    WHERE status = 'FINISHED'
)

SELECT * FROM renamed

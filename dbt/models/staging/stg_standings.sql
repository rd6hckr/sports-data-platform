WITH source AS (
    SELECT * FROM raw.standings
),

renamed AS (
    SELECT
        id,
        competition_code,
        season,
        position,
        team_id,
        team_name,
        played_games,
        won,
        draw,
        lost,
        points,
        goals_for,
        goals_against,
        goal_difference,
        fetched_at
    FROM source
)

SELECT * FROM renamed

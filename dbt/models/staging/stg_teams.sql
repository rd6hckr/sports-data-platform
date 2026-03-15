WITH source AS (
    SELECT * FROM raw.teams
),

renamed AS (
    SELECT
        id AS team_id,
        name AS team_name,
        short_name,
        tla,
        competition_code,
        founded,
        venue,
        fetched_at
    FROM source
)

SELECT * FROM renamed

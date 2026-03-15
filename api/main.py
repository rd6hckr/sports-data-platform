from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
import psycopg2
import psycopg2.extras
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Sports Data Platform API", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST"),
    "port": os.getenv("POSTGRES_PORT"),
}


def query(sql, params=None):
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
    cur.execute(sql, params)
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [dict(r) for r in rows]


@app.get("/health")
def health():
    return {"status": "ok"}


@app.get("/competitions")
def get_competitions():
    return query("""
        SELECT DISTINCT competition_code, season
        FROM public_marts.mart_standings
        ORDER BY competition_code, season DESC
    """)


@app.get("/standings")
def get_standings(
    competition: str = Query("PL"),
    season: str = Query(None)
):
    sql = """
        SELECT * FROM public_marts.mart_standings
        WHERE competition_code = %s
    """
    params = [competition]
    if season:
        sql += " AND season = %s"
        params.append(season)
    sql += " ORDER BY position"
    return query(sql, params)


@app.get("/matches")
def get_matches(
    competition: str = Query("PL"),
    season: str = Query(None),
    limit: int = Query(20)
):
    sql = """
        SELECT * FROM public_marts.mart_matches
        WHERE competition_code = %s
    """
    params = [competition]
    if season:
        sql += " AND season = %s"
        params.append(season)
    sql += " ORDER BY match_date DESC LIMIT %s"
    params.append(limit)
    return query(sql, params)


@app.get("/competition-stats")
def get_competition_stats(
    competition: str = Query("PL")
):
    return query("""
        SELECT * FROM public_marts.mart_competition_stats
        WHERE competition_code = %s
        ORDER BY season DESC
    """, [competition])


@app.get("/top-teams")
def get_top_teams(
    competition: str = Query("PL"),
    season: str = Query(None),
    limit: int = Query(10)
):
    sql = """
        SELECT
            team_name,
            points,
            played_games,
            won,
            draw,
            lost,
            goals_for,
            goals_against,
            goal_difference,
            win_percentage,
            avg_goals_per_game
        FROM public_marts.mart_standings
        WHERE competition_code = %s
    """
    params = [competition]
    if season:
        sql += " AND season = %s"
        params.append(season)
    sql += " ORDER BY position LIMIT %s"
    params.append(limit)
    return query(sql, params)
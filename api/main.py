from fastapi import FastAPI, Query, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from psycopg2 import pool
import psycopg2.extras
import os
from dotenv import load_dotenv
from typing import Optional
import logging

load_dotenv()

logger = logging.getLogger(__name__)

DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST"),
    "port": os.getenv("POSTGRES_PORT"),
}

connection_pool = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    global connection_pool
    connection_pool = pool.ThreadedConnectionPool(
        minconn=2,
        maxconn=10,
        **DB_CONFIG
    )
    logger.info("Connection pool created.")
    yield
    connection_pool.closeall()
    logger.info("Connection pool closed.")


app = FastAPI(
    title="Sports Data Platform API",
    version="1.0.0",
    description="ELT pipeline API for European football analytics",
    lifespan=lifespan
)

ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "http://localhost:3000").split(",")

app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=True,
    allow_methods=["GET"],
    allow_headers=["*"],
)

VALID_COMPETITIONS = {"PL", "PD", "BL1", "SA", "CL"}


def query(sql: str, params=None) -> list:
    conn = connection_pool.getconn()
    try:
        cur = conn.cursor(cursor_factory=psycopg2.extras.RealDictCursor)
        cur.execute(sql, params)
        rows = cur.fetchall()
        cur.close()
        return [dict(r) for r in rows]
    except Exception as e:
        logger.error(f"Database error: {e}")
        raise HTTPException(status_code=500, detail="Database query failed")
    finally:
        connection_pool.putconn(conn)


def validate_competition(competition: str) -> str:
    if competition not in VALID_COMPETITIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid competition. Valid values: {', '.join(VALID_COMPETITIONS)}"
        )
    return competition


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
    season: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    validate_competition(competition)
    sql = """
        SELECT * FROM public_marts.mart_standings
        WHERE competition_code = %s
    """
    params = [competition]
    if season:
        sql += " AND season = %s"
        params.append(season)
    sql += " ORDER BY position LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    return query(sql, params)


@app.get("/matches")
def get_matches(
    competition: str = Query("PL"),
    season: Optional[str] = Query(None),
    limit: int = Query(20, ge=1, le=100),
    offset: int = Query(0, ge=0),
):
    validate_competition(competition)
    sql = """
        SELECT * FROM public_marts.mart_matches
        WHERE competition_code = %s
    """
    params = [competition]
    if season:
        sql += " AND season = %s"
        params.append(season)
    sql += " ORDER BY match_date DESC LIMIT %s OFFSET %s"
    params.extend([limit, offset])
    return query(sql, params)


@app.get("/competition-stats")
def get_competition_stats(
    competition: str = Query("PL")
):
    validate_competition(competition)
    return query("""
        SELECT * FROM public_marts.mart_competition_stats
        WHERE competition_code = %s
        ORDER BY season DESC
    """, [competition])


@app.get("/top-teams")
def get_top_teams(
    competition: str = Query("PL"),
    season: Optional[str] = Query(None),
    limit: int = Query(10, ge=1, le=20),
):
    validate_competition(competition)
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
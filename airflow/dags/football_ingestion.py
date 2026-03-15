from airflow import DAG
from airflow.operators.python import PythonOperator
from datetime import datetime, timedelta
import requests
import psycopg2
from psycopg2.extras import execute_values
import os

default_args = {
    "owner": "rd6",
    "retries": 3,
    "retry_delay": timedelta(minutes=5),
    "email_on_failure": False,
}

FOOTBALL_API_URL = os.getenv("FOOTBALL_API_URL")
FOOTBALL_API_KEY = os.getenv("FOOTBALL_API_KEY")

DB_CONFIG = {
    "dbname": os.getenv("POSTGRES_DB"),
    "user": os.getenv("POSTGRES_USER"),
    "password": os.getenv("POSTGRES_PASSWORD"),
    "host": os.getenv("POSTGRES_HOST"),
    "port": os.getenv("POSTGRES_PORT"),
}

COMPETITIONS = {
    "PL": "Premier League",
    "PD": "La Liga",
    "BL1": "Bundesliga",
    "SA": "Serie A",
    "CL": "Champions League",
}

def get_connection():
    return psycopg2.connect(**DB_CONFIG)


def create_raw_tables():
    conn = get_connection()
    cur = conn.cursor()
    cur.execute("""
        CREATE SCHEMA IF NOT EXISTS raw;

        CREATE TABLE IF NOT EXISTS raw.competitions (
            id INTEGER PRIMARY KEY,
            code VARCHAR(10),
            name VARCHAR(100),
            area VARCHAR(100),
            fetched_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS raw.teams (
            id INTEGER PRIMARY KEY,
            name VARCHAR(100),
            short_name VARCHAR(50),
            tla VARCHAR(10),
            competition_code VARCHAR(10),
            founded INTEGER,
            venue VARCHAR(100),
            fetched_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS raw.standings (
            id SERIAL PRIMARY KEY,
            competition_code VARCHAR(10),
            season VARCHAR(20),
            position INTEGER,
            team_id INTEGER,
            team_name VARCHAR(100),
            played_games INTEGER,
            won INTEGER,
            draw INTEGER,
            lost INTEGER,
            points INTEGER,
            goals_for INTEGER,
            goals_against INTEGER,
            goal_difference INTEGER,
            fetched_at TIMESTAMP DEFAULT NOW()
        );

        CREATE TABLE IF NOT EXISTS raw.matches (
            id INTEGER PRIMARY KEY,
            competition_code VARCHAR(10),
            season VARCHAR(20),
            matchday INTEGER,
            status VARCHAR(20),
            home_team_id INTEGER,
            home_team_name VARCHAR(100),
            away_team_id INTEGER,
            away_team_name VARCHAR(100),
            home_score INTEGER,
            away_score INTEGER,
            match_date TIMESTAMP,
            fetched_at TIMESTAMP DEFAULT NOW()
        );
    """)
    conn.commit()
    cur.close()
    conn.close()
    print("Raw tables created.")


def fetch_standings(**context):
    headers = {"X-Auth-Token": FOOTBALL_API_KEY}
    conn = get_connection()
    cur = conn.cursor()

    for code, name in COMPETITIONS.items():
        try:
            url = f"{FOOTBALL_API_URL}/competitions/{code}/standings"
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            season = data["season"]["startDate"][:4]
            rows = []
            for table in data["standings"]:
                if table["type"] == "TOTAL":
                    for entry in table["table"]:
                        rows.append((
                            code,
                            season,
                            entry["position"],
                            entry["team"]["id"],
                            entry["team"]["name"],
                            entry["playedGames"],
                            entry["won"],
                            entry["draw"],
                            entry["lost"],
                            entry["points"],
                            entry["goalsFor"],
                            entry["goalsAgainst"],
                            entry["goalDifference"],
                        ))

            cur.execute("""
                DELETE FROM raw.standings
                WHERE competition_code = %s AND season = %s
            """, (code, season))

            execute_values(cur, """
                INSERT INTO raw.standings (
                    competition_code, season, position, team_id, team_name,
                    played_games, won, draw, lost, points,
                    goals_for, goals_against, goal_difference
                ) VALUES %s
            """, rows)

            conn.commit()
            print(f"Standings fetched for {name}")

        except Exception as e:
            print(f"Error fetching {name}: {e}")
            continue

    cur.close()
    conn.close()


def fetch_matches(**context):
    headers = {"X-Auth-Token": FOOTBALL_API_KEY}
    conn = get_connection()
    cur = conn.cursor()

    for code in COMPETITIONS.keys():
        try:
            url = f"{FOOTBALL_API_URL}/competitions/{code}/matches"
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            data = response.json()

            rows = []
            for match in data["matches"]:
                home_score = None
                away_score = None
                if match["score"]["fullTime"]["home"] is not None:
                    home_score = match["score"]["fullTime"]["home"]
                    away_score = match["score"]["fullTime"]["away"]

                rows.append((
                    match["id"],
                    code,
                    str(match["season"]["startDate"][:4]),
                    match.get("matchday"),
                    match["status"],
                    match["homeTeam"]["id"],
                    match["homeTeam"]["name"],
                    match["awayTeam"]["id"],
                    match["awayTeam"]["name"],
                    home_score,
                    away_score,
                    match["utcDate"],
                ))

            execute_values(cur, """
                INSERT INTO raw.matches (
                    id, competition_code, season, matchday, status,
                    home_team_id, home_team_name,
                    away_team_id, away_team_name,
                    home_score, away_score, match_date
                ) VALUES %s
                ON CONFLICT (id) DO UPDATE SET
                    status = EXCLUDED.status,
                    home_score = EXCLUDED.home_score,
                    away_score = EXCLUDED.away_score,
                    fetched_at = NOW()
            """, rows)

            conn.commit()
            print(f"Matches fetched for {code}")

        except Exception as e:
            print(f"Error fetching matches for {code}: {e}")
            continue

    cur.close()
    conn.close()


with DAG(
    dag_id="football_ingestion",
    default_args=default_args,
    description="Ingest football data from football-data.org",
    schedule_interval="0 */6 * * *",
    start_date=datetime(2026, 1, 1),
    catchup=False,
    tags=["football", "ingestion"],
) as dag:

    create_tables = PythonOperator(
        task_id="create_raw_tables",
        python_callable=create_raw_tables,
    )

    standings = PythonOperator(
        task_id="fetch_standings",
        python_callable=fetch_standings,
    )

    matches = PythonOperator(
        task_id="fetch_matches",
        python_callable=fetch_matches,
    )

    create_tables >> [standings, matches]
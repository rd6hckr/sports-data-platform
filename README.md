# Sports Data Platform

A production-grade ELT data platform for European football analytics, built with modern data engineering tools.


## Architecture
```
football-data.org API
        ↓
Airflow (orchestration — every 6h)
        ↓
PostgreSQL (raw schema)
        ↓
dbt (staging → intermediate → marts)
        ↓
FastAPI (REST API)
        ↓
React + TypeScript (dashboard)
        ↓
Docker Compose (fully containerized)
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Orchestration | Apache Airflow 2.9 |
| Transformation | dbt 1.7 |
| Storage | PostgreSQL 16 |
| API | FastAPI + Uvicorn |
| Frontend | React 18 + TypeScript |
| Containerization | Docker + Docker Compose |
| Testing | dbt tests + pytest |

## Features

- **ELT Pipeline** — raw data ingested and loaded first, transformed in-database via dbt
- **Multi-league** — Premier League, La Liga, Bundesliga, Serie A, Champions League
- **Automated ingestion** — Airflow DAG runs every 6 hours
- **Data quality** — 16 dbt tests across staging and mart layers
- **Interactive dashboard** — standings, match results, competition statistics
- **Production patterns** — connection pooling, error handling, health checks

## Getting Started

### Prerequisites

- Docker
- Docker Compose
- football-data.org API key (free at [football-data.org](https://www.football-data.org/client/register))

### Run the project
```bash
git clone https://github.com/rd6hckr/sports-data-platform.git
cd sports-data-platform
cp .env.example .env
# Add your FOOTBALL_API_KEY to .env
docker compose up --build
```

### Run dbt transformations
```bash
docker compose run dbt
```

### Run dbt tests
```bash
docker run --rm \
  --network sports-data-platform_default \
  -v $(pwd)/dbt:/usr/app/dbt \
  -w /usr/app/dbt \
  ghcr.io/dbt-labs/dbt-postgres:1.7.17 \
  test --profiles-dir /usr/app/dbt --project-dir /usr/app/dbt
```

## Services

| Service | URL |
|---------|-----|
| Dashboard | http://localhost:3000 |
| API | http://localhost:8000 |
| API Docs | http://localhost:8000/docs |
| Airflow | http://localhost:8080 |


## Testing

- **dbt tests** — 16 tests covering not_null, unique, accepted_values across all layers
- **API tests** — pytest suite with mocked database layer

## License

MIT

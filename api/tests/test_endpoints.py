import pytest
from fastapi.testclient import TestClient
from unittest.mock import patch, MagicMock
import sys
import os

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from main import app

client = TestClient(app)


def mock_query(sql, params=None):
    if "mart_standings" in sql:
        return [{
            "competition_code": "PL",
            "season": "2024",
            "position": 1,
            "team_id": 1,
            "team_name": "Arsenal FC",
            "points": 70,
            "played_games": 31,
            "won": 21,
            "draw": 7,
            "lost": 3,
            "goals_for": 61,
            "goals_against": 25,
            "goal_difference": 36,
            "home_games": 15,
            "home_goals_scored": 30,
            "home_wins": 11,
            "away_games": 16,
            "away_goals_scored": 31,
            "away_wins": 10,
            "avg_goals_per_game": 1.97,
            "win_percentage": 67.7,
            "points_percentage": 75.3,
        }]
    if "mart_matches" in sql:
        return [{
            "match_id": 1,
            "competition_code": "PL",
            "season": "2024",
            "matchday": 1,
            "home_team_name": "Arsenal FC",
            "away_team_name": "Chelsea FC",
            "home_score": 2,
            "away_score": 1,
            "winner": "Arsenal FC",
            "total_goals": 3,
            "match_date": "2024-08-17T14:00:00",
        }]
    if "mart_competition_stats" in sql:
        return [{
            "competition_code": "PL",
            "season": "2024",
            "total_matches": 299,
            "total_goals": 818,
            "avg_goals_per_match": 2.76,
            "total_draws": 79,
            "highest_scoring_match": 9,
            "total_goalless_matches": 22,
            "draw_percentage": 26.4,
        }]
    return []


def test_health():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


@patch("main.query", side_effect=mock_query)
def test_get_standings(mock_q):
    response = client.get("/standings?competition=PL")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["team_name"] == "Arsenal FC"
    assert data[0]["points"] == 70


@patch("main.query", side_effect=mock_query)
def test_get_matches(mock_q):
    response = client.get("/matches?competition=PL")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["home_team_name"] == "Arsenal FC"


@patch("main.query", side_effect=mock_query)
def test_get_competition_stats(mock_q):
    response = client.get("/competition-stats?competition=PL")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["total_goals"] == 818


@patch("main.query", side_effect=mock_query)
def test_get_top_teams(mock_q):
    response = client.get("/top-teams?competition=PL")
    assert response.status_code == 200
    data = response.json()
    assert len(data) > 0
    assert data[0]["win_percentage"] == 67.7


@patch("main.query", side_effect=mock_query)
def test_standings_default_competition(mock_q):
    response = client.get("/standings")
    assert response.status_code == 200


@patch("main.query", side_effect=mock_query)
def test_matches_with_limit(mock_q):
    response = client.get("/matches?competition=PL&limit=5")
    assert response.status_code == 200
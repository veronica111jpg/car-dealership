"""Tests for user registration and login."""


def test_register_creates_user(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "alice@example.com", "password": "secret123"},
    )

    assert response.status_code == 201
    body = response.json()
    assert body["email"] == "alice@example.com"
    assert body["role"] == "user"
    # Never leak password data back to the client.
    assert "password" not in body
    assert "hashed_password" not in body
def test_register_rejects_duplicate_email(client):
    payload = {"email": "alice@example.com", "password": "secret123"}
    client.post("/api/auth/register", json=payload)

    response = client.post("/api/auth/register", json=payload)

    assert response.status_code == 409


def test_register_rejects_short_password(client):
    response = client.post(
        "/api/auth/register",
        json={"email": "bob@example.com", "password": "123"},
    )

    assert response.status_code == 422


def test_login_returns_token_for_valid_credentials(client):
    client.post(
        "/api/auth/register",
        json={"email": "alice@example.com", "password": "secret123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "alice@example.com", "password": "secret123"},
    )

    assert response.status_code == 200
    body = response.json()
    assert body["token_type"] == "bearer"
    assert body["access_token"]


def test_login_rejects_wrong_password(client):
    client.post(
        "/api/auth/register",
        json={"email": "alice@example.com", "password": "secret123"},
    )

    response = client.post(
        "/api/auth/login",
        json={"email": "alice@example.com", "password": "wrong-password"},
    )

    assert response.status_code == 401


def test_login_rejects_unknown_email(client):
    response = client.post(
        "/api/auth/login",
        json={"email": "nobody@example.com", "password": "secret123"},
    )

    assert response.status_code == 401
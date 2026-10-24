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
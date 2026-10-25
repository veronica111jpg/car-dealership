"""Edge cases that close coverage gaps: bad tokens, unknown ids, model search."""
from app.security import create_access_token

VEHICLE = {
    "make": "Toyota",
    "model": "Corolla",
    "category": "Sedan",
    "price": 20000,
    "quantity": 5,
}


def test_invalid_token_is_rejected(client):
    response = client.get(
        "/api/vehicles", headers={"Authorization": "Bearer not-a-real-token"}
    )

    assert response.status_code == 401


def test_token_for_nonexistent_user_is_rejected(client):
    # A correctly signed token, but user id 9999 does not exist.
    token = create_access_token(9999, "user")

    response = client.get(
        "/api/vehicles", headers={"Authorization": f"Bearer {token}"}
    )

    assert response.status_code == 401


def test_search_by_model(client, user_headers):
    client.post("/api/vehicles", json=VEHICLE, headers=user_headers)
    client.post("/api/vehicles", json={**VEHICLE, "model": "Camry"}, headers=user_headers)

    response = client.get("/api/vehicles/search?model=camry", headers=user_headers)

    assert [v["model"] for v in response.json()] == ["Camry"]


def test_restock_unknown_vehicle_returns_404(client, admin_headers):
    response = client.post(
        "/api/vehicles/999/restock", json={"quantity": 5}, headers=admin_headers
    )

    assert response.status_code == 404
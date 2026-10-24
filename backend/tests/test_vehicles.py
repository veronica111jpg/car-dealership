"""Tests for vehicle endpoints."""

VEHICLE = {
    "make": "Toyota",
    "model": "Corolla",
    "category": "Sedan",
    "price": 20000,
    "quantity": 5,
}


def test_create_vehicle_requires_authentication(client):
    response = client.post("/api/vehicles", json=VEHICLE)

    assert response.status_code == 401


def test_create_vehicle_success(client, user_headers):
    response = client.post("/api/vehicles", json=VEHICLE, headers=user_headers)

    assert response.status_code == 201
    body = response.json()
    assert body["id"] is not None
    assert body["make"] == "Toyota"
    assert body["quantity"] == 5


def test_create_vehicle_rejects_negative_price(client, user_headers):
    bad = {**VEHICLE, "price": -1}

    response = client.post("/api/vehicles", json=bad, headers=user_headers)

    assert response.status_code == 422


def test_list_vehicles_returns_created_vehicles(client, user_headers):
    client.post("/api/vehicles", json=VEHICLE, headers=user_headers)

    response = client.get("/api/vehicles", headers=user_headers)

    assert response.status_code == 200
    assert len(response.json()) == 1
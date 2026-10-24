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
# ---------- helpers ----------

def _create(client, headers, **overrides):
    """Create a vehicle through the API and return its JSON."""
    response = client.post("/api/vehicles", json={**VEHICLE, **overrides}, headers=headers)
    return response.json()


# ---------- update ----------

def test_update_vehicle_changes_fields(client, user_headers):
    vehicle = _create(client, user_headers)

    response = client.put(
        f"/api/vehicles/{vehicle['id']}",
        json={**VEHICLE, "price": 25000},
        headers=user_headers,
    )

    assert response.status_code == 200
    assert response.json()["price"] == 25000


def test_update_unknown_vehicle_returns_404(client, user_headers):
    response = client.put("/api/vehicles/999", json=VEHICLE, headers=user_headers)

    assert response.status_code == 404


# ---------- delete (admin only) ----------

def test_delete_vehicle_forbidden_for_regular_user(client, user_headers):
    vehicle = _create(client, user_headers)

    response = client.delete(f"/api/vehicles/{vehicle['id']}", headers=user_headers)

    assert response.status_code == 403


def test_delete_vehicle_as_admin(client, user_headers, admin_headers):
    vehicle = _create(client, user_headers)

    response = client.delete(f"/api/vehicles/{vehicle['id']}", headers=admin_headers)

    assert response.status_code == 204
    assert client.get("/api/vehicles", headers=admin_headers).json() == []


def test_delete_unknown_vehicle_returns_404(client, admin_headers):
    response = client.delete("/api/vehicles/999", headers=admin_headers)

    assert response.status_code == 404


# ---------- search ----------

def test_search_by_make(client, user_headers):
    _create(client, user_headers, make="Toyota", model="Corolla")
    _create(client, user_headers, make="Honda", model="Civic")

    response = client.get("/api/vehicles/search?make=honda", headers=user_headers)

    assert response.status_code == 200
    results = response.json()
    assert len(results) == 1
    assert results[0]["make"] == "Honda"


def test_search_by_category(client, user_headers):
    _create(client, user_headers, category="Sedan")
    _create(client, user_headers, model="RAV4", category="SUV")

    response = client.get("/api/vehicles/search?category=SUV", headers=user_headers)

    assert [v["model"] for v in response.json()] == ["RAV4"]


def test_search_by_price_range(client, user_headers):
    _create(client, user_headers, model="Cheap", price=10000)
    _create(client, user_headers, model="Mid", price=20000)
    _create(client, user_headers, model="Pricey", price=50000)

    response = client.get(
        "/api/vehicles/search?min_price=15000&max_price=30000", headers=user_headers
    )

    assert [v["model"] for v in response.json()] == ["Mid"]


def test_search_with_no_filters_returns_everything(client, user_headers):
    _create(client, user_headers)
    _create(client, user_headers, model="Camry")

    response = client.get("/api/vehicles/search", headers=user_headers)

    assert len(response.json()) == 2


# ---------- purchase ----------

def test_purchase_decreases_quantity(client, user_headers):
    vehicle = _create(client, user_headers, quantity=3)

    response = client.post(f"/api/vehicles/{vehicle['id']}/purchase", headers=user_headers)

    assert response.status_code == 200
    assert response.json()["quantity"] == 2


def test_purchase_out_of_stock_is_rejected(client, user_headers):
    vehicle = _create(client, user_headers, quantity=0)

    response = client.post(f"/api/vehicles/{vehicle['id']}/purchase", headers=user_headers)

    assert response.status_code == 409


def test_purchase_unknown_vehicle_returns_404(client, user_headers):
    response = client.post("/api/vehicles/999/purchase", headers=user_headers)

    assert response.status_code == 404


# ---------- restock (admin only) ----------

def test_restock_increases_quantity(client, user_headers, admin_headers):
    vehicle = _create(client, user_headers, quantity=1)

    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        json={"quantity": 10},
        headers=admin_headers,
    )

    assert response.status_code == 200
    assert response.json()["quantity"] == 11


def test_restock_forbidden_for_regular_user(client, user_headers):
    vehicle = _create(client, user_headers)

    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        json={"quantity": 10},
        headers=user_headers,
    )

    assert response.status_code == 403


def test_restock_rejects_non_positive_amount(client, user_headers, admin_headers):
    vehicle = _create(client, user_headers)

    response = client.post(
        f"/api/vehicles/{vehicle['id']}/restock",
        json={"quantity": 0},
        headers=admin_headers,
    )

    assert response.status_code == 422
from fastapi.testclient import TestClient
from backend.main import app

client = TestClient(app)


def test_create_plant():
    payload = {
        "name": "Aloe Vera",
        "species": "Aloe",
        "ideal_moisture_min": 20,
        "ideal_moisture_max": 50
    }

    response = client.post("/plants", json=payload)

    assert response.status_code == 200 or response.status_code == 201
    data = response.json()

    assert data["name"] == "Aloe Vera"
    assert data["species"] == "Aloe"
    assert data["ideal_moisture_min"] == 20
    assert data["ideal_moisture_max"] == 50
    assert "id" in data

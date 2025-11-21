from backend.status_logic import compute_status


def test_no_data():
    result = compute_status(30, 60, None)
    assert result == "no_data"


def test_needs_water():
    result = compute_status(30, 60, 20)
    assert result == "needs_water"


def test_overwatered():
    result = compute_status(30, 60, 80)
    assert result == "overwatered"


def test_ok_status():
    result = compute_status(30, 60, 45)
    assert result == "ok"

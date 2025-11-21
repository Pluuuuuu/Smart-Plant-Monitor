# Computes the plant status based on the latest moisture reading

def compute_status(ideal_min: int, ideal_max: int, latest_reading: float | None):
    # No readings recorded yet
    if latest_reading is None:
        return "no_data"

    # Moisture is below ideal range
    if latest_reading < ideal_min:
        return "needs_water"

    # Moisture is above ideal range
    if latest_reading > ideal_max:
        return "overwatered"

    # Moisture is within the ideal range
    return "ok"

def get_zones() -> list[dict]:
    """Return mock crowd zones."""
    return [
        {
            "name": "North Gate",
            "density": "High",
            "queue_time": 15,
            "trend": "increasing",
        },
        {"name": "South Gate", "density": "Low", "queue_time": 2, "trend": "stable"},
        {
            "name": "Food Court A",
            "density": "Medium",
            "queue_time": 8,
            "trend": "decreasing",
        },
        {
            "name": "Medical Tent 1",
            "density": "Low",
            "queue_time": 0,
            "trend": "stable",
        },
    ]

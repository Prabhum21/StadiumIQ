"""Tests for the crowd_service module."""

from services.crowd_service import get_zones


class TestGetZones:
    """Tests for the get_zones function."""

    def test_returns_list(self):
        """get_zones should return a list."""
        zones = get_zones()
        assert isinstance(zones, list)

    def test_returns_four_zones(self):
        """The mock data should contain exactly 4 zones."""
        zones = get_zones()
        assert len(zones) == 4

    def test_zone_structure(self):
        """Each zone should have name, density, queue_time, and trend keys."""
        zones = get_zones()
        required_keys = {"name", "density", "queue_time", "trend"}
        for zone in zones:
            assert required_keys.issubset(zone.keys()), f"Zone missing keys: {zone}"

    def test_zone_names(self):
        """Verify the expected zone names are present."""
        zones = get_zones()
        names = {z["name"] for z in zones}
        assert "North Gate" in names
        assert "South Gate" in names
        assert "Food Court A" in names
        assert "Medical Tent 1" in names

    def test_density_values(self):
        """Density should be one of the valid enum values."""
        valid_densities = {"Low", "Medium", "High"}
        zones = get_zones()
        for zone in zones:
            assert zone["density"] in valid_densities, f"Invalid density: {zone['density']}"

    def test_trend_values(self):
        """Trend should be one of the valid enum values."""
        valid_trends = {"increasing", "decreasing", "stable"}
        zones = get_zones()
        for zone in zones:
            assert zone["trend"] in valid_trends, f"Invalid trend: {zone['trend']}"

    def test_queue_time_non_negative(self):
        """Queue times should never be negative."""
        zones = get_zones()
        for zone in zones:
            assert zone["queue_time"] >= 0, f"Negative queue time: {zone}"

    def test_deterministic(self):
        """Calling get_zones twice should return identical results."""
        assert get_zones() == get_zones()

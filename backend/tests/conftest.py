"""Shared test fixtures for StadiumIQ backend tests."""

import pytest
from fastapi.testclient import TestClient
from httpx import ASGITransport, AsyncClient

from main import app


@pytest.fixture
def client():
    """Synchronous test client for the FastAPI application."""
    return TestClient(app, raise_server_exceptions=False)


@pytest.fixture
async def async_client():
    """Asynchronous test client for the FastAPI application."""
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac

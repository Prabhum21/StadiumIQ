"""
Unit tests for StadiumIQ custom exception hierarchy.
"""

from utils.exceptions import (
    StadiumIQException,
    GeminiAPIException,
    ValidationException,
    RateLimitExceededException,
    UnauthorizedException,
    NotFoundException,
)


def test_exception_attributes():
    exc = StadiumIQException("Custom message", "TEST_CODE", 400)
    assert exc.message == "Custom message"
    assert exc.error_code == "TEST_CODE"
    assert exc.status_code == 400


def test_gemini_api_exception():
    exc = GeminiAPIException("Gemini error")
    assert exc.status_code == 502
    assert exc.error_code == "AI_ENGINE_ERROR"


def test_validation_exception():
    exc = ValidationException("Invalid fields")
    assert exc.status_code == 422
    assert exc.error_code == "VALIDATION_ERROR"


def test_rate_limit_exceeded_exception():
    exc = RateLimitExceededException()
    assert exc.status_code == 429
    assert exc.error_code == "RATE_LIMIT_EXCEEDED"


def test_unauthorized_exception():
    exc = UnauthorizedException()
    assert exc.status_code == 401
    assert exc.error_code == "UNAUTHORIZED"


def test_not_found_exception():
    exc = NotFoundException()
    assert exc.status_code == 404
    assert exc.error_code == "NOT_FOUND"

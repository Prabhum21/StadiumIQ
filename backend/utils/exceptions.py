"""
Custom exception hierarchy for StadiumIQ.
Provides standardized exceptions with error codes and HTTP status codes.
"""


class StadiumIQException(Exception):
    """
    Base exception class for all custom application errors.
    """

    def __init__(
        self, message: str, error_code: str = "INTERNAL_ERROR", status_code: int = 500
    ) -> None:
        super().__init__(message)
        self.message = message
        self.error_code = error_code
        self.status_code = status_code


class GeminiAPIException(StadiumIQException):
    """
    Raised when the Google Gemini API fails or returns invalid responses.
    """

    def __init__(self, message: str, error_code: str = "AI_ENGINE_ERROR") -> None:
        super().__init__(message, error_code=error_code, status_code=502)


class ValidationException(StadiumIQException):
    """
    Raised when request payload or data validation fails.
    """

    def __init__(self, message: str, error_code: str = "VALIDATION_ERROR") -> None:
        super().__init__(message, error_code=error_code, status_code=422)


class RateLimitExceededException(StadiumIQException):
    """
    Raised when client exceeds rate limit thresholds.
    """

    def __init__(self, message: str = "Rate limit exceeded. Please slow down.") -> None:
        super().__init__(message, error_code="RATE_LIMIT_EXCEEDED", status_code=429)


class UnauthorizedException(StadiumIQException):
    """
    Raised when authentication fails or is missing.
    """

    def __init__(
        self, message: str = "Authentication credentials not provided or invalid."
    ) -> None:
        super().__init__(message, error_code="UNAUTHORIZED", status_code=401)


class NotFoundException(StadiumIQException):
    """
    Raised when a requested resource or route is missing.
    """

    def __init__(self, message: str = "The requested resource was not found.") -> None:
        super().__init__(message, error_code="NOT_FOUND", status_code=404)

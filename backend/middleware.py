"""
Security middleware for StadiumIQ backend.

Enforces HTTP security headers and request body size limits
to protect against common web vulnerabilities.
"""

import logging
import time
import uuid

from fastapi import Request
from fastapi.responses import JSONResponse
from starlette.middleware.base import BaseHTTPMiddleware

from utils.metrics import metrics_collector

logger = logging.getLogger("middleware.telemetry")


class TelemetryMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        request_id = str(uuid.uuid4())
        # Store in request state for downstream handlers
        request.state.request_id = request_id

        start_time = time.time()
        is_error = False
        try:
            response = await call_next(request)
            if response.status_code >= 400:
                is_error = True
            response.headers["X-Request-ID"] = request_id
            return response
        except Exception as exc:
            is_error = True
            # Log exception details with request ID
            logger.error(
                f"Unhandled exception during request processing: {exc}",
                extra={
                    "request_id": request_id,
                    "request_path": request.url.path,
                    "error_details": str(exc),
                },
            )
            raise
        finally:
            duration = time.time() - start_time
            duration_ms = duration * 1000

            # Record endpoint statistics
            metrics_collector.record_request(
                endpoint=request.url.path, duration=duration, is_error=is_error
            )

            # Log request telemetry in JSON format
            logger.info(
                f"HTTP {request.method} {request.url.path} processed in {duration_ms:.2f}ms",
                extra={
                    "request_id": request_id,
                    "request_path": request.url.path,
                    "latency_ms": duration_ms,
                    "severity": "INFO" if not is_error else "ERROR",
                },
            )


class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Limit request body size to 1MB
        content_length = request.headers.get("content-length")
        if content_length and int(content_length) > 1024 * 1024:
            return JSONResponse({"detail": "Payload too large"}, status_code=413)

        response = await call_next(request)
        response.headers["X-Content-Type-Options"] = "nosniff"
        response.headers["X-Frame-Options"] = "DENY"
        response.headers["X-XSS-Protection"] = "1; mode=block"
        response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains"
        response.headers["Content-Security-Policy"] = "default-src 'self'"
        response.headers["Referrer-Policy"] = "no-referrer"
        return response

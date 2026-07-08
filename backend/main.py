import os

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from starlette.middleware.base import BaseHTTPMiddleware

from api import routes
from api.limiter import limiter

load_dotenv()

app = FastAPI(
    title="StadiumIQ AI API",
    description="Backend API for the FIFA World Cup 2026 Smart Stadium Challenge",
    version="1.0.0",
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv("CORS_ORIGINS", "http://localhost:3000").split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

app.add_middleware(GZipMiddleware, minimum_size=500)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)


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


app.add_middleware(SecurityHeadersMiddleware)


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler that returns structured JSON.
    """
    return JSONResponse(
        status_code=500,
        content={"error_code": "INTERNAL_ERROR", "message": "An unexpected error occurred."},
    )


app.include_router(routes.router, prefix="/api")


@app.get("/", response_model=dict[str, str])
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "StadiumIQ AI Backend is running"}

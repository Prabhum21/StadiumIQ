import os
from contextlib import asynccontextmanager

from dotenv import load_dotenv
from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse
from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded

from api import routes
from api.limiter import limiter
from middleware import SecurityHeadersMiddleware, TelemetryMiddleware

from utils.logging import setup_logging

load_dotenv()
setup_logging()


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifecycle event to enforce production-readiness checks on startup."""
    if not os.getenv("PYTEST_CURRENT_TEST") and not os.getenv("GEMINI_API_KEY"):
        raise RuntimeError(
            "CRITICAL ERROR: GEMINI_API_KEY is not set in the environment. Halting startup."
        )
    yield


app = FastAPI(
    title="StadiumIQ AI API",
    description="Backend API for the FIFA World Cup 2026 Smart Stadium Challenge",
    version="1.0.0",
    lifespan=lifespan,
)

# Enable CORS for Next.js frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=os.getenv(
        "CORS_ORIGINS", "http://localhost:3000,https://stadium-iq-six.vercel.app"
    ).split(","),
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=["Content-Type", "Authorization", "Accept"],
)

app.add_middleware(GZipMiddleware, minimum_size=500)

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(TelemetryMiddleware)
app.add_middleware(SecurityHeadersMiddleware)


from utils.exceptions import StadiumIQException


@app.exception_handler(StadiumIQException)
async def stadium_iq_exception_handler(request: Request, exc: StadiumIQException) -> JSONResponse:
    """
    Exception handler for all custom StadiumIQ exceptions.
    """
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "error_code": exc.error_code,
            "message": exc.message,
        },
    )


@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception) -> JSONResponse:
    """
    Global exception handler that returns structured JSON.
    """
    # Log unhandled exceptions
    import logging

    logging.getLogger("main.error").error(f"Global exception caught: {exc}", exc_info=True)
    return JSONResponse(
        status_code=500,
        content={
            "error_code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred.",
        },
    )


app.include_router(routes.router, prefix="/api")


@app.get("/", response_model=dict[str, str])
def read_root() -> dict[str, str]:
    return {"status": "ok", "message": "StadiumIQ AI Backend is running"}

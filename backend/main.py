from typing import Dict
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from api import routes
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(
    title="StadiumIQ AI API",
    description="Backend API for the FIFA World Cup 2026 Smart Stadium Challenge",
    version="1.0.0"
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

from slowapi import _rate_limit_exceeded_handler
from slowapi.errors import RateLimitExceeded
from api.limiter import limiter

app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

from fastapi import Request
from starlette.middleware.base import BaseHTTPMiddleware
from fastapi.responses import JSONResponse

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    async def dispatch(self, request: Request, call_next):
        # Limit request body size to 1MB
        content_length = request.headers.get('content-length')
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

app.include_router(routes.router, prefix="/api")

@app.get("/", response_model=Dict[str, str])
def read_root() -> Dict[str, str]:
    return {"status": "ok", "message": "StadiumIQ AI Backend is running"}

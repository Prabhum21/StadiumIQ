"""
Structured JSON logging utility for StadiumIQ.
Provides standardized logging formats across all backend modules.
"""

import json
import logging
from typing import Any


class JsonFormatter(logging.Formatter):
    """
    Formatter that outputs logs as single-line JSON objects.
    """

    def format(self, record: logging.LogRecord) -> str:
        log_data: dict[str, Any] = {
            "timestamp": self.formatTime(record, self.datefmt),
            "severity": record.levelname,
            "component": record.name,
            "message": record.getMessage(),
        }

        # Inject request details from record if available
        for key in ["request_id", "latency_ms", "request_path", "error_details"]:
            if hasattr(record, key):
                log_data[key] = getattr(record, key)

        if record.exc_info:
            log_data["error_details"] = self.formatException(record.exc_info)

        return json.dumps(log_data)


def setup_logging() -> None:
    """
    Configures the root logger to output structured JSON.
    """
    root_logger = logging.getLogger()

    # Remove existing handlers to prevent double logging
    for handler in list(root_logger.handlers):
        root_logger.removeHandler(handler)

    handler = logging.StreamHandler()
    formatter = JsonFormatter(datefmt="%Y-%m-%d %H:%M:%S")
    handler.setFormatter(formatter)

    root_logger.addHandler(handler)
    root_logger.setLevel(logging.INFO)

    # Minimize noisy external logs
    logging.getLogger("uvicorn.access").setLevel(logging.WARNING)
    logging.getLogger("uvicorn.error").setLevel(logging.INFO)

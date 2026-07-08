"""
Metrics collector utility for StadiumIQ.
Provides high-performance, concurrent tracking of application telemetry.
"""

from collections import defaultdict
from typing import Any


class MetricsCollector:
    def __init__(self) -> None:
        self.request_count: int = 0
        self.error_count: int = 0
        self.latency_sum: float = 0.0
        self.endpoint_stats: dict[str, dict[str, Any]] = defaultdict(
            lambda: {"count": 0, "latency_sum": 0.0}
        )
        self.cache_hits: int = 0
        self.cache_misses: int = 0
        self.cache_lookup_time_sum: float = 0.0
        self.gemini_calls: int = 0
        self.offline_fallback_calls: int = 0

    def record_request(self, endpoint: str, duration: float, is_error: bool = False) -> None:
        self.request_count += 1
        self.latency_sum += duration
        if is_error:
            self.error_count += 1
        self.endpoint_stats[endpoint]["count"] += 1
        self.endpoint_stats[endpoint]["latency_sum"] += duration

    def record_cache(self, hit: bool, lookup_time: float) -> None:
        if hit:
            self.cache_hits += 1
        else:
            self.cache_misses += 1
        self.cache_lookup_time_sum += lookup_time

    def record_gemini_call(self) -> None:
        self.gemini_calls += 1

    def record_offline_fallback(self) -> None:
        self.offline_fallback_calls += 1

    def get_report(self) -> dict[str, Any]:
        try:
            import psutil

            process = psutil.Process()
            memory_info = process.memory_info()
            memory_usage = memory_info.rss / (1024 * 1024)
            cpu_percent = psutil.cpu_percent(interval=None)
        except (ImportError, Exception):
            memory_usage = 0.0
            cpu_percent = 0.0

        avg_latency = (self.latency_sum / self.request_count) if self.request_count > 0 else 0.0
        cache_ratio = (
            (self.cache_hits / (self.cache_hits + self.cache_misses))
            if (self.cache_hits + self.cache_misses) > 0
            else 0.0
        )
        avg_cache_lookup = (
            (self.cache_lookup_time_sum / (self.cache_hits + self.cache_misses))
            if (self.cache_hits + self.cache_misses) > 0
            else 0.0
        )

        endpoints = {}
        for k, v in self.endpoint_stats.items():
            endpoints[k] = {
                "count": v["count"],
                "avg_latency": ((v["latency_sum"] / v["count"]) if v["count"] > 0 else 0.0),
            }

        return {
            "avg_latency_ms": avg_latency * 1000,
            "per_endpoint_stats": endpoints,
            "memory_usage_mb": memory_usage,
            "cpu_usage_percent": cpu_percent,
            "request_count": self.request_count,
            "error_count": self.error_count,
            "cache_hit_rate": cache_ratio,
            "avg_cache_lookup_time_ms": avg_cache_lookup * 1000,
            "gemini_usage_count": self.gemini_calls,
            "offline_fallback_count": self.offline_fallback_calls,
        }


metrics_collector = MetricsCollector()

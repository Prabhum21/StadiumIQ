"""
Performance benchmark script for StadiumIQ backend.
Benchmarks 100, 500, and 1000 requests to measure latency and throughput.
"""

import asyncio
import time
import argparse
import numpy as np
import httpx

async def run_batch(url: str, request_count: int, concurrency: int) -> None:
    print(f"\n--- Benchmarking {request_count} requests (Concurrency: {concurrency}) ---")
    
    latencies = []
    sem = asyncio.Semaphore(concurrency)
    
    async def send_req(client: httpx.AsyncClient) -> None:
        async with sem:
            start = time.perf_counter()
            try:
                resp = await client.get(url)
                duration = time.perf_counter() - start
                if resp.status_code == 200:
                    latencies.append(duration)
            except Exception:
                pass

    start_time = time.perf_counter()
    async with httpx.AsyncClient(timeout=10.0) as client:
        tasks = [send_req(client) for _ in range(request_count)]
        await asyncio.gather(*tasks)
    
    total_time = time.perf_counter() - start_time
    
    if not latencies:
        print("All requests failed. Is the server running?")
        return

    latencies_ms = np.array(latencies) * 1000
    avg_latency = np.mean(latencies_ms)
    p95 = np.percentile(latencies_ms, 95)
    p99 = np.percentile(latencies_ms, 99)
    throughput = len(latencies) / total_time

    print(f"Total time:       {total_time:.2f} seconds")
    print(f"Throughput:       {throughput:.2f} requests/sec")
    print(f"Average Latency:  {avg_latency:.2f} ms")
    print(f"95th Percentile:  {p95:.2f} ms")
    print(f"99th Percentile:  {p99:.2f} ms")


def main() -> None:
    parser = argparse.ArgumentParser(description="StadiumIQ Load Tester")
    parser.add_argument("--url", default="http://localhost:8000/", help="Target URL to benchmark")
    args = parser.parse_args()

    # Ensure event loop runs the benchmark steps sequentially
    for req_count in [100, 500, 1000]:
        # Scale concurrency up with the request count
        concurrency = min(50, req_count // 5)
        asyncio.run(run_batch(args.url, req_count, concurrency))

if __name__ == "__main__":
    main()

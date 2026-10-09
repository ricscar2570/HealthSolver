import json
import logging
import os
from functools import wraps

import redis

logger = logging.getLogger(__name__)

REDIS_HOST = os.getenv("REDIS_HOST", "localhost")
REDIS_PORT = int(os.getenv("REDIS_PORT", "6379"))
REDIS_DB = int(os.getenv("REDIS_DB", "0"))
REDIS_TIMEOUT_SECONDS = float(os.getenv("REDIS_TIMEOUT_SECONDS", "2"))

redis_client = None
try:
    candidate = redis.StrictRedis(
        host=REDIS_HOST,
        port=REDIS_PORT,
        db=REDIS_DB,
        decode_responses=True,
        socket_connect_timeout=REDIS_TIMEOUT_SECONDS,
        socket_timeout=REDIS_TIMEOUT_SECONDS,
    )
    candidate.ping()
    redis_client = candidate
    logger.info("Redis connected at %s:%s", REDIS_HOST, REDIS_PORT)
except (redis.exceptions.RedisError, OSError, ValueError) as exc:
    logger.warning(
        "Redis unavailable at %s:%s; legacy cache will be bypassed: %s",
        REDIS_HOST,
        REDIS_PORT,
        exc,
    )


def get_redis_client():
    """Return the optional legacy Redis client, or None when unavailable."""
    return redis_client


def cache_response(expiration_time=60):
    """Best-effort async JSON cache; Redis outages must not break the endpoint."""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            client = get_redis_client()
            if client is None:
                return await func(*args, **kwargs)

            try:
                key_payload = json.dumps(
                    {"args": args, "kwargs": kwargs},
                    sort_keys=True,
                    default=str,
                )
                key = f"cache:{func.__name__}:{key_payload}"
            except (TypeError, ValueError):
                return await func(*args, **kwargs)

            try:
                cached_value = client.get(key)
                if cached_value is not None:
                    try:
                        return json.loads(cached_value)
                    except json.JSONDecodeError:
                        logger.warning("Invalid JSON in Redis key %s; refreshing.", key)

                result = await func(*args, **kwargs)
                try:
                    client.setex(key, expiration_time, json.dumps(result))
                except (TypeError, ValueError):
                    logger.warning("%s result is not JSON serializable.", func.__name__)
                except redis.exceptions.RedisError as exc:
                    logger.warning("Redis write failed for %s: %s", key, exc)
                return result
            except redis.exceptions.RedisError as exc:
                logger.warning(
                    "Redis read failed for %s; bypassing cache: %s",
                    func.__name__,
                    exc,
                )
                return await func(*args, **kwargs)

        return wrapper
    return decorator


def cache_json(key: str, obj: dict | list, expiration_time: int = 3600) -> bool:
    """Best-effort storage for a JSON object; return whether caching succeeded."""
    client = get_redis_client()
    if client is None:
        return False

    try:
        client.setex(key, expiration_time, json.dumps(obj))
        return True
    except (TypeError, ValueError) as exc:
        logger.warning("Object for key %s is not JSON serializable: %s", key, exc)
    except redis.exceptions.RedisError as exc:
        logger.warning("Redis write failed for key %s: %s", key, exc)
    return False


def get_cached_json(key: str) -> dict | list | None:
    """Read a cached JSON object, returning None on miss or cache failure."""
    client = get_redis_client()
    if client is None:
        return None

    try:
        cached_value = client.get(key)
        if cached_value is None:
            return None
        try:
            return json.loads(cached_value)
        except json.JSONDecodeError:
            logger.warning("Invalid JSON found in cache key %s.", key)
            return None
    except redis.exceptions.RedisError as exc:
        logger.warning("Redis read failed for key %s: %s", key, exc)
        return None

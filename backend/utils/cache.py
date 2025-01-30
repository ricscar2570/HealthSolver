import redis
import json
from functools import wraps

redis_client = redis.StrictRedis(host="redis", port=6379, db=0, decode_responses=True)

def cache_response(expiration_time=60):
    """Decoratore per memorizzare la risposta API in cache"""
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            key = f"{func.__name__}:{json.dumps(kwargs, sort_keys=True)}"
            cached_value = redis_client.get(key)
            if cached_value:
                return json.loads(cached_value)
            
            result = await func(*args, **kwargs)
            redis_client.setex(key, expiration_time, json.dumps(result))
            return result
        return wrapper
    return decorator

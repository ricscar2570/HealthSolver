# backend/utils/cache.py
import redis
import json
import logging
import os
from functools import wraps

logger = logging.getLogger(__name__)

# Configura il client Redis UNA SOLA VOLTA
REDIS_HOST = os.getenv("REDIS_HOST", "localhost") # Default a localhost se non in env var
REDIS_PORT = int(os.getenv("REDIS_PORT", 6379))
REDIS_DB = int(os.getenv("REDIS_DB", 0))

redis_client = None
try:
    # Usa decode_responses=True per ottenere stringhe invece di bytes
    redis_client = redis.StrictRedis(host=REDIS_HOST, port=REDIS_PORT, db=REDIS_DB, decode_responses=True)
    redis_client.ping() # Verifica la connessione
    logger.info(f"Redis client connected successfully to {REDIS_HOST}:{REDIS_PORT}")
except redis.exceptions.ConnectionError as e:
    logger.error(f"Failed to connect to Redis at {REDIS_HOST}:{REDIS_PORT}: {e}")
    # Potresti voler sollevare un'eccezione qui o gestire il caso in cui Redis non è disponibile

def get_redis_client():
    """ Restituisce l'istanza del client Redis. Gestisce il caso di fallita connessione iniziale. """
    if redis_client is None:
        # Forse tenta di riconnettere o solleva errore
        logger.error("Redis client is not available.")
        raise ConnectionError("Redis client not initialized or connection failed.")
    return redis_client

def cache_response(expiration_time=60):
    """ Decoratore per memorizzare la risposta API in cache Redis. """
    def decorator(func):
        @wraps(func)
        async def wrapper(*args, **kwargs):
            r = get_redis_client() # Ottieni il client
            # Crea una chiave univoca basata sul nome della funzione e argomenti
            # Assicurati che gli argomenti siano serializzabili in JSON
            try:
                key_args = json.dumps(kwargs, sort_keys=True, default=str) # Usa default=str per tipi non standard
                key = f"cache:{func.__name__}:{key_args}"
            except TypeError as e:
                logger.warning(f"Could not serialize args for cache key in {func.__name__}: {e}. Skipping cache.")
                return await func(*args, **kwargs)

            try:
                cached_value = r.get(key)
                if cached_value:
                    logger.debug(f"Cache HIT for key: {key}")
                    try:
                        return json.loads(cached_value)
                    except json.JSONDecodeError:
                        logger.warning(f"Invalid JSON found in cache for key: {key}. Re-fetching.")
                        # Considera di eliminare la chiave corrotta: r.delete(key)

                # Cache MISS
                logger.debug(f"Cache MISS for key: {key}")
                result = await func(*args, **kwargs)

                # Cache il risultato (assicurati che sia serializzabile JSON)
                try:
                    result_json = json.dumps(result)
                    r.setex(key, expiration_time, result_json)
                    logger.debug(f"Cached result for key: {key} with expiration {expiration_time}s")
                except TypeError:
                    logger.warning(f"Result for {func.__name__} is not JSON serializable. Skipping cache.")
                except redis.exceptions.RedisError as e:
                     logger.error(f"Failed to cache result for key {key}: {e}")

                return result

            except redis.exceptions.RedisError as e:
                logger.error(f"Redis error during cache operation for {func.__name__}: {e}. Bypassing cache.")
                # Se Redis non è disponibile, esegui la funzione originale
                return await func(*args, **kwargs)

        return wrapper
    return decorator

def cache_json(key: str, obj: dict | list, expiration_time: int = 3600):
    """ Salva un oggetto JSON in cache Redis con una scadenza. """
    r = get_redis_client()
    try:
        value = json.dumps(obj)
        r.setex(key, expiration_time, value)
        logger.info(f"Cached JSON for key '{key}' with expiration {expiration_time}s")
    except TypeError:
        logger.error(f"Object for key '{key}' is not JSON serializable. Cannot cache.")
    except redis.exceptions.RedisError as e:
        logger.error(f"Failed to cache JSON for key '{key}': {e}")


def get_cached_json(key: str) -> dict | list | None:
    """ Recupera un oggetto JSON dalla cache Redis. """
    r = get_redis_client()
    try:
        cached_value = r.get(key)
        if cached_value:
            try:
                return json.loads(cached_value)
            except json.JSONDecodeError:
                logger.warning(f"Invalid JSON found in cache for key: {key}. Returning None.")
                # Considera di eliminare la chiave corrotta: r.delete(key)
                return None
        else:
            # Chiave non trovata o scaduta
            return None
    except redis.exceptions.RedisError as e:
        logger.error(f"Failed to retrieve cached JSON for key '{key}': {e}")
        return None

# Rimuovi le definizioni duplicate di 'r' e delle funzioni se presenti

import os


def get_connection():
    """Open the deprecated PostgreSQL connection only with explicit credentials."""
    try:
        import psycopg2
        from psycopg2.extras import RealDictCursor
    except ImportError as exc:
        raise RuntimeError(
            "Legacy PostgreSQL support requires the optional psycopg2 dependency."
        ) from exc

    password = os.getenv("POSTGRES_PASSWORD", "").strip()
    if not password:
        raise RuntimeError("POSTGRES_PASSWORD is required for legacy PostgreSQL access.")

    try:
        connect_timeout = int(os.getenv("POSTGRES_CONNECT_TIMEOUT_SECONDS", "5"))
    except ValueError as exc:
        raise RuntimeError("POSTGRES_CONNECT_TIMEOUT_SECONDS must be an integer.") from exc

    return psycopg2.connect(
        dbname=os.getenv("POSTGRES_DB", "healthsolver"),
        user=os.getenv("POSTGRES_USER", "healthsolver"),
        password=password,
        host=os.getenv("POSTGRES_HOST", "localhost"),
        port=int(os.getenv("POSTGRES_PORT", "5432")),
        connect_timeout=connect_timeout,
        cursor_factory=RealDictCursor,
    )

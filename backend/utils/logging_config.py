import logging
import os
import sys
from logging.handlers import RotatingFileHandler
from pathlib import Path

LOG_DIR = Path(os.getenv("HEALTHSOLVER_LOG_DIR", "logs"))
LOG_LEVEL = os.getenv("LOG_LEVEL", "INFO").upper()
LOG_FORMAT = "%(asctime)s - %(levelname)s - [%(name)s] - %(message)s (%(filename)s:%(lineno)d)"
DATE_FORMAT = "%Y-%m-%d %H:%M:%S"


def _numeric_level() -> int:
    value = getattr(logging, LOG_LEVEL, logging.INFO)
    return value if isinstance(value, int) else logging.INFO


def setup_logging():
    """Configure legacy logging idempotently."""
    LOG_DIR.mkdir(parents=True, exist_ok=True)
    root_logger = logging.getLogger()
    root_logger.setLevel(_numeric_level())
    formatter = logging.Formatter(LOG_FORMAT, DATE_FORMAT)

    if not any(getattr(handler, "_healthsolver_console", False) for handler in root_logger.handlers):
        console_handler = logging.StreamHandler(sys.stdout)
        console_handler.setFormatter(formatter)
        console_handler._healthsolver_console = True
        root_logger.addHandler(console_handler)

    log_file_path = (LOG_DIR / "app.log").resolve()
    if not any(
        isinstance(handler, RotatingFileHandler)
        and Path(getattr(handler, "baseFilename", "")).resolve() == log_file_path
        for handler in root_logger.handlers
    ):
        file_handler = RotatingFileHandler(
            log_file_path,
            maxBytes=5 * 1024 * 1024,
            backupCount=5,
            encoding="utf-8",
        )
        file_handler.setFormatter(formatter)
        root_logger.addHandler(file_handler)

    logging.getLogger(__name__).info(
        "Logging initialized. Level=%s file=%s",
        LOG_LEVEL,
        log_file_path,
    )

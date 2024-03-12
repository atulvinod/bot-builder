from app import db
from app import redis


def healthCheck():
    result = {"db": None, "redis": None}

    try:
        db.one("SELECT 1 + 1 as check")
        result["db"] = "Working"
    except:
        result["db"] = "Error"

    try:
        redis.ping()
        result["redis"] = "Working"
    except:
        result["redis"] = "Error"

    return result

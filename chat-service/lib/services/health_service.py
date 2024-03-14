from app import db
from app import redis
from app import mongodb
from flask import Response

def healthCheck():
    result = {"db": None, "redis": None, "mongo": None}
    errored = False

    try:
        db.one("SELECT 1 + 1 as check")
        result["db"] = "Working"
    except Exception as e:
        result["db"] = str(e)
        errored = True

    try:
        redis.ping()
        result["redis"] = "Working"
    except Exception as e:
        result["redis"] = str(e)
        errored = True

    try:
        mongodb.admin.command("ping")
        result["mongo"] = "Working"
    except Exception as e:
        result["mongo"] = str(e)
        errored = True

    return {"result": result, "errored": errored}

from flask import Blueprint, Response
from lib.services import health_service
import json

routeBlueprint = Blueprint("health", __name__, url_prefix="/health")


@routeBlueprint.route("")
def healthCheck():
    result = health_service.healthCheck()
    return Response(
        json.dumps(result["result"]),
        status=500 if result["errored"] else 200,
        content_type="application/json",
    )

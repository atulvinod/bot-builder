from flask import Blueprint, Response
from lib.services import health_service


routeBlueprint = Blueprint("health", __name__, url_prefix="/health")


@routeBlueprint.route("")
def healthCheck():
    return health_service.healthCheck()

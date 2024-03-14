from functools import wraps
import jwt
from flask import request, abort
from flask import current_app


def authorize(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        tokenData= None
        if request.headers.get("Authorization") is None:
            return {
                "message":"Authentication token missing",
                "error":"Unauthorized"
            }, 401

        token = request.headers.get("Authorization").split(" ")[1]
        try:
            tokenData = jwt.decode(token, current_app.config.get('SECRET_KEY'),algorithms=['HS256'])
        except Exception as e:            return {
                "message":"Token error",
                "error":str(e)
            }, 500
        return f(tokenData, *args, **kwargs)
    return decorated
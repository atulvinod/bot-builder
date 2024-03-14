from functools import wraps
from flask import request

USER_SESSION_HEADER_KEY = "Chat-Session-Id"

def usersession_required(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        if USER_SESSION_HEADER_KEY not in request.headers:
            return {
                "message":"User session header required"
            }, 400
        
        return f(*args, **kwargs)
    
    return decorated
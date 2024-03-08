import os
import logging
from dotenv import load_dotenv

load_dotenv()

    
from lib.utils.pinecone_client import PineconeClient
from lib.utils.redis_client import RedisClient
from lib.utils.db_client import DB

pinecone = PineconeClient().getClient()
db = DB().getClient()
redis = RedisClient().getClient()

from flask import Flask
from flask_cors import CORS
from routes.bot import routeBlueprint

def create_app(test_config=None): 
    app = Flask(__name__, instance_relative_config=True)
    app.config.from_mapping(
        SECRET_KEY=os.getenv('NEXTAUTH_SECRET') or "secret"
    )
    if test_config is None:
        # load the instance config, if it exists, when not testing
        app.config.from_pyfile('config.py', silent=True)
    else:
        # load the test config if passed in
        app.config.from_mapping(test_config)
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass

    app.register_blueprint(routeBlueprint)
    CORS(app)
    return app

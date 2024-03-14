import os
import logging
from dotenv import load_dotenv

load_dotenv()


from lib.clients.pinecone_client import PineconeClient
from lib.clients.redis_client import RedisClient
from lib.clients.db_client import DB
from lib.clients.mongo_client import MongoDB

pinecone = PineconeClient().getClient()
db = DB().getClient()
redis = RedisClient().getClient()
mongodb = MongoDB().getClient()

from flask import Flask
from flask_cors import CORS
from routes.bot import routeBlueprint as botRoutes
from routes.health import routeBlueprint as healthRoutes

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

    if __name__ != "__main__":
        gunicorn_logger = logging.getLogger('gunicorn.error')
        app.logger.handlers=gunicorn_logger.handlers
        app.logger.setLevel(gunicorn_logger.level)

    app.register_blueprint(botRoutes)
    app.register_blueprint(healthRoutes)
    CORS(app)
    return app

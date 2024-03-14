import os
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi


class MongoDB:
    def __init__(self) -> None:
        self.__mongo_client = MongoClient(
            os.getenv("MONGODB_URL"), server_api=ServerApi("1")
        )

    def getClient(self):
        return self.__mongo_client

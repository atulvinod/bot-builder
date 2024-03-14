from postgres import Postgres
import os
import logging

class DB:
    __instance = None

    @staticmethod
    def getInstance():
        if DB.__instance == None:
            DB.__instance = DB()
        return DB.__instance

    def __init__(self) -> None:
        if DB.__instance != None:
            raise Exception("Singleton class")
        else:
            self.__dbClient = Postgres(url=self.getPostgresConnectionURL())
            DB.__instance = self

    def getPostgresConnectionURL(self):
        username = os.getenv('DB_USER')
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_DATABASE")
        host = os.getenv("DB_HOST")
        port = os.getenv('DB_PORT')
        logging.info(f"Connecting to {host}:{port}")
        url = "postgres://{username}:{password}@{host}:{port}/{database}".format(username=username, password=password,database=database, host=host, port=port)
        return url

    def getClient(self):
        return self.__dbClient

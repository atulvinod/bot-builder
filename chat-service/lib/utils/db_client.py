from postgres import Postgres
import os

class DB:
    def __init__(self) -> None:
        self.__dbClient = Postgres(url=self.getPostgresConnectionURL())

    def getPostgresConnectionURL(self):
        username = os.getenv('DB_USER')
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_DATABASE")
        host = os.getenv("DB_HOST")
        port = os.getenv('DB_PORT')
        url = "postgres://{username}:{password}@{host}:{port}/{database}".format(username=username, password=password,database=database, host=host, port=port)
        return url
    
    def getClient(self):
        return self.__dbClient
import os
from postgres import Postgres

class DB:
    def __init__(self):
        self.db_client =  Postgres(url=self.getPostgresConnectionURL())

    def getPostgresConnectionURL(self):
        username = os.getenv('DB_USER')
        password = os.getenv("DB_PASSWORD")
        database = os.getenv("DB_DATABASE")
        host = os.getenv("DB_HOST")
        port = os.getenv('DB_PORT')
        url = "postgres://{username}:{password}@{host}:{port}/{database}".format(username=username, password=password,database=database, host=host, port=port)
        return url

    def getBotDetailsById(self, bot_id: int):
        record = self.db_client.one("SELECT * FROM bot_details WHERE  id = %(bot_id)s", {"bot_id": bot_id})
        return record
    
    def getDbClient(self):
        return self.db_client
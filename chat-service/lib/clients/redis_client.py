from redis import Redis
import os

class RedisClient:
    def __init__(self) -> None:
        self.__redisClient = Redis.from_url(os.getenv("REDIS_URL"))
        
    def getClient(self):
        return self.__redisClient

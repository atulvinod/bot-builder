from redis import Redis
import os

class RedisClient:
    def __init__(self) -> None:
        self.__redisClient = Redis(
            host=os.getenv("REDIS_HOST"),
            port=os.getenv("REDIS_PORT"),
            username= os.getenv("REDIS_USER"), 
            password=os.getenv("REDIS_PASSWORD")
            )
        
    def getClient(self):
        return self.__redisClient
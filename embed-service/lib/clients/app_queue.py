import redis
import os
import json

class AppQueue:
    def __init__(self) -> None:
        self.redis_client = redis. Redis(
            host=os.getenv("REDIS_HOST"),
            port=os.getenv("REDIS_PORT"),
            username= os.getenv("REDIS_USER"), 
            password=os.getenv("REDIS_PASSWORD")
            )
        
    def popQueue(self):
            queue_value = self.redis_client.rpop("task")
            if queue_value is None:
                return None
            task = json.loads(queue_value)

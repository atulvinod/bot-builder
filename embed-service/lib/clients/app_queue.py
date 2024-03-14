import redis
import os
import json
import logging

class AppQueue:
    def __init__(self) -> None:
        self.redis_client = redis.Redis.from_url(os.getenv("REDIS_URL"))

    def checkConnection(self):
        logging.info(self.redis_client.ping())

    def popQueue(self):
        queue_value = self.redis_client.rpop("task")
        if queue_value is None:
            return None
        task = json.loads(queue_value)
        return task

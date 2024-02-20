import redis
import os
import time
import logging
from bot_trainer import BotTrainer
import json

from dotenv import load_dotenv

if os.getenv("DB_HOST") is None:
    load_dotenv()

logging.basicConfig(
     level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',  
)


redis_client = redis.Redis(host=os.getenv("REDIS_HOST"), port=os.getenv("REDIS_PORT"), username= os.getenv("REDIS_USER"), password=os.getenv("REDIS_PASSWORD"))


bot_trainer = BotTrainer()
logging.info('Running consumer')
while True:
    queue_value = redis_client.rpop("task")
    if queue_value is None:
        logging.info('No value received, going to sleep')
        time.sleep(2)
    else:
        logging.info('Received task')
        task = json.loads(queue_value)
        bot_id = task['bot_id']
        logging.info('Processing bot '+str(bot_id))
        bot_trainer.process(bot_id)

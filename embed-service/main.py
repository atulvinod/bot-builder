import os
import time
import logging
from bot_trainer import BotTrainer
import json
from app_queue import AppQueue

from dotenv import load_dotenv


load_dotenv()

logging.basicConfig(
     level=logging.DEBUG,
    format='%(asctime)s - %(levelname)s - %(message)s',  
)

queue = AppQueue()

bot_trainer = BotTrainer()
logging.info('Running consumer')
while True:
    queue_value = queue.popQueue()
    if queue_value is None:
        time.sleep(2)
    else:
        logging.info('Received task : ', queue_value)
        bot_id = queue_value['bot_id']
        logging.info('Processing bot '+str(bot_id))
        bot_trainer.process(bot_id)

from llama_index.core.llms import ChatMessage
from typing import List
import json

def convertChatMessagesToJSON(chat_messages: List[ChatMessage]):
    dictCollection = convertChatMessagesToDict(chat_messages)
    return json.dumps(dictCollection)


def convertChatMessagesToDict(chat_messages: List[ChatMessage]):
    return list(map(lambda x: x.dict(), chat_messages))

from llama_index.core import VectorStoreIndex, StorageContext
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core.query_engine import SubQuestionQueryEngine
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.agent.openai import OpenAIAgent
from llama_index.core.storage.chat_store import SimpleChatStore
from llama_index.core.memory import ChatMemoryBuffer
from typing import List
from ..utils.constants import TrainingAssetTypes
from ..utils.pinecone_client import PineconeClient
from ..utils.redis_client import RedisClient
from ..utils.db_client import DB
import json

db = DB().getClient()
pinecone = PineconeClient().getClient()
redis = RedisClient().getClient()


def getBotSpec(bot_id: int):
    cacheKey = f"bot-spec;{bot_id}"
    cacheHit = redis.get(cacheKey)

    if cacheHit is None:
        db_value = db.one(
            "SELECT spec FROM bot_details WHERE id = %(bot_id)s", {"bot_id": bot_id}
        )
        if db_value is None:
            raise Exception("Bot id is invalid")
        spec = json.loads(db_value)
        redis.set(cacheKey, db_value)
        return spec

    data = json.loads(cacheHit)
    return data


def getHistoryCacheKey(bot_id: int):
    cacheKey = f"chat-history:{bot_id}"
    return cacheKey


def retrieveChatHistory(bot_id: int):
    cacheKey = getHistoryCacheKey(bot_id)
    history = json.loads(redis.get(cacheKey) or "[]")

    def convertToChatMessage(x):
        return ChatMessage(role=x["role"], content=x["content"])

    chatHistory = list(map(convertToChatMessage, history))

    return chatHistory


def updateChatHistory(
    bot_id: int, chat_history: List[ChatMessage], new_messages: List[ChatMessage]
):
    cacheKey = getHistoryCacheKey(bot_id)
    merged_history = chat_history + new_messages
    history = [n.dict() for n in merged_history]
    redis.set(cacheKey, json.dumps(history))


def getResponseForQuery(bot_id: int, user_question: str):
    spec = getBotSpec(bot_id)
    queryEngineTools = []
    # TODO: re-write the code to make it more generic
    for trainingTypes in spec["training_spec"]:
        if trainingTypes == TrainingAssetTypes.Files.value:
            pineconeIndex = pinecone.Index(f"id-{bot_id}-type-files")
            vectorStore = PineconeVectorStore(pinecone_index=pineconeIndex)
            vectorIndex = VectorStoreIndex.from_vector_store(vector_store=vectorStore)
            queryEngine = vectorIndex.as_query_engine()
            queryEngineTool = QueryEngineTool(
                query_engine=queryEngine,
                metadata=ToolMetadata(
                    name="resume", description="details about resume"
                ),
            )
            queryEngineTools.append(queryEngineTool)
    chat_history = retrieveChatHistory(bot_id)
    agent = OpenAIAgent.from_tools(
        tools=queryEngineTools,
        chat_history=chat_history,
        system_prompt="You are an assistant helping user answer queries based on the given data",
    )

    responseText = ""
    
    for x in agent.stream_chat(user_question).response_gen:
        responseText += x
        yield x

    updateChatHistory(
        bot_id,
        chat_history,
        [
            ChatMessage(role=MessageRole.USER, content=user_question),
            ChatMessage(role=MessageRole.ASSISTANT, content=responseText),
        ],
    )

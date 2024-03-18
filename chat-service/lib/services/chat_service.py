from llama_index.core import VectorStoreIndex
from llama_index.core.tools import QueryEngineTool, ToolMetadata
from llama_index.vector_stores.pinecone import PineconeVectorStore
from llama_index.core.llms import ChatMessage, MessageRole
from llama_index.agent.openai import OpenAIAgent
from typing import List
from lib.constants import TrainingAssetTypes
from lib.utils.util import convertChatMessagesToJSON, convertChatMessagesToDict
import json
import uuid
from lib.models.app_error import AppError

from app import redis
from app import pinecone
from app import db
from app import mongodb
import logging

chat_history_collection = mongodb["Cluster0"]["chat_history"]

def getBotSpec(bot_id: int):
    cacheKey = f"bot-spec:{bot_id}"
    cacheHit = redis.get(cacheKey)

    if cacheHit is None:
        db_value = db.one(
            "SELECT spec FROM bot_details WHERE id = %(bot_id)s", {"bot_id": bot_id}
        )
        if db_value is None:
            raise Exception("Bot id is invalid")
        spec = db_value
        redis.set(cacheKey, json.dumps(db_value))
        return spec

    data = json.loads(cacheHit)
    return data


def getHistoryCacheKey(bot_id: int, user_session_key:str):
    cacheKey = f"chat-history:{bot_id}-{user_session_key}"
    return cacheKey


def retrieveChatHistory(bot_id: int, user_session_key:str = "system"):
    cacheKey = getHistoryCacheKey(bot_id, user_session_key)
    history = []
    cacheHit = redis.get(cacheKey)

    if cacheHit:
        history = json.loads(cacheHit)
    else:
        dbResult = chat_history_collection.find_one({"session": user_session_key})
        if dbResult is not None and len(dbResult["history"]) != 0:
            history = dbResult["history"]

    chatHistory = list(
        map(lambda x: ChatMessage(role=x["role"], content=x["content"]), history)
    )

    return chatHistory


def updateChatHistory(
    bot_id: int, user_session_key:str,chat_history: List[ChatMessage], new_messages: List[ChatMessage]
):
    cacheKey = getHistoryCacheKey(bot_id, user_session_key)
    merged_history = chat_history + new_messages
    historyJson = convertChatMessagesToJSON(merged_history)
    redis.set(cacheKey, historyJson)
    chat_history_collection.update_one(
        {"session": user_session_key},
        {"$set": {"history": convertChatMessagesToDict(merged_history)}},
        upsert=True,
    )

def getAgent(bot_id:int, user_session_key:str="system"):
    spec = getBotSpec(bot_id)
    queryEngineTools = []

    for trainingConfig in spec["training_spec"]:

        if trainingConfig['type'] == TrainingAssetTypes.Files.value:

            for index, fileConfig in enumerate(trainingConfig['config']):
                pineconeIndex = pinecone.Index(f"files-{str(bot_id)}-{fileConfig['files_id'].lower()}")
                vectorStore = PineconeVectorStore(pinecone_index=pineconeIndex)
                vectorIndex = VectorStoreIndex.from_vector_store(vector_store=vectorStore)
                queryEngine = vectorIndex.as_query_engine()
                queryEngineTool = QueryEngineTool(
                    query_engine=queryEngine,
                    metadata=ToolMetadata(
                        name= f"file-collection-{index}", description=f"collection of files related to the following context - {fileConfig['context']}"
                    ),
                )
                queryEngineTools.append(queryEngineTool)
    chat_history = retrieveChatHistory(bot_id, user_session_key)
    agent = OpenAIAgent.from_tools(
        tools=queryEngineTools,
        chat_history=chat_history,
        system_prompt="You are an assistant helping user answer queries based on the given data",
    )
    return (agent,chat_history)


def getResponseStreamForQuery(bot_id: int, user_session_key, user_question: str):
    (agent, chat_history) = getAgent(bot_id, user_session_key)    
    responseText = ""

    for x in agent.stream_chat(user_question).response_gen:
        responseText += x
        yield x

    if len(responseText) != 0:
        updateChatHistory(
            bot_id,
            user_session_key,
            chat_history,
            [
                ChatMessage(role=MessageRole.USER, content=user_question),
                ChatMessage(role=MessageRole.ASSISTANT, content=responseText),
            ],
        )

def getResponseTextForQuery(bot_id, user_session_key, user_question: str):
    (agent, chat_history) = getAgent(bot_id, user_session_key)
    response = agent.chat(user_question).response
    updateChatHistory(
        bot_id,
        chat_history,
         [
            ChatMessage(role=MessageRole.USER, content=user_question),
            ChatMessage(role=MessageRole.ASSISTANT, content=response),
        ],
    )

def getSuggestedQuestions(bot_id):
    try:
        cache_key = f"suggested:{bot_id}"
        cache_hit = redis.get(cache_key)

        if cache_hit is not None:
            questions = json.loads(cache_hit)
            return questions['questions']
        
        (agent, _) = getAgent(bot_id)
        agentResponse:str = agent.chat("Specify 3 questions that I can ask you based on the context given. Reply only with questions, don't respond with bullet points, instead respond in such a way where each question is separated with a ' | ' separator").response
        questions = agentResponse.split(' | ')
        redis.set(cache_key, json.dumps({"questions":questions}))
        return questions
    except Exception as e:
        logging.error(e)
        return []

def getChatSession(bot_id, user_id):
    session = db.one("SELECT session_id FROM chat_sessions WHERE bot_id = %(bot_id)s and user_id = %(user_id)s ORDER BY id LIMIT 1",{"bot_id":bot_id, "user_id":user_id})
    if session is None:
        uid = uuid.uuid4().__str__()
        db.run("INSERT INTO chat_sessions(bot_id, session_id ,user_id) VALUES (%(bot_id)s,%(session_id)s,%(user_id)s)",{"bot_id":bot_id, "session_id":uid, "user_id":user_id})
        return uid
    
    return session


def resetChatSession(bot_id, user_id, session_id):
    session = db.one("SELECT id FROM chat_sessions WHERE session_id = %(session_id)s AND user_id = %(user_id)s and bot_id = %(bot_id)s", {"session_id":session_id, "user_id":user_id, "bot_id":bot_id})

    if session is None:
        raise AppError("Session not found",404)

    db.run("DELETE FROM chat_sessions WHERE session_id = %(session_id)s",{"session_id":session_id})

    return getChatSession(bot_id, user_id)

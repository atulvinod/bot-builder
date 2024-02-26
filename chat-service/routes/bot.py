from flask import Blueprint, Response
from flask import request, stream_with_context
from lib.services.chat_service import getResponseStreamForQuery, retrieveChatHistory, getResponseTextForQuery, getSuggestedQuestions, getChatSession
from llama_index.core.llms import ChatMessage, MessageRole
import json
import time

routeBlueprint = Blueprint("chat",__name__, url_prefix="/bot")
USER_SESSION_HEADER_KEY = "Chat-Session-Id"

#TODO: get user id from token
@routeBlueprint.route('/chat/<bot_id>/ask', methods=['POST'])
def  chat(bot_id:int):
    chatQuestion = request.get_json().get('question')
    
    userSession = request.headers.get(USER_SESSION_HEADER_KEY)
    acceptType = request.headers.get('Accept')

    if userSession is None or acceptType is None:
        return Response({"message":"Invalid user session header or accept header type"},status=400, content_type="application/json")
    
    if acceptType is None or acceptType != 'text/event-stream':
        return Response(getResponseTextForQuery(bot_id, userSession))
    else:
        # TODO: remove this testing code
        def res():
            a = ['what ', 'the ','fuck ','is ','going ','on ','in ','this ','world']
            for x in a:
                time.sleep(0.5)
                yield x
        # return Response()
        return Response(stream_with_context(res()), content_type='text/event-stream')

@routeBlueprint.route('/<bot_id>/history')
def getHistory(bot_id:int):
    userSession = request.headers.get(USER_SESSION_HEADER_KEY)
    
    if userSession is None:
        return Response({"message":"invalid user session"},status=400,content_type="application/json")
    
    history = retrieveChatHistory(bot_id, userSession)
    response = list(map(lambda x:x.dict(), history))
    return {"data":{"history":response}}

@routeBlueprint.route('/<bot_id>/suggested_questions')
def getSuggested(bot_id:int):
    suggested = getSuggestedQuestions(bot_id)
    return {"data":{"questions":suggested}}

@routeBlueprint.route('/<bot_id>/session')
def getSession(bot_id):
    #TODO: get user_id from token
    chat_session = getChatSession(bot_id, 0)
    return {"data":{"session":chat_session}}

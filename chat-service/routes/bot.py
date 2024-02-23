from flask import Blueprint, Response
from flask import request, stream_with_context
from lib.services.chat_service import getResponseForQuery, retrieveChatHistory
from llama_index.core.llms import ChatMessage, MessageRole
import json
import time

routeBlueprint = Blueprint("chat",__name__, url_prefix="/bot")


#TODO: get user id from token
@routeBlueprint.route('/chat/<bot_id>/ask', methods=['POST'])
def  chat(bot_id:int):
    chatQuestion = request.get_json().get('question')
    def res():
        a = ['what ', 'the ','fuck ','is ','going ','on ','in ','this ','world']
        for x in a:
            time.sleep(0.5)
            yield x
    # return Response(getResponseForQuery(bot_id, chatQuestion))
    return Response(stream_with_context(res()), content_type='text/event-stream')

@routeBlueprint.route('/<bot_id>/history')
def getHistory(bot_id:int):
    history = retrieveChatHistory(bot_id)
    response = list(map(lambda x:x.dict(), history))
    return {"data":{"history":response}}
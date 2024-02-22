from flask import Blueprint, Response
from flask import request, stream_with_context
from lib.services.chat_service import getResponseForQuery
from llama_index.core.llms import ChatMessage, MessageRole
routeBlueprint = Blueprint("chat",__name__, url_prefix="/bot")


@routeBlueprint.route('/chat/<bot_id>', methods=['POST'])
def  chat(bot_id:int):
    chatQuestion = request.get_json().get('question')
    return Response(getResponseForQuery(bot_id, chatQuestion))

    
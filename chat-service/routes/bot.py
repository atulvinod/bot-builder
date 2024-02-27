from flask import Blueprint, Response
from flask import request, stream_with_context
from lib.services.chat_service import retrieveChatHistory, getResponseTextForQuery, getSuggestedQuestions, getChatSession
import time
from lib.utils.auth_middleware import authorize
from lib.utils.usersession_middleware import usersession_required

routeBlueprint = Blueprint("chat",__name__, url_prefix="/bot")
USER_SESSION_HEADER_KEY = "Chat-Session-Id"

#TODO: get user id from token
@routeBlueprint.route('/chat/<bot_id>/ask', methods=['POST'])
@usersession_required
@authorize
def chat(user, bot_id:int):
    chatQuestion = request.get_json().get('question')
    
    userSession = request.headers.get(USER_SESSION_HEADER_KEY)
    acceptType = request.headers.get('Accept')

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
@usersession_required
@authorize
def getHistory(user, bot_id:int):
    userSession = request.headers.get(USER_SESSION_HEADER_KEY)    
    history = retrieveChatHistory(bot_id, userSession)
    response = list(map(lambda x:x.dict(), history))
    return {"data":{"history":response}}

@routeBlueprint.route('/<bot_id>/suggested_questions')
@authorize
def getSuggested(user, bot_id:int):
    suggested = getSuggestedQuestions(bot_id)
    return {"data":{"questions":suggested}}

@routeBlueprint.route('/<bot_id>/session')
@authorize
def getSession(user,bot_id):
    chat_session = getChatSession(bot_id, user.id)
    return {"data":{"session":chat_session}}

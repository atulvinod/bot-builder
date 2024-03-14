import resend
import os
from lib.clients.db import DB
from pybars import Compiler


resend.api_key = os.getenv('RESEND_API_KEY')
db_client = DB.getInstance()
complier = Compiler()

def getSuccessMessageTemplate():
    raw_template = None
    with open(os.path.join('lib','templates','success.html')) as t:
        raw_template = t.read()
    return raw_template


def sendSuccessMessage(bot_id:int):
    details = db_client.getDbClient().one("SELECT u.email, u.name as user_name, bd.name as bot_name FROM users u JOIN bot_details bd ON u.id = bd.created_by_user_id WHERE bd.id = %(bot_id)s",{"bot_id":bot_id})
    raw_template = getSuccessMessageTemplate()
    
    h_template = complier.compile(raw_template)
    email_body = h_template({
        "user_name": details.user_name,
        "bot_name":details.bot_name,
        "bot_id":bot_id,
        "webapp_base":os.getenv('WEBAPP_HOST')
    })
    email = resend.Emails.send({
        "from":os.getenv("FROM_EMAIL_DOMAIN"),
        "to":[details.email],
        "subject": f"You bot {details.bot_name} is ready",
        "html":email_body
    })
    
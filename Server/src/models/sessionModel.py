from pydantic import BaseModel
import datetime

class Session(BaseModel):
    id: str
    user_id: str
    expiresAt: datetime.datetime

def session_data(session_collection):
    return {
        "id": session_collection.id,
        "user_id": session_collection.user_id,
        "expiresAt": session_collection.expiresAt
    }
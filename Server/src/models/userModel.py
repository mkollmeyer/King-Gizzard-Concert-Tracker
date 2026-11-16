from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str

def user_data(user: dict[str, str]) -> dict[str, str]:
    return {
        "id": user["id"],
        "username": user["username"],
    }
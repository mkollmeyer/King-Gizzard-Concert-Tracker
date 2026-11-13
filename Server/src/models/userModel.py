from pydantic import BaseModel

class User(BaseModel):
    id: str
    username: str
    password: str

def user_data(user: dict[str, str]) -> dict[str, str]:
    return {
        "id": user["id"],
        "username": user["username"],
        "password": user["password"]
    }
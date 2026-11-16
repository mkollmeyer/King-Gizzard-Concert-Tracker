import bcrypt
from fastapi import Body, HTTPException
from pymongo.errors import DuplicateKeyError
from src.config.db import user_collection
from src.models.userModel import user_data
import uuid

def authenticate_user(username: str = Body(...), password: str = Body(...)):
    user = user_collection.find_one({"username": username})
    if user is None or not bcrypt.checkpw(
        password.encode("utf-8"),
        user["password"].encode("utf-8"),
    ):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    return {"data": user_data(user)}

def create_user(username: str = Body(...), password: str = Body(...)):
    id = str(uuid.uuid4())
    try:
        user = {
            "id": id,
            "username": username,
            "password": password
        }
        user_collection.insert_one(user.copy())
        return {"data": user_data(user)}
    except DuplicateKeyError as e:
        key_pattern = (e.details or {}).get("keyPattern", {})
        field = "username" if "username" in key_pattern else "id"
        raise HTTPException(status_code=409, detail=f"{field} already exists") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}") from e
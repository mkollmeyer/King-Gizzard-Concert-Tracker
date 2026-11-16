from fastapi import Body, HTTPException
from pymongo.errors import DuplicateKeyError
from src.config.db import user_collection
from src.models.userModel import user_data
import uuid

def get_user_by_id(user_id: str):
    try:
        data = user_collection.find_one({"id": user_id})
        return user_data(data)
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error retrieving user: {str(e)}")

def get_user_by_username(username: str):
    data = user_collection.find_one({"username": username})
    if data is None:
        raise HTTPException(status_code=404, detail="User not found")
    return {"data": user_data(data)}

def get_all_users():
    try:
        users = user_collection.find()
        return [user_data(user) for user in users]
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error retrieving users: {str(e)}")

def create_user(username: str = Body(...), password: str = Body(...)):
    id = str(uuid.uuid4())
    try:
        user = {
            "id": id,
            "username": username,
            "password": password
        }
        user_collection.insert_one(user.copy())
        return {"data": user}
    except DuplicateKeyError as e:
        key_pattern = (e.details or {}).get("keyPattern", {})
        field = "username" if "username" in key_pattern else "id"
        raise HTTPException(status_code=409, detail=f"{field} already exists") from e
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating user: {str(e)}") from e

def update_user(user_id: str, username: str = None, password: str = None):
    try:
        update_data = {}
        if username:
            update_data["username"] = username
        if password:
            update_data["password"] = password

        if not update_data:
            return HTTPException(status_code=400, detail="No data provided for update")

        resp = user_collection.update_one({"id": user_id}, {"$set": update_data})
        if resp.matched_count == 0:
            return HTTPException(status_code=404, detail="User not found")
        return {"status_code": 200, "message": "User updated successfully"}
    except DuplicateKeyError as e:
        raise HTTPException(status_code=409, detail="Username already exists") from e
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error updating user: {str(e)}")

def delete_user(user_id: str):
    try:
        resp = user_collection.delete_one({"id": user_id})
        if resp.deleted_count == 0:
            return HTTPException(status_code=404, detail="User not found")
        return {"status_code": 200, "message": "User deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error deleting user: {str(e)}")
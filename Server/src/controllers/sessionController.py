import base64
import hashlib
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Body
from src.config.db import session_collection, user_collection


def _session_id(token: str) -> str:
    digest = hashlib.sha256(token.encode("utf-8")).digest()
    return base64.b32encode(digest).decode("ascii").lower()

def _handle_response(status: int, message: str, data: Any = None) -> dict[str, Any]:
    return {"status": status, "message": message, "data": data}

def create_session(
    token: str = Body(..., alias="Token"),
    user_id: str = Body(..., alias="userID"),
) -> dict[str, Any]:
    session = {
        "id": _session_id(token),
        "userID": user_id,
        "expiresAt": datetime.now(timezone.utc) + timedelta(minutes=30),
    }
    session_collection.insert_one(session.copy())
    return _handle_response(201, "Session created", session)

def invalidate(session_id: str) -> None:
    session_collection.find_one_and_delete({"id": session_id})

def invalidate_session(session_id: str) -> dict[str, Any]:
    session_collection.find_one_and_delete({"id": session_id})
    return _handle_response(200, "Session invalidated")

def validate_session_token(token: str) -> dict[str, Any]:
    session = session_collection.find_one({"id": _session_id(token)})
    if session is None:
        return {"session": None, "user": None, "update": False}

    user = user_collection.find_one({"id": session["userID"]})
    if user is None:
        return {"session": None, "user": None, "update": False}

    expires_at = session["expiresAt"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    now = datetime.now(timezone.utc)
    if now >= expires_at:
        invalidate(session["id"])
        return {"session": None, "user": None, "update": False}

    should_update = now >= expires_at - timedelta(days=15)
    if should_update:
        session["expiresAt"] = now + timedelta(days=30)
        session_collection.update_one(
            {"id": session["id"]},
            {"$set": {"expiresAt": session["expiresAt"]}},
        )

    return {
        "session": {
            "id": session["id"],
            "userID": session["userID"],
            "expiresAt": session["expiresAt"],
        },
        "user": {
            "id": user["id"],
            "username": user["username"],
        },
        "update": should_update,
    }
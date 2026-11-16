import base64
import hashlib
import secrets
from datetime import datetime, timedelta, timezone
from typing import Any

from fastapi import Depends, Header, HTTPException
from src.config.db import session_collection, user_collection


def _session_id(token: str) -> str:
    digest = hashlib.sha256(token.encode("utf-8")).digest()
    return base64.b32encode(digest).decode("ascii").lower()


def create_session_for_user(user_id: str) -> str:
    token = secrets.token_urlsafe(32)
    session_collection.insert_one({
        "id": _session_id(token),
        "userID": user_id,
        "expiresAt": datetime.now(timezone.utc) + timedelta(minutes=30),
    })
    return token


def validate_session_token(token: str) -> dict[str, Any] | None:
    session = session_collection.find_one({"id": _session_id(token)})
    if session is None:
        return None

    user = user_collection.find_one({"id": session["userID"]})
    if user is None:
        return None

    expires_at = session["expiresAt"]
    if expires_at.tzinfo is None:
        expires_at = expires_at.replace(tzinfo=timezone.utc)

    if datetime.now(timezone.utc) >= expires_at:
        session_collection.delete_one({"id": session["id"]})
        return None

    return {
        "session": {
            "id": session["id"],
            "userID": session["userID"],
            "expiresAt": expires_at,
        },
        "user": {
            "id": user["id"],
            "username": user["username"],
        },
        "update": False,
    }


def get_current_session(
    authorization: str | None = Header(default=None),
) -> dict[str, Any]:
    scheme, separator, token = (authorization or "").partition(" ")
    if scheme.lower() != "bearer" or not separator or not token.strip():
        raise HTTPException(
            status_code=401,
            detail="Authentication required",
            headers={"WWW-Authenticate": "Bearer"},
        )

    session = validate_session_token(token.strip())
    if session is None:
        raise HTTPException(
            status_code=401,
            detail="Invalid or expired session",
            headers={"WWW-Authenticate": "Bearer"},
        )
    return session


def get_current_user(
    session: dict[str, Any] = Depends(get_current_session),
) -> dict[str, str]:
    return session["user"]


def invalidate_current_session(
    session: dict[str, Any] = Depends(get_current_session),
) -> dict[str, str]:
    session_collection.delete_one({"id": session["session"]["id"]})
    return {"message": "Session invalidated"}

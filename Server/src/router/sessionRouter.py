from src.controllers.sessionController import create_session, invalidate_session, validate_session_token
from fastapi import APIRouter

session_router = APIRouter(prefix="/api/sessions", tags=["sessions"])

session_router.add_api_route("/create_session", create_session, methods=["POST"])
session_router.add_api_route("/validate_session/{token}", validate_session_token, methods=["GET"])
session_router.add_api_route("/invalidate_session/{session_id}", invalidate_session, methods=["DELETE"])
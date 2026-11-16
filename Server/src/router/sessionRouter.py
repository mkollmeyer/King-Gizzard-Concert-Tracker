from src.controllers.sessionController import get_current_session, invalidate_current_session
from fastapi import APIRouter

session_router = APIRouter(prefix="/api/sessions", tags=["sessions"])

session_router.add_api_route("/current", get_current_session, methods=["GET"])
session_router.add_api_route("/current", invalidate_current_session, methods=["DELETE"])
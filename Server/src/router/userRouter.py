from src.controllers.userController import authenticate_user, create_user
from fastapi import APIRouter

user_router = APIRouter(prefix="/api/user", tags=["users"])

user_router.add_api_route("/signin", authenticate_user, methods=["POST"])
user_router.add_api_route("/create_user", create_user, methods=["POST"])
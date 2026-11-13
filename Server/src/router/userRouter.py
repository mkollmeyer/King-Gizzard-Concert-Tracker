from src.controllers.userController import get_user_by_id, get_user_by_username, get_all_users, create_user, update_user, delete_user
from fastapi import APIRouter

user_router = APIRouter(prefix="/api/user", tags=["users"])

user_router.add_api_route("/get_user_by_id/{user_id}", get_user_by_id, methods=["GET"])
user_router.add_api_route("/get_user_by_username/{username}", get_user_by_username, methods=["GET"])
user_router.add_api_route("/get_all_users", get_all_users, methods=["GET"])
user_router.add_api_route("/create_user", create_user, methods=["POST"])
user_router.add_api_route("/update_user/{user_id}", update_user, methods=["PUT"])
user_router.add_api_route("/delete_user/{user_id}", delete_user, methods=["DELETE"])
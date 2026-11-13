from src.controllers.setlistController import get_setlist, get_all_setlists, get_setlist_by_id, create_setlist, update_setlist, delete_setlist
from fastapi import APIRouter

setlist_router = APIRouter(prefix="/api/setlists", tags=["setlists"])

setlist_router.add_api_route("/get_setlist/{date}", get_setlist, methods=["GET"])
setlist_router.add_api_route("/get_all_setlists/", get_all_setlists, methods=["GET"])
setlist_router.add_api_route("/get_setlist_by_id/{setlist_id}", get_setlist_by_id, methods=["GET"])
setlist_router.add_api_route("/create_setlist/", create_setlist, methods=["POST"])
setlist_router.add_api_route("/update_setlist/{setlist_id}", update_setlist, methods=["PUT"])
setlist_router.add_api_route("/delete_setlist/{setlist_id}", delete_setlist, methods=["DELETE"])
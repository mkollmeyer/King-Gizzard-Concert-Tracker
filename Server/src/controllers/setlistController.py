from fastapi import Body, HTTPException
import httpx
import os
from src.config.db import setlist_collection
from src.models.setlistModel import setlist_data, Show
from dotenv import load_dotenv

load_dotenv()

async def get_setlist(date: str):
    headers = {
        'Accept': 'application/json',
        'x-api-key': os.getenv("API_KEY")
    }
    try:
        async with httpx.AsyncClient() as client:
            ref = await client.get(f"https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=f58384a4-2ad2-4f24-89c5-c7b74ae1cce7&date=${date}",
                                   headers= headers)
            ref.raise_for_status()
            data = ref.json()
        show = Show(
            city=data['setlist'][0]['venue']['city']['name'],
            num_songs=data['setlist'][0]['sets']['set'][0]['song'][0]['length'],
            setlist=[song['name'] for song in data['setlist'][0]['sets']['set'][0]['song']]
        )
        return {"status_code": 200, "detail": "Setlist found", "show": show}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error retrieving setlist: {str(e)}")

def get_setlist_by_id(setlist_id: str):
    try:
        data = setlist_collection.find_one({"id": setlist_id})
        return setlist_data(data)
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error retrieving setlist: {str(e)}")

def get_all_setlists():
    try:
        setlists = setlist_collection.find()
        return [setlist_data(setlist) for setlist in setlists]
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error retrieving setlists: {str(e)}")

def create_setlist(id: str = Body(..., embed=True)):
    try:
        setlist = {
            "id": id,
            "songs": {},
            "cities": {}
        }
        setlist_collection.insert_one(setlist.copy())
        return {
            "status_code": 201,
            "message": "Setlist created successfully",
            "data": setlist,
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error creating setlist: {str(e)}") from e

def update_setlist(setlist_id: str, songs: dict = None, cities: dict = None):
    try:
        update_data = {}
        if songs:
            update_data["songs"] = songs
        if cities:
            update_data["cities"] = cities

        if not update_data:
            return HTTPException(status_code=400, detail="No data provided for update")

        resp = setlist_collection.update_one({"id": setlist_id}, {"$set": update_data})
        if resp.matched_count == 0:
            return HTTPException(status_code=404, detail="Setlist not found")
        return {"status_code": 200, "message": "Setlist updated successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error updating setlist: {str(e)}")

def delete_setlist(setlist_id: str):
    try:
        resp = setlist_collection.delete_one({"id": setlist_id})
        if resp.deleted_count == 0:
            return HTTPException(status_code=404, detail="Setlist not found")
        return {"status_code": 200, "message": "Setlist deleted successfully"}
    except Exception as e:
        return HTTPException(status_code=500, detail=f"Error deleting setlist: {str(e)}")
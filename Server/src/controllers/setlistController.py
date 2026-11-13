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
            ref = await client.get(f"https://api.setlist.fm/rest/1.0/search/setlists?artistMbid=f58384a4-2ad2-4f24-89c5-c7b74ae1cce7&date={date}",
                                   headers= headers)
            ref.raise_for_status()
            data = ref.json()
        songs = data['setlist'][0]['sets']['set'][0]['song']
        showDate = data['setlist'][0]['eventDate']
        show = Show(
            city=data['setlist'][0]['venue']['city']['name'],
            date=showDate,
            num_songs=len(songs),
            setlist=[song['name'] for song in songs]
        )
        print(f"Retrieved setlist for date {date}: {show}")
        return {"data": show}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving setlist: {str(e)}") from e

def get_setlist_by_id(setlist_id: str):
    try:
        data = setlist_collection.find_one({"id": setlist_id})
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error retrieving setlist: {str(e)}") from e
    if data is None:
        raise HTTPException(status_code=404, detail="Setlist not found")
    return {
        "data": {
            "id": data["id"],
            "dates": data.get("dates", []),
            "num_songs": data.get("num_songs", 0),
            "songs": data.get("songs", {}),
            "cities": data.get("cities", {}),
        }
    }

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
            "dates": [],
            "num_songs": 0,
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

def update_setlist(setlist_id: str, songs: dict = Body(...), num_songs: int = Body(...), city: dict = Body(...), dates: list = Body(...)):
    try:
        update_data = {}
        if songs:
            update_data["songs"] = songs
        if num_songs is not None:
            update_data["num_songs"] = num_songs
        if city:
            update_data["cities"] = city
        if dates:
            update_data["dates"] = dates
        if not update_data:
            raise HTTPException(status_code=400, detail="No data provided for update")
        resp = setlist_collection.update_one({"id": setlist_id}, {"$set": update_data})
        if resp.matched_count == 0:
            raise HTTPException(status_code=404, detail="Setlist not found")
        return {"status_code": 200, "message": "Setlist updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error updating setlist: {str(e)}") from e

def delete_setlist(setlist_id: str):
    try:
        resp = setlist_collection.delete_one({"id": setlist_id})
        if resp.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Setlist not found")
        return {"status_code": 200, "message": "Setlist deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error deleting setlist: {str(e)}") from e
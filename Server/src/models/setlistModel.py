from pydantic import BaseModel

class Setlist(BaseModel):
    id: str
    songs: dict = {}
    cities: dict = {}

class Show(BaseModel):
    city: str
    num_songs: int
    setlist: list

def setlist_data(setlist_collection):
    return {
        "id": setlist_collection.id,
        "songs": setlist_collection.songs,
        "cities": setlist_collection.cities
    }
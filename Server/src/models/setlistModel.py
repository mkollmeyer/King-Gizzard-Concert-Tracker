from pydantic import BaseModel

class Setlist(BaseModel):
    id: str
    dates: list = []
    num_songs: int = 0
    songs: dict = {}
    cities: dict = {}

class Show(BaseModel):
    date: str
    city: str
    num_songs: int
    setlist: list

def setlist_data(setlist_collection):
    return {
        "id": setlist_collection.id,
        "dates": setlist_collection.dates,
        "num_songs": setlist_collection.num_songs,
        "songs": setlist_collection.songs,
        "cities": setlist_collection.cities
    }
from pymongo.mongo_client import MongoClient
from pymongo.server_api import ServerApi
import os
from dotenv import load_dotenv

load_dotenv()

client = MongoClient(os.getenv("MONGO_URI"), server_api=ServerApi("1"))

db = client.get_database("mongodb")
user_collection = db.get_collection("users")
setlist_collection = db.get_collection("setlists")
session_collection = db.get_collection("sessions")
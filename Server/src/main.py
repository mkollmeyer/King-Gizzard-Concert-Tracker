from fastapi import FastAPI
from src.router.userRouter import user_router
from src.router.sessionRouter import session_router
from src.router.setlistRouter import setlist_router
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "http://localhost",
    "http://127.0.0.1",
    "http://localhost:80",
    "http://127.0.0.1:80"
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

app.include_router(user_router)
app.include_router(session_router)
app.include_router(setlist_router)

@app.get("/")
async def root():
    return {"message": "Hello World"}
from fastapi import FastAPI
import uvicorn
from pydantic  import BaseModel
from app.routers.data_entry import router
from fastapi.middleware.cors import CORSMiddleware

api = FastAPI(title="CSV Cleaner API")



api.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Change "*" to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

api.include_router(router)



@api.get('/')
def index():
    return {'message':'Hello my fbro'}






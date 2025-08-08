from fastapi import FastAPI
import uvicorn
from routers import health_router

api = FastAPI(title="CSV Cleaner API")
api.include_router(health_router)

@api.get('/')
def index():
    return {'message':'Hello my friend'}


if __name__ == "__main__":
    uvicorn.run(api, host = "0.0.0.0", port = 8000)
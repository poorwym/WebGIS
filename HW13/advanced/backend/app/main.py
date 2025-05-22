import uvicorn
from fastapi import FastAPI
import sys
import app.utils.config_loader as config_loader
from app.utils.config_loader import ConfigLoader

config_loader: ConfigLoader = config_loader.ConfigLoader()
project_root = config_loader.project_root

sys.path.append(project_root.__str__())

from app.api import file_api, calc_api

app = FastAPI()

@app.get("/")
async def root():
    return {"message": "Hello World"}

app.include_router(file_api.router)
app.include_router(calc_api.router)
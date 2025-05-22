import pathlib
from  app.schemas import file_model

from fastapi import APIRouter
from app.services import file_service

router = APIRouter(prefix="/file", tags=["file"])

@router.get("/file_edu_poi")
def list_file_edu_poi() -> file_model.FileList:
    return file_service.list_file_edu_poi()

@router.get("/file_house_price")
def list_file_house_price() -> file_model.FileList:
    return file_service.list_file_house_price()

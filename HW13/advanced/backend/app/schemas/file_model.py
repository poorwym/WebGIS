from pydantic import BaseModel
from typing import List
import pathlib

class FileItem(BaseModel):
    path: pathlib.Path
    name: str

class FileList(BaseModel):
    list: List[FileItem]
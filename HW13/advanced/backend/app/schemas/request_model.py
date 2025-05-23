from typing import List
from pydantic import BaseModel

class point(BaseModel):
    lon: float
    lat: float
    min_max_score: float

class CalcRequest(BaseModel):
    edu_poi_file_path: str
    house_price_file_path: str

class CalcResponse(BaseModel):
    point_list: List[point]
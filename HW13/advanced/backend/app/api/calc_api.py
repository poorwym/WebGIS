from app.schemas.request_model import CalcResponse, CalcRequest
from app.services import calc_service
from fastapi import APIRouter

router = APIRouter(prefix="/calc", tags=["calc"])

@router.post("/")
def calc_min_max_score(request: CalcRequest) -> CalcResponse:
   return calc_service.calc_min_max_score(request)
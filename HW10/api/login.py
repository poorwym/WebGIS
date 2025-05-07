from fastapi import APIRouter
import service.login_service as login_service
from schemas.login import LoginRequest, LoginResponse

router = APIRouter(prefix="/login", tags=["login"])

@router.post("/",status_code=200, response_model=LoginResponse)
def login(login_data: LoginRequest):
    return login_service.login(login_data)

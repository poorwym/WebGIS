from fastapi import APIRouter, HTTPException, Query
import service.user_service as user_service
from schemas.user import UserCreate, UserUpdate, UserResponse, SuccessResponse, UpdateResponse
from typing import List

router = APIRouter(prefix="/users", tags=["users"])

@router.post("/", status_code=201, response_model=SuccessResponse)
def register_user(user: UserCreate):
    return user_service.register_user(user)

@router.get("/", response_model=List[UserResponse])
def get_users(
    offset: int = Query(0, ge=0),
    limit: int = Query(10, ge=1, le=100),
    min_age: int = Query(0, ge=0, le=100),
    max_age: int = Query(100, ge=0, le=100)
):
    if not (0 <= offset < limit <= 100 and 0 <= min_age <= max_age <= 100):
        raise HTTPException(status_code=400, detail="参数无效：offset, limit, min_age, 或 max_age")
    return user_service.get_users(offset, limit, min_age, max_age)

@router.get("/{username}", response_model=UserResponse)
def get_user_by_username(username: str):
    user = user_service.get_user_by_username(username)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    return user

@router.put("/{username}", response_model=UpdateResponse)
def update_user(username: str, user_update: UserUpdate):
    return user_service.update_user(username, user_update)

@router.delete("/{username}", response_model=SuccessResponse)
def delete_user(username: str):
    return user_service.delete_user(username)


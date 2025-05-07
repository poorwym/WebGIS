import json
import os
from typing import List, Optional
from schemas.user import User, UserCreate, UserUpdate, UserResponse
from fastapi import HTTPException
from pydantic import ValidationError

users: List[User] = []

# 确保data目录存在
os.makedirs("data", exist_ok=True)

def save_user_data():
    with open("data/data.json", "w") as f:
        json.dump([user.model_dump() for user in users], f)

def init_user_data():
    global users
    try:
        with open("data/data.json", "r") as f:
            raw_users = json.load(f)
            users = [User(**user) for user in raw_users]
    except (FileNotFoundError, json.JSONDecodeError):
        users = []
    except ValidationError as e:
        # 处理数据不符合模型要求的情况
        print(f"数据验证错误: {e}")
        users = []
    print(users)
    return users

def get_user_by_username(username: str) -> Optional[UserResponse]:
    for user in users:
        if user.username == username:
            return UserResponse(**user.model_dump())
    return None

def get_users(
        offset: int, 
        limit: int, 
        min_age: int, 
        max_age: int) -> List[UserResponse]:
    filtered_users = [user for user in users if min_age <= user.age <= max_age]
    return [UserResponse(**user.model_dump()) for user in filtered_users[offset:offset+limit]]

def register_user(user_data: UserCreate) -> dict:
    try:
        existing_user = next((u for u in users if u.username == user_data.username), None)
        if existing_user is not None:
            raise HTTPException(status_code=400, detail="用户名已存在")
        
        # UserCreate模型已经包含所有验证逻辑
        user = User(**user_data.model_dump())
        users.append(user)
        save_user_data()
        return {"status_code": 201, "detail": "用户创建成功"}
    except ValueError as e:
        # 捕获Pydantic字段验证器中的ValueError
        raise HTTPException(status_code=422, detail=str(e))
    except ValidationError as e:
        # 简化处理验证错误
        raise HTTPException(status_code=422, detail=str(e))

def update_user(username: str, user_update: UserUpdate) -> dict:
    try:
        user = next((u for u in users if u.username == username), None)
        if user is None:
            raise HTTPException(status_code=404, detail="用户不存在")
        
        # 只更新提供的字段
        update_data = user_update.model_dump(exclude_unset=True)
        if not update_data:
            return {"message": "没有提供需要更新的字段", "user": UserResponse(**user.model_dump())}
        
        for field, value in update_data.items():
            if value is not None:  # 只更新非空值
                setattr(user, field, value)
        
        save_user_data()
        
        return {"message": "用户更新成功", "user": UserResponse(**user.model_dump())}
    except ValueError as e:
        # 捕获Pydantic字段验证器中的ValueError
        raise HTTPException(status_code=422, detail=str(e))
    except ValidationError as e:
        # 简化处理验证错误
        raise HTTPException(status_code=422, detail=str(e))

def delete_user(username: str) -> dict:
    user = next((u for u in users if u.username == username), None)
    if user is None:
        raise HTTPException(status_code=404, detail="用户不存在")
    
    users.remove(user)
    save_user_data()
    
    return {"message": "用户删除成功"}
from fastapi import HTTPException
import service.user_service as user_service
from schemas.login import LoginRequest, LoginResponse


def login(login_data: LoginRequest) -> LoginResponse:
    # 获取原始用户数据（包括密码）
    user = next((u for u in user_service.users if u.username == login_data.username), None)
    if user is None:
        raise HTTPException(status_code=401, detail="用户名或密码无效")
    
    if user.password != login_data.password:
        raise HTTPException(status_code=401, detail="用户名或密码无效")
    
    return LoginResponse(success=True, message="登录成功")

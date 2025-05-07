from pydantic import BaseModel, EmailStr, Field, field_validator
from typing import Optional

class User(BaseModel):
    username: str = Field(..., min_length=3, description="用户名，至少1个字符")
    email: EmailStr = Field(..., description="用户邮箱")
    age: int = Field(..., ge=0, le=100, description="用户年龄，0-100岁")
    password: str = Field(..., min_length=8, description="用户密码，至少8个字符")
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if not any(char.isupper() for char in v):
            raise ValueError('密码必须包含至少一个大写字母')
        if not any(char.isdigit() for char in v):
            raise ValueError('密码必须包含至少一个数字')
        return v

class UserCreate(User):
    pass

class SuccessResponse(BaseModel):
    success: bool = Field(True, description="操作是否成功")
    message: str = Field(..., description="详细信息")
    status_code: int = Field(201, description="状态码")

class UpdateResponse(BaseModel):
    success: bool = Field(True, description="操作是否成功")
    message: str = Field(..., description="详细信息")
    user: Optional['UserResponse'] = Field(None, description="更新后的用户信息")

class UserUpdate(BaseModel):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=100)
    
    @field_validator('password')
    @classmethod
    def password_strength(cls, v):
        if v is None:
            return v
        if not any(char.isupper() for char in v):
            raise ValueError('密码必须包含至少一个大写字母')
        if not any(char.isdigit() for char in v):
            raise ValueError('密码必须包含至少一个数字')
        if len(v) < 8:
            raise ValueError('密码长度至少为8个字符')
        return v

class UserResponse(BaseModel):
    username: str
    email: EmailStr
    age: int

# 数据模型

本文档详细说明了系统中使用的数据模型。系统使用Pydantic模型进行数据验证和序列化/反序列化。

## 用户相关模型

### User（基础用户模型）

```python
class User(BaseModel):
    username: str = Field(..., min_length=3, description="用户名，至少1个字符")
    email: EmailStr = Field(..., description="用户邮箱")
    age: int = Field(..., ge=0, le=100, description="用户年龄，0-100岁")
    password: str = Field(..., min_length=8, description="用户密码，至少8个字符")
```

**字段说明**:
- `username`: 用户名，字符串类型，最小长度为3个字符
- `email`: 邮箱地址，EmailStr类型（经过验证的有效邮箱格式）
- `age`: 年龄，整数类型，范围0-100
- `password`: 密码，字符串类型，最小长度为8个字符

**验证规则**:
- 密码必须包含至少一个大写字母
- 密码必须包含至少一个数字

### UserCreate（用户创建模型）

继承自User模型，用于创建新用户。

```python
class UserCreate(User):
    pass
```

### SuccessResponse（成功响应模型）

用于API操作成功时的响应。

```python
class SuccessResponse(BaseModel):
    success: bool = Field(True, description="操作是否成功")
    message: str = Field(..., description="详细信息")
    status_code: int = Field(201, description="状态码")
```

**字段说明**:
- `success`: 布尔值，表示操作是否成功，默认为True
- `message`: 字符串，操作结果的消息说明
- `status_code`: 整数，HTTP状态码，默认为201（创建成功）

### UpdateResponse（更新响应模型）

用于用户更新操作的响应，包含更新后的用户信息。

```python
class UpdateResponse(BaseModel):
    success: bool = Field(True, description="操作是否成功")
    message: str = Field(..., description="详细信息")
    user: Optional['UserResponse'] = Field(None, description="更新后的用户信息")
```

**字段说明**:
- `success`: 布尔值，表示操作是否成功，默认为True
- `message`: 字符串，操作结果的消息说明
- `user`: 可选的UserResponse对象，包含更新后的用户信息

### UserUpdate（用户更新模型）

用于更新用户信息，所有字段均为可选。

```python
class UserUpdate(BaseModel):
    password: Optional[str] = None
    email: Optional[EmailStr] = None
    age: Optional[int] = Field(None, ge=0, le=100)
```

**字段说明**:
- `password`: 可选，新密码
- `email`: 可选，新邮箱地址
- `age`: 可选，新年龄，范围0-100

**验证规则**:
- 如果提供密码，必须符合密码强度要求（至少8个字符，包含至少一个大写字母和一个数字）

### UserResponse（用户响应模型）

用于API响应中返回用户信息，不包含敏感信息如密码。

```python
class UserResponse(BaseModel):
    username: str
    email: EmailStr
    age: int
```

## 登录相关模型

### LoginRequest（登录请求模型）

用于用户登录请求。

```python
class LoginRequest(BaseModel):
    username: str
    password: str
```

**字段说明**:
- `username`: 用户名
- `password`: 密码

### LoginResponse（登录响应模型）

用于返回登录结果。

```python
class LoginResponse(BaseModel):
    success: bool
    message: str
```

**字段说明**:
- `success`: 布尔值，表示登录是否成功
- `message`: 字符串，登录结果的消息说明 
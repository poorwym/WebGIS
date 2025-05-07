# API参考

本文档详细说明了系统提供的API端点、请求和响应格式。

## 基础URL

所有API都基于以下基础URL:
```
http://localhost:8000
```

## 用户管理API

### 注册用户

创建一个新用户账户。

- **URL**: `/users/`
- **方法**: `POST`
- **标签**: `users`
- **状态码**: `201` 成功

**请求体**:
```json
{
  "username": "用户名",
  "email": "用户邮箱@example.com",
  "age": 25,
  "password": "密码至少8位，包含大写字母和数字"
}
```

**请求参数说明**:
- `username`: 字符串，至少3个字符
- `email`: 有效的邮箱地址
- `age`: 整数，0-100岁
- `password`: 字符串，至少8个字符，必须包含至少一个大写字母和一个数字

**响应**:
```json
{
  "success": true,
  "message": "用户注册成功"
}
```

### 获取用户列表

获取系统中的用户列表，支持分页和年龄范围过滤。

- **URL**: `/users/`
- **方法**: `GET`
- **标签**: `users`

**查询参数**:
- `offset`: 整数，从第几条记录开始，默认为0
- `limit`: 整数，返回记录数量，1-100之间，默认为10
- `min_age`: 整数，最小年龄，0-100岁，默认为0
- `max_age`: 整数，最大年龄，0-100岁，默认为100

**响应**:
```json
[
  {
    "username": "用户名1",
    "email": "user1@example.com",
    "age": 25
  },
  {
    "username": "用户名2",
    "email": "user2@example.com",
    "age": 30
  }
]
```

### 获取单个用户

通过用户名获取单个用户的详细信息。

- **URL**: `/users/{username}`
- **方法**: `GET`
- **标签**: `users`

**路径参数**:
- `username`: 字符串，要查询的用户名

**响应**:
```json
{
  "username": "用户名",
  "email": "user@example.com",
  "age": 25
}
```

**错误响应** (404):
```json
{
  "detail": "用户不存在"
}
```

### 更新用户

更新指定用户的信息。

- **URL**: `/users/{username}`
- **方法**: `PUT`
- **标签**: `users`

**路径参数**:
- `username`: 字符串，要更新的用户名

**请求体**:
```json
{
  "password": "新密码",
  "email": "新邮箱@example.com",
  "age": 26
}
```

**请求参数说明**:
- 所有字段都是可选的
- `password`: 如果提供，必须符合密码强度要求
- `email`: 如果提供，必须是有效的邮箱地址
- `age`: 如果提供，必须在0-100岁之间

**响应**:
```json
{
  "success": true,
  "message": "用户更新成功"
}
```

### 删除用户

删除指定的用户账户。

- **URL**: `/users/{username}`
- **方法**: `DELETE`
- **标签**: `users`

**路径参数**:
- `username`: 字符串，要删除的用户名

**响应**:
```json
{
  "success": true,
  "message": "用户删除成功"
}
```

## 登录API

### 用户登录

验证用户凭据并返回登录状态。

- **URL**: `/login/`
- **方法**: `POST`
- **标签**: `login`
- **状态码**: `200` 成功

**请求体**:
```json
{
  "username": "用户名",
  "password": "密码"
}
```

**响应**:
```json
{
  "success": true,
  "message": "登录成功"
}
```

**失败响应**:
```json
{
  "success": false,
  "message": "用户名或密码错误"
}
```

## 首页

### 获取欢迎信息

- **URL**: `/`
- **方法**: `GET`

**响应**:
```json
{
  "message": "Hello World"
}
``` 
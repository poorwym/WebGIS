# Pydantic 数据验证文档

本文档描述了系统中使用的 Pydantic 数据验证机制，包括验证规则、错误处理以及测试方法。

## 验证规则

系统使用 Pydantic 模型对用户数据进行验证，确保数据符合业务规则和安全标准。主要验证规则如下：

### 用户名 (username)
- 字段类型：字符串 (str)
- 最小长度：3 个字符
- 必填字段

### 密码 (password)
- 字段类型：字符串 (str)
- 最小长度：8 个字符
- 必须包含至少一个大写字母
- 必须包含至少一个数字
- 必填字段

### 邮箱 (email)
- 字段类型：EmailStr (经过验证的电子邮件格式)
- 必须是有效的电子邮件地址
- 必填字段

### 年龄 (age)
- 字段类型：整数 (int)
- 取值范围：0 到 100
- 必填字段

## 错误处理机制

系统使用 FastAPI 的 HTTPException 来处理数据验证错误，主要处理以下几类错误：

### 1. 字段验证器错误
当数据不符合 Pydantic 字段验证器的规则时，系统会抛出 ValueError，并由服务层转换为 HTTPException。

例如，密码验证器检查失败时：
```python
@field_validator('password')
@classmethod
def password_strength(cls, v):
    if not any(char.isupper() for char in v):
        raise ValueError('密码必须包含至少一个大写字母')
    if not any(char.isdigit() for char in v):
        raise ValueError('密码必须包含至少一个数字')
    return v
```

### 2. 模型验证错误
当整个数据模型验证失败时，系统会抛出 ValidationError，并由服务层转换为 HTTPException。

错误处理代码：
```python
try:
    # 用户创建或更新逻辑
except ValueError as e:
    # 捕获字段验证器中的 ValueError
    raise HTTPException(status_code=422, detail=str(e))
except ValidationError as e:
    # 捕获模型验证错误
    raise HTTPException(status_code=422, detail=str(e))
```

### 3. 状态码
- 验证错误返回状态码：422 Unprocessable Entity
- 自定义业务规则错误（如用户名已存在）：400 Bad Request
- 请求的资源不存在：404 Not Found

## 测试验证机制

系统包含多种测试来验证数据验证机制的正确性：

### 1. 单元测试
`test_user_service.py` 中包含对用户服务中数据验证处理的单元测试：
- `test_register_user_validation_errors`：测试注册用户时的验证错误
- `test_update_user_validation_errors`：测试更新用户时的验证错误
- `test_pydantic_validation_error_handling`：测试 ValidationError 的处理

### 2. API 测试
`test_users_api.py` 中包含对 API 层数据验证的测试：
- `test_register_user_validation_details`：测试用户注册 API 的验证错误
- `test_update_user_validation_details`：测试用户更新 API 的验证错误

### 3. 验证错误消息
系统会返回详细的验证错误消息，帮助客户端诊断问题：
- 密码规则错误："密码必须包含至少一个大写字母"
- 字段长度错误："字符串长度应至少为8个字符"
- 范围错误："输入应小于等于100"

## 错误响应示例

当验证失败时，API 将返回如下格式的错误响应：

```json
{
  "detail": "密码必须包含至少一个大写字母"
}
```

或者对于复杂的验证错误：

```json
{
  "detail": [
    {
      "loc": ["body", "password"],
      "msg": "密码必须包含至少一个大写字母",
      "type": "value_error"
    }
  ]
}
```

## 最佳实践

1. 客户端应该在提交数据前进行初步验证，减少不必要的请求
2. 错误处理应该提供清晰的用户提示，帮助用户正确输入数据
3. 测试应覆盖所有验证规则和边界条件
4. 验证规则应在文档中清晰说明，便于开发人员和用户理解 
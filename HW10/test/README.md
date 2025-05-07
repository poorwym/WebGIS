# 测试说明文档

本目录包含了项目的所有测试文件，用于验证系统功能的正确性和健壮性。

## 测试文件结构

- `test_user_service.py`: 用户服务层测试
- `test_users_api.py`: 用户API接口测试
- `test_login_api.py`: 登录API接口测试
- `test_main.py`: 应用主入口测试
- `conftest.py`: pytest测试配置文件

## 新增的Pydantic验证测试

本次更新增加了针对Pydantic数据验证的详细测试：

1. 在`test_user_service.py`中新增：
   - `test_register_user_validation_errors`: 测试用户注册时的验证错误处理
   - `test_update_user_validation_errors`: 测试更新用户时的验证错误处理
   - `test_pydantic_validation_error_handling`: 测试Pydantic ValidationError的处理方式

2. 在`test_users_api.py`中新增：
   - `test_register_user_validation_details`: 测试用户注册API的具体验证错误详情
   - `test_update_user_validation_details`: 测试更新用户API的具体验证错误详情

## 运行测试

可以通过以下命令运行所有测试：

```bash
pytest
```

运行特定测试文件：

```bash
pytest test/test_user_service.py
```

运行特定测试函数：

```bash
pytest test/test_user_service.py::test_register_user_validation_errors
```

运行新增的验证错误测试：

```bash
pytest test/test_user_service.py::test_register_user_validation_errors test/test_user_service.py::test_update_user_validation_errors test/test_user_service.py::test_pydantic_validation_error_handling
```

## 测试覆盖率

查看测试覆盖率报告：

```bash
pytest --cov=service --cov=schemas
```

生成HTML格式的覆盖率报告：

```bash
pytest --cov=service --cov=schemas --cov-report=html
```

## 相关文档

- [Pydantic数据验证文档](../docs/validation.md): 详细说明了系统中使用的验证规则和错误处理机制 
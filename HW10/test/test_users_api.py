import pytest
from fastapi.testclient import TestClient
import sys
import os
from unittest.mock import patch

# 确保能够导入服务模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from service import user_service
from schemas.user import UserCreate, UserResponse

@pytest.mark.parametrize("offset,limit,min_age,max_age,expected_status", [
    (0, 10, 0, 100, 200),  # 正常情况
    (-1, 10, 0, 100, 422),  # 无效的offset (< 0)
    (0, 101, 0, 100, 422),  # 无效的limit (> 100)
    (0, 10, -1, 100, 422),  # 无效的min_age (< 0)
    (0, 10, 0, 101, 422),  # 无效的max_age (> 100)
    (0, 10, 100, 0, 400),   # 无效的age范围 (min > max)
])
def test_get_users_parameters(client, offset, limit, min_age, max_age, expected_status):
    """测试获取用户API的参数处理，使用Pydantic验证"""
    response = client.get(f"/users/?offset={offset}&limit={limit}&min_age={min_age}&max_age={max_age}")
    assert response.status_code == expected_status

def test_register_user(client):
    """测试用户注册API，使用Pydantic验证"""
    # 准备有效的用户数据
    valid_user = {
        "username": "testuser",
        "password": "Password123",
        "email": "test@example.com",
        "age": 25
    }
    
    # 模拟用户服务
    with patch.object(user_service, "register_user", return_value={"status_code": 201, "detail": "用户创建成功"}):
        response = client.post("/users/", json=valid_user)
        assert response.status_code == 201
        assert response.json() == {"status_code": 201, "detail": "用户创建成功"}

def test_register_user_invalid_data(client):
    """测试用户注册API的输入验证"""
    # 无效的用户数据 - 密码太短
    invalid_user = {
        "username": "testuser",
        "password": "Pass1",  # 密码少于8个字符
        "email": "test@example.com",
        "age": 25
    }
    
    response = client.post("/users/", json=invalid_user)
    assert response.status_code == 422  # 验证错误状态码
    
    # 无效的用户数据 - 无效的邮箱
    invalid_user = {
        "username": "testuser",
        "password": "Password123",
        "email": "invalid-email",  # 无效的邮箱格式
        "age": 25
    }
    
    response = client.post("/users/", json=invalid_user)
    assert response.status_code == 422
    
    # 无效的用户数据 - 年龄超出范围
    invalid_user = {
        "username": "testuser",
        "password": "Password123",
        "email": "test@example.com",
        "age": 150  # 年龄超过100
    }
    
    response = client.post("/users/", json=invalid_user)
    assert response.status_code == 422

def test_get_user_by_username(client):
    """测试通过用户名获取用户API"""
    # 模拟用户数据
    mock_user = UserResponse(
        username="testuser",
        email="test@example.com",
        age=25
    )
    
    # 模拟用户服务
    with patch.object(user_service, "get_user_by_username", return_value=mock_user):
        response = client.get("/users/testuser")
        assert response.status_code == 200
        data = response.json()
        assert data["username"] == "testuser"
        assert data["email"] == "test@example.com"
        assert data["age"] == 25

def test_update_user(client):
    """测试更新用户API"""
    # 准备更新数据
    update_data = {
        "password": "NewPassword123",
        "email": "updated@example.com",
        "age": 26
    }
    
    # 模拟用户服务
    with patch.object(user_service, "update_user", return_value={"message": "用户更新成功"}):
        response = client.put("/users/testuser", json=update_data)
        assert response.status_code == 200
        assert response.json() == {"message": "用户更新成功"}

def test_delete_user(client):
    """测试删除用户API"""
    # 模拟用户服务
    with patch.object(user_service, "delete_user", return_value={"message": "用户删除成功"}):
        response = client.delete("/users/testuser")
        assert response.status_code == 200
        assert response.json() == {"message": "用户删除成功"}

def test_register_user_validation_details(client):
    """测试用户注册API的Pydantic具体验证错误详情"""
    # 测试密码缺少大写字母
    user_data = {
        "username": "testuser",
        "password": "password123",  # 缺少大写字母
        "email": "test@example.com",
        "age": 25
    }
    
    response = client.post("/users/", json=user_data)
    assert response.status_code == 422
    assert "密码必须包含至少一个大写字母" in response.text
    
    # 测试密码缺少数字
    user_data = {
        "username": "testuser",
        "password": "Password",  # 缺少数字
        "email": "test@example.com",
        "age": 25
    }
    
    response = client.post("/users/", json=user_data)
    assert response.status_code == 422
    assert "密码必须包含至少一个数字" in response.text
    
    # 测试密码长度不足
    user_data = {
        "username": "testuser",
        "password": "Pass1",  # 长度不足8个字符
        "email": "test@example.com",
        "age": 25
    }
    
    response = client.post("/users/", json=user_data)
    assert response.status_code == 422
    assert "String should have at least 8 characters" in response.text or "字符串长度应至少为8个字符" in response.text
    
    # 测试用户名长度不足
    user_data = {
        "username": "u",  # 长度不足3个字符
        "password": "Password123",
        "email": "test@example.com",
        "age": 25
    }
    
    response = client.post("/users/", json=user_data)
    assert response.status_code == 422
    assert "String should have at least 3 characters" in response.text or "字符串长度应至少为3个字符" in response.text

def test_update_user_validation_details(client):
    """测试更新用户API的Pydantic具体验证错误详情"""
    # 测试密码验证 - 缺少大写字母
    update_data = {
        "password": "password123",  # 缺少大写字母
        "email": "update@example.com",
        "age": 30
    }
    
    response = client.put("/users/testuser", json=update_data)
    assert response.status_code == 422
    assert "密码必须包含至少一个大写字母" in response.text
    
    # 测试年龄验证 - 超出范围
    update_data = {
        "password": "Password123",
        "email": "update@example.com",
        "age": 150  # 超过最大值100
    }
    
    response = client.put("/users/testuser", json=update_data)
    assert response.status_code == 422
    assert "Input should be less than or equal to 100" in response.text or "输入应小于等于100" in response.text 
import pytest
from fastapi.testclient import TestClient
import sys
import os
from unittest.mock import patch

# 确保能够导入服务模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from service import login_service
from service.user_service import User

def test_login_success(client, monkeypatch):
    """测试成功登录的情况"""
    # 模拟登录服务
    def mock_login(login_data):
        return {
            "success": True,
            "message": "登录成功"
        }
    
    monkeypatch.setattr(login_service, "login", mock_login)
    
    # 发送测试请求
    response = client.post(
        "/login/",
        json={
            "username": "testuser",
            "password": "password123"
        }
    )
    
    assert response.status_code == 200
    data = response.json()
    assert data["success"] == True
    assert data["message"] == "登录成功"

def test_login_failure(client, monkeypatch):
    """测试登录失败的情况"""
    # 模拟登录服务抛出异常
    def mock_login_failure(login_data):
        from fastapi import HTTPException
        raise HTTPException(status_code=401, detail="用户名或密码无效")
    
    monkeypatch.setattr(login_service, "login", mock_login_failure)
    
    # 发送测试请求
    response = client.post(
        "/login/",
        json={
            "username": "invalid_user",
            "password": "wrong_password"
        }
    )
    
    assert response.status_code == 401
    data = response.json()
    assert "detail" in data
    assert data["detail"] == "用户名或密码无效"

def test_login_service_directly():
    """直接测试登录服务函数"""
    from schemas.login import LoginRequest
    
    # 模拟用户数据
    test_users = [
        User(
            username="testuser", 
            password="Password123", 
            email="test@example.com", 
            age=25
        )
    ]
    
    # 使用patch替换user_service.users全局变量
    with patch('service.user_service.users', test_users):
        # 测试正确的用户名和密码
        login_data = LoginRequest(username="testuser", password="Password123")
        result = login_service.login(login_data)
        assert result.success == True
        assert result.message == "登录成功"
        
        # 测试错误的密码
        login_data = LoginRequest(username="testuser", password="WrongPassword")
        with pytest.raises(Exception) as excinfo:
            login_service.login(login_data)
        assert "401" in str(excinfo.value)
        assert "用户名或密码无效" in str(excinfo.value)
        
        # 测试不存在的用户名
        login_data = LoginRequest(username="nonexistent", password="Password123")
        with pytest.raises(Exception) as excinfo:
            login_service.login(login_data)
        assert "401" in str(excinfo.value)
        assert "用户名或密码无效" in str(excinfo.value)

def test_login_with_empty_credentials(client):
    """测试空凭据的情况"""
    # 测试空用户名
    response = client.post(
        "/login/",
        json={
            "username": "",
            "password": "Password123"
        }
    )
    assert response.status_code == 401
    
    # 测试空密码
    response = client.post(
        "/login/",
        json={
            "username": "testuser",
            "password": ""
        }
    )
    assert response.status_code == 401
    
    # 测试缺少字段
    response = client.post(
        "/login/",
        json={
            "username": "testuser"
        }
    )
    assert response.status_code == 422  # 这里仍然是422，因为缺少字段是由Pydantic验证导致的 
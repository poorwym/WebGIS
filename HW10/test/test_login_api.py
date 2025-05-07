import pytest
from fastapi.testclient import TestClient
import sys
import os

# 确保能够导入服务模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from service import login_service

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
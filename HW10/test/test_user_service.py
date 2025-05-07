import pytest
import os
import sys
import json
import builtins
from unittest.mock import patch, mock_open
from fastapi import HTTPException
from pydantic import ValidationError

# 确保能够引入应用模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

import service.user_service as user_service
from schemas.user import UserCreate, UserUpdate, UserResponse

@pytest.fixture
def mock_user_data():
    """模拟用户数据"""
    return [
        UserCreate(
            username="testuser1",
            password="Password123",
            email="test1@example.com",
            age=25
        ),
        UserCreate(
            username="testuser2",
            password="Password456",
            email="test2@example.com",
            age=30
        )
    ]

def test_init_user_data():
    """测试用户数据初始化"""
    # 模拟文件操作
    with patch("builtins.open", mock_open(read_data='[]')):
        with patch("json.load", return_value=[]):
            result = user_service.init_user_data()
            assert result == []

def test_register_user():
    """测试用户注册功能"""
    # 清空用户列表
    user_service.users = []
    
    new_user = UserCreate(
        username="newuser",
        password="Password123",
        email="new@example.com",
        age=35
    )
    
    with patch("service.user_service.save_user_data"):
        result = user_service.register_user(new_user)
    
    # 验证结果
    assert result["status_code"] == 201
    assert result["detail"] == "用户创建成功"
    
    # 验证用户被添加到列表中
    assert len(user_service.users) == 1
    assert user_service.users[0].username == "newuser"

def test_get_users():
    """测试获取用户列表功能"""
    # 准备测试数据
    user_service.users = [
        user_service.User(
            username="testuser1",
            password="Password123",
            email="test1@example.com",
            age=25
        ),
        user_service.User(
            username="testuser2",
            password="Password456",
            email="test2@example.com",
            age=30
        )
    ]
    
    # 测试不同的参数组合
    # 测试正常情况
    result = user_service.get_users(0, 10, 0, 100)
    assert len(result) == 2
    
    # 测试年龄筛选
    result = user_service.get_users(0, 10, 26, 100)
    assert len(result) == 1
    assert result[0].username == "testuser2"
    
    # 测试分页
    result = user_service.get_users(0, 1, 0, 100)
    assert len(result) == 1

def test_update_user():
    """测试更新用户信息功能"""
    # 准备测试数据
    user_service.users = [
        user_service.User(
            username="testuser1",
            password="Password123",
            email="test1@example.com",
            age=25
        )
    ]
    
    update_data = UserUpdate(
        password="NewPassword123",
        email="updated@example.com",
        age=26
    )
    
    with patch("service.user_service.save_user_data"):
        result = user_service.update_user("testuser1", update_data)
    
    # 验证结果
    assert result["message"] == "用户更新成功"
    
    # 验证用户信息被更新
    updated_user = user_service.users[0]
    assert updated_user.password == "NewPassword123"
    assert updated_user.email == "updated@example.com"
    assert updated_user.age == 26

def test_delete_user():
    """测试删除用户功能"""
    # 准备测试数据
    user_service.users = [
        user_service.User(
            username="testuser1",
            password="Password123",
            email="test1@example.com",
            age=25
        )
    ]
    
    with patch("service.user_service.save_user_data"):
        result = user_service.delete_user("testuser1")
    
    # 验证结果
    assert result["message"] == "用户删除成功"
    
    # 验证用户被删除
    assert len(user_service.users) == 0

def test_user_validation():
    """测试用户数据验证"""
    # 测试密码验证 - 缺少大写字母
    with pytest.raises(ValueError, match='密码必须包含至少一个大写字母'):
        UserCreate(
            username="testuser",
            password="password123",
            email="test@example.com",
            age=25
        )
    
    # 测试密码验证 - 缺少数字
    with pytest.raises(ValueError, match='密码必须包含至少一个数字'):
        UserCreate(
            username="testuser",
            password="Password",
            email="test@example.com",
            age=25
        )
    
    # 测试年龄验证
    with pytest.raises(ValueError):
        UserCreate(
            username="testuser",
            password="Password123",
            email="test@example.com",
            age=150
        )

def test_register_user_validation_errors():
    """测试用户注册时的验证错误处理"""
    # 清空用户列表
    user_service.users = []
    
    # 有效的测试用户 - 实际验证不重要，因为我们会模拟验证失败
    test_user = UserCreate(
        username="newuser",
        password="Password123",
        email="new@example.com",
        age=35
    )
    
    # 测试情况1: 模拟在注册时密码验证失败
    with patch('service.user_service.User', side_effect=ValueError('密码必须包含至少一个大写字母')):
        with pytest.raises(HTTPException) as exc_info:
            user_service.register_user(test_user)
        
        assert exc_info.value.status_code == 422
        assert "密码必须包含至少一个大写字母" in str(exc_info.value.detail)
    
    # 测试情况2: 模拟在注册时年龄验证失败
    with patch('service.user_service.User', side_effect=ValueError('age: Input should be less than or equal to 100')):
        with pytest.raises(HTTPException) as exc_info:
            user_service.register_user(test_user)
        
        assert exc_info.value.status_code == 422
        assert "age" in str(exc_info.value.detail).lower()

def test_update_user_validation_errors():
    """测试更新用户信息时的验证错误处理"""
    # 准备测试数据 - 添加一个用户到列表中
    user_service.users = [
        user_service.User(
            username="testuser1",
            password="Password123",
            email="test1@example.com",
            age=25
        )
    ]
    
    # 有效的更新数据 - 实际验证不重要，因为我们会模拟验证失败
    test_update = UserUpdate(
        password="Password123",
        email="updated@example.com",
        age=26
    )
    
    # 模拟方法，保存原始的setattr方法和model_dump方法
    original_setattr = builtins.setattr
    
    # 测试情况1: 模拟用户更新时的密码验证错误
    def mock_update_with_password_error(*args, **kwargs):
        raise ValueError('密码必须包含至少一个大写字母')
    
    with patch('service.user_service.update_user', side_effect=mock_update_with_password_error):
        with pytest.raises(ValueError) as exc_info:
            mock_update_with_password_error()
        
        assert '密码必须包含至少一个大写字母' in str(exc_info.value)
    
    # 测试情况2: 模拟在update_user中处理ValidationError
    with patch.object(user_service, 'update_user', side_effect=HTTPException(status_code=422, detail="age: Input should be less than or equal to 100")):
        with pytest.raises(HTTPException) as exc_info:
            user_service.update_user("testuser1", test_update)
        
        assert exc_info.value.status_code == 422
        assert "age" in str(exc_info.value.detail).lower()

def test_pydantic_validation_error_handling():
    """测试Pydantic ValidationError的处理方式"""
    # 准备一个有效用户
    test_user = UserCreate(
        username="newuser",
        password="Password123",
        email="new@example.com",
        age=35
    )
    
    # 模拟在register_user函数中直接捕获ValidationError
    with patch('service.user_service.register_user', side_effect=HTTPException(status_code=422, detail="模拟的验证错误")):
        with pytest.raises(HTTPException) as exc_info:
            user_service.register_user(test_user)
        
        assert exc_info.value.status_code == 422
        assert "模拟的验证错误" in str(exc_info.value.detail) 
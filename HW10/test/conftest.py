import pytest
from fastapi.testclient import TestClient
import sys
import os

# 确保能够引入应用模块
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from main import app

@pytest.fixture
def client():
    """提供一个测试客户端实例"""
    return TestClient(app)

@pytest.fixture(scope="function")
def test_app():
    """提供应用实例供测试使用"""
    # 这里可以添加测试前的准备工作
    yield app
    # 这里可以添加测试后的清理工作 
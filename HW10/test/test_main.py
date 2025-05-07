import pytest
from fastapi.testclient import TestClient

def test_read_root(client):
    """测试根路由返回正确的响应"""
    response = client.get("/")
    assert response.status_code == 200
    assert response.json() == {"message": "Hello World"} 
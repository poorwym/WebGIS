from fastapi import FastAPI
from api.users import router as users_router
from api.login import router as login_router
import service.user_service as user_service
import uvicorn
import sys
import os
app = FastAPI()

sys.path.append(os.path.dirname(os.path.abspath(__file__)))

app.include_router(users_router)
app.include_router(login_router)

@app.get("/")
def read_root():
    return {"message": "Hello World"}

if __name__ == "__main__":
    user_service.init_user_data()
    uvicorn.run(app, host="0.0.0.0", port=8000)

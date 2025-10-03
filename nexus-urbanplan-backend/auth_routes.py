from fastapi import APIRouter

auth_router = APIRouter(prefix="/auth", tags=["auth"])

@auth_router.get("/login")
def login():
    return {"msg": "Auth login funcionando!"}

@auth_router.get("/register")
def register():
    return {"msg": "Auth register funcionando!"}
from pydantic import BaseModel, EmailStr

class ReportBase(BaseModel):
    problem_type: str
    description: str
    location: str
    solution: str | None = None

class ReportCreate(ReportBase):
    pass

class ReportResponse(ReportBase):
    id: int

class ReportOut(ReportBase):
    id: int

    class Config:
        from_attributes = True
 
class UserCreate(BaseModel):
    username: str
    email: EmailStr
    password: str

class UserOut(BaseModel):
    id: int
    username: str
    email: EmailStr

    class Config:
        from_attributes = True

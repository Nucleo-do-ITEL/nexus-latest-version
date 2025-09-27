from pydantic import BaseModel

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

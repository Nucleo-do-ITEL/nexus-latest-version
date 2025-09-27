from sqlalchemy import Column, Integer, String, Text
from app.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(Integer, primary_key=True, index=True)
    problem_type = Column(String, index=True)
    description = Column(String, index=False)
    location = Column(String, index=False)
    solution = Column(String, index=True)

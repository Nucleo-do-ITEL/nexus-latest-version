from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from app.database import SessionLocal, engine, Base
from app import models, schemas
from app.routes import reports
from app.routes import users

# cria as tabelas no banco
models.Base.metadata.create_all(bind=engine)

app = FastAPI()

app.include_router(users.router)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # ou ["http://localhost:5173"] se quiser restringir só pro frontend
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# dependência de sessão
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.post("/reports/", response_model=schemas.ReportOut)
def create_report(report: schemas.ReportCreate, db: Session = Depends(get_db)):
    db_report = models.Report(
        problem_type=report.problem_type,
        description=report.description,
        location=report.location,
        solution=report.solution,
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    return db_report

@app.get("/reports/", response_model=list[schemas.ReportOut])
def get_reports(db: Session = Depends(get_db)):
    return db.query(models.Report).all()
# Rotas
app.include_router(reports.router, prefix="/reports", tags=["Reports"])

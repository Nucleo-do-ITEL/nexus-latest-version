from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import ee
from analysis_routes import analysis_router  # Importe aqui (sem auth por enquanto)
from fastapi.staticfiles import StaticFiles
import logging

# Configurar logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Nexus Urban - Análise Ambiental", version="1.0.0")

# Configuração CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inicializar GEE (sem projeto específico; use autenticação default)
try:
    ee.Initialize()
    logger.info("✅ GEE inicializado com sucesso!")
except Exception as e:
    logger.error(f"❌ Erro ao inicializar GEE: {e}")

# Rotas
app.include_router(analysis_router)

# Servir mapas estáticos
app.mount("/static", StaticFiles(directory="static"), name="static")

@app.get("/")
def root():
    return {"message": "🚀 Nexus Urban API - Acesse /docs para testes!"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="127.0.0.1", port=8000)
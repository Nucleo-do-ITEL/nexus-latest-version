# 🌍 Nexus Urban - Análise Ambiental

Plataforma de monitoramento e análise de riscos ambientais utilizando **FastAPI** + **Google Earth Engine** + **Machine Learning**.

## ✨ Funcionalidades

* 🔥 **Ilhas de Calor** – Detecção e métricas de áreas urbanas com altas temperaturas.
* 🌳 **Desmatamento** – Monitoramento de áreas desmatadas (Hansen dataset até 2024).
* 🌊 **Risco de Inundações** – Detecção de áreas suscetíveis a enchentes com base em precipitação e relevo.
* 🌋 **Risco de Incêndio** – Identificação de hotspots de fogo e áreas de vegetação seca.
* 🏔️ **Risco de Deslizamentos** – Áreas com risco de escorregamento de terra.
* 💨 **Qualidade do Ar** – Detecção de poluição atmosférica via profundidade óptica de aerossóis (AOD).
* 🔮 **Previsão via ML** – Modelo de aprendizado de máquina para prever risco de enchentes.
* 🛰️ **Healthcheck (Info)** – Testa conexão com o Google Earth Engine e datasets disponíveis.

## 🛠️ Tecnologias

* [Python 3.11+](https://www.python.org/)
* [FastAPI](https://fastapi.tiangolo.com/)
* [Google Earth Engine (ee)](https://developers.google.com/earth-engine)
* [Geemap](https://geemap.org/)
* [Uvicorn](https://www.uvicorn.org/)
* [scikit-learn](https://scikit-learn.org/)

## 🚀 Como rodar o projeto

### 1️⃣ Clonar o repositório

```bash
git clone https://github.com/Nucleo-do-ITEL/nexus-latest-version.git
cd nexus-latest-version/nexus-urbanplan-backend
```

### 2️⃣ Criar ambiente virtual

```bash
python -m venv .venv
.\.venv\Scripts\activate  # Windows
source .venv/bin/activate # Linux/Mac
```

### 3️⃣ Instalar dependências

```bash
pip install -r requirements.txt
```

### 4️⃣ Configurar Google Earth Engine

Certifique-se de que você tem acesso ao [Google Earth Engine](https://signup.earthengine.google.com/) e rode:

```bash
earthengine authenticate
```

### 5️⃣ Rodar a API

```bash
uvicorn main:app --reload
```

Acesse: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 🌐 Endpoints

### 🔥 Ilhas de Calor

`GET /analysis/heat-islands?lat=-8.8&lon=13.2&radius_km=10&date=2025-10-01`

### 🌳 Desmatamento

`GET /analysis/deforestation?lat=-8.8&lon=13.2&radius_km=10&start_date=2005-01-01&end_date=2024-12-31`

### 🌊 Risco de Inundações

`GET /analysis/flood-risk?lat=-8.8&lon=13.2&radius_km=10&date=2025-10-01`

### 🌋 Risco de Incêndio

`GET /analysis/fire-risk?lat=-8.8&lon=13.2&radius_km=10&date=2025-10-01`

### 🏔️ Risco de Deslizamentos

`GET /analysis/landslide-risk?lat=-8.8&lon=13.2&radius_km=10&date=2025-10-01`

### 💨 Qualidade do Ar

`GET /analysis/air-quality?lat=-8.8&lon=13.2&radius_km=10&date=2025-10-01`

### 🔮 Previsão via ML

`GET /analysis/predict-flood?precip=100&elev=50&temp=25`

### 🛰️ Healthcheck (Info)

`GET /health`

## 📊 Saída dos endpoints

Cada análise retorna:

* **Métricas numéricas** (temperatura média, área de risco, etc.)
* **Link para o mapa HTML gerado** (em `/static/...html`)

Exemplo de resposta:

```json
{
  "message": "✅ Análise de ilhas de calor concluída!",
  "metrics": {
    "temperatura_media_c": 29.4,
    "temperatura_max_c": 36.1,
    "area_ilhas_calor_km2": 12.7
  },
  "map_url": "/static/heat_map_1759497001.html"
}
```

## 📂 Estrutura do Projeto

```
nexus-urbanplan-backend/
│── main.py                # Inicialização da API
│── analysis_routes.py      # Rotas de análise ambiental
│── ml_predictor.py         # Modelo de ML para previsão
│── static/                 # Mapas gerados (HTML)
│── __pycache__/            # Cache Python (ignorado)
│── requirements.txt        # Dependências
```

## 👨‍💻 Contribuição

1. Fork o projeto
2. Crie uma branch (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -m "Adicionei nova feature"`)
4. Push (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request 🚀

## 📜 Licença

Este projeto é mantido pelo **Núcleo do ITEL** e pode ser usado para fins acadêmicos e de pesquisa.


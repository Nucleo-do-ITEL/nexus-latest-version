from fastapi import APIRouter, Query
import ee
import geemap
import os
from datetime import datetime, timedelta
from ml_predictor import predict_flood_risk

analysis_router = APIRouter(prefix="/analysis", tags=["analysis"])

# ---------------------
# 🔥 Detectar Ilhas de Calor
# ---------------------
@analysis_router.get("/heat-islands")
def detect_heat_islands(
    lat: float = Query(..., description="Latitude central"),
    lon: float = Query(..., description="Longitude central"),
    radius_km: float = Query(10, description="Raio em km"),
    date: str = Query(datetime.now().strftime("%Y-%m-%d"), description="Data YYYY-MM-DD")
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        start = datetime.strptime(date, "%Y-%m-%d")
        end = start + timedelta(days=7)

        modis_coll = ee.ImageCollection('MODIS/061/MOD11A1') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi)
        modis_size = modis_coll.size().getInfo()
        if modis_size == 0:
            raise ee.EEException("Nenhum dado MODIS disponível.")
        modis = modis_coll.first()

        lst = modis.select('LST_Day_1km').multiply(0.02).subtract(273.15).clip(roi)

        # Criar hotspots
        hot_spots = lst.gt(30)

        stats = lst.reduceRegion(
            reducer=ee.Reducer.mean().combine(reducer2=ee.Reducer.max(), sharedInputs=True),
            geometry=roi,
            scale=1000,
            maxPixels=1e9
        ).getInfo()

        mean_temp = stats.get('LST_Day_1km', "N/A")
        max_temp = stats.get('LST_Day_1km_max', "N/A")

        hot_area_km2 = hot_spots.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=1000, maxPixels=1e9
        ).getInfo().get('LST_Day_1km', 0) / 1e6

        # Gerar mapa
        m = geemap.Map(center=[lat, lon], zoom=10)
        m.addLayer(lst, {'min': 20, 'max': 40, 'palette': ['blue', 'yellow', 'red']}, 'Temperatura')
        m.addLayer(hot_spots, {'palette': 'red'}, 'Ilhas de Calor')

        map_html = f"heat_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de ilhas de calor concluída!",
            "metrics": {
                "temperatura_media_c": mean_temp,
                "temperatura_max_c": max_temp,
                "area_ilhas_calor_km2": hot_area_km2
            },
            "map_url": f"/static/{map_html}"
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🌳 Detectar Desmatamento (v1.12 para 2024)
# ---------------------
@analysis_router.get("/deforestation")
def detect_deforestation(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(10),
    start_date: str = Query("2001-01-01"),
    end_date: str = Query("2024-12-31")
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        # Dataset atualizado até 2024
        gfc = ee.Image('UMD/hansen/global_forest_change_2024_v1_12')
        tree_cover = gfc.select('treecover2000')
        loss = gfc.select('lossyear')

        forest_mask = tree_cover.gt(30)

        # Converter anos (lossyear=1 para 2001, etc.)
        start_year = int(start_date.split("-")[0]) - 2000
        end_year = int(end_date.split("-")[0]) - 2000

        # Máscara para perda no período e floresta
        loss_in_period = loss.updateMask(loss.gte(start_year)).updateMask(loss.lte(end_year)).updateMask(forest_mask).gt(0)

        loss_area = loss_in_period.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=30, maxPixels=1e9
        ).getInfo().get('lossyear', 0) / 1e6

        m = geemap.Map(center=[lat, lon], zoom=10)
        m.addLayer(loss_in_period, {'palette': 'red'}, 'Desmatamento')
        m.addLayer(forest_mask, {'palette': 'green'}, 'Floresta 2000')

        map_html = f"deforest_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de desmatamento concluída!",
            "metrics": {"area_desmatada_km2": loss_area},
            "map_url": f"/static/{map_html}"
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🌊 Detectar Risco de Inundação
# ---------------------
@analysis_router.get("/flood-risk")
def detect_flood_risk(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(10),
    date: str = Query(datetime.now().strftime("%Y-%m-%d"))
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        start = datetime.strptime(date, "%Y-%m-%d")
        end = start + timedelta(days=7)

        gpm_coll = ee.ImageCollection('NASA/GPM_L3/IMERG_V06/daily') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi)
        gpm_size = gpm_coll.size().getInfo()
        gpm = gpm_coll.first() if gpm_size > 0 else None

        srtm = ee.Image('USGS/SRTMGL1_003').clip(roi)

        if gpm_size > 0:
            high_precip = gpm.select('precipitationCal').gt(50)
            precip_stats = gpm.reduceRegion(ee.Reducer.mean(), roi, scale=10000).getInfo()
            precip_mean = precip_stats.get('precipitationCal', 0)
        else:
            high_precip = ee.Image.constant(0)
            precip_mean = 0

        low_elev = srtm.lt(100)
        flood_risk = high_precip.updateMask(low_elev)

        risk_stats = flood_risk.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=30, maxPixels=1e9
        ).getInfo()
        risk_area = risk_stats.get('precipitationCal', 0) / 1e6

        m = geemap.Map(center=[lat, lon], zoom=10)
        if gpm_size > 0:
            m.addLayer(gpm, {'min': 0, 'max': 100, 'palette': ['blue', 'cyan', 'yellow']}, 'Precipitação')
        m.addLayer(flood_risk, {'palette': 'purple'}, 'Risco de Inundação')
        m.addLayer(srtm, {'min': 0, 'max': 500}, 'Elevação')

        map_html = f"flood_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de risco de inundações concluída!",
            "metrics": {
                "precip_media_mm": precip_mean,
                "area_risco_km2": risk_area
            },
            "map_url": f"/static/{map_html}"
        }

    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🔮 Previsão via ML
# ---------------------
@analysis_router.get("/predict-flood")
def predict_flood(
    precip: float = Query(...),
    elev: float = Query(...),
    temp: float = Query(...)
):
    try:
        prediction = predict_flood_risk(precip, elev, temp)
        return {"message": "✅ Previsão gerada!", **prediction}
    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🌋 Detectar Risco de Incêndio (Fogo)
# ---------------------
@analysis_router.get("/fire-risk")
def detect_fire_risk(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(10),
    date: str = Query(datetime.now().strftime("%Y-%m-%d"))
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        start = datetime.strptime(date, "%Y-%m-%d")
        end = start + timedelta(days=7)

        # MOD14A1 para fogo ativo
        modis_fire_coll = ee.ImageCollection('MODIS/061/MOD14A1') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi)
        modis_fire_size = modis_fire_coll.size().getInfo()
        if modis_fire_size > 0:
            modis_fire = modis_fire_coll.first()
            fire_mask = modis_fire.select('FireMask')
            hot_spots = fire_mask.eq(8).Or(fire_mask.eq(9))
        else:
            hot_spots = ee.Image.constant(0)

        # Landsat para NDVI
        landsat_coll = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi) \
            .filter(ee.Filter.lt('CLOUD_COVER', 20))
        landsat_size = landsat_coll.size().getInfo()
        if landsat_size > 0:
            landsat = landsat_coll.median().clip(roi)
            ndvi = landsat.normalizedDifference(['SR_B5', 'SR_B4'])
            dry_veg = ndvi.lt(0.3)
            ndvi_mean = ndvi.reduceRegion(ee.Reducer.mean(), roi, scale=30).getInfo().get('nd', 0)
        else:
            dry_veg = ee.Image.constant(0)
            ndvi_mean = 0

        fire_risk = hot_spots.updateMask(dry_veg)

        hot_area = hot_spots.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=1000, maxPixels=1e9
        ).getInfo().get('FireMask', 0) / 1e6
        risk_area = fire_risk.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=30, maxPixels=1e9
        ).getInfo().get('FireMask', 0) / 1e6

        m = geemap.Map(center=[lat, lon], zoom=10)
        m.addLayer(hot_spots, {'palette': 'red'}, 'Hotspots de Fogo')
        m.addLayer(fire_risk, {'palette': 'orange'}, 'Risco de Incêndio')
        if landsat_size > 0:
            m.addLayer(ndvi, {'min': -1, 'max': 1, 'palette': ['red', 'yellow', 'green']}, 'NDVI')

        map_html = f"fire_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de risco de incêndio concluída!",
            "metrics": {
                "area_hotspots_km2": hot_area,
                "area_risco_incendio_km2": risk_area,
                "ndvi_medio": ndvi_mean
            },
            "map_url": f"/static/{map_html}"
        }
    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🏔️ Detectar Risco de Deslizamento (Terra)
# ---------------------
@analysis_router.get("/landslide-risk")
def detect_landslide_risk(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(10),
    date: str = Query(datetime.now().strftime("%Y-%m-%d"))
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        start = datetime.strptime(date, "%Y-%m-%d")
        end = start + timedelta(days=7)

        srtm = ee.Image('USGS/SRTMGL1_003').clip(roi)
        slope = ee.Terrain.slope(srtm)

        gpm_coll = ee.ImageCollection('NASA/GPM_L3/IMERG_V06/daily') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi)
        gpm_size = gpm_coll.size().getInfo()
        if gpm_size > 0:
            gpm = gpm_coll.first()
            precip = gpm.select('precipitationCal').clip(roi)
            high_precip = precip.gt(50)
            precip_mean = precip.reduceRegion(ee.Reducer.mean(), roi, scale=10000).getInfo().get('precipitationCal', 0)
        else:
            high_precip = ee.Image.constant(0)
            precip_mean = 0
            precip = ee.Image.constant(0)

        landsat_coll = ee.ImageCollection('LANDSAT/LC08/C02/T1_L2') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi) \
            .filter(ee.Filter.lt('CLOUD_COVER', 20))
        landsat_size = landsat_coll.size().getInfo()
        if landsat_size > 0:
            landsat = landsat_coll.median().clip(roi)
            ndvi = landsat.normalizedDifference(['SR_B5', 'SR_B4'])
            low_veg = ndvi.lt(0.4)
        else:
            low_veg = ee.Image.constant(0)

        steep_slope = slope.gt(30)
        landslide_risk = steep_slope.updateMask(high_precip).updateMask(low_veg)

        risk_area = landslide_risk.multiply(ee.Image.pixelArea()).reduceRegion(
            ee.Reducer.sum(), roi, scale=30, maxPixels=1e9
        ).getInfo().get('slope', 0) / 1e6
        slope_mean = slope.reduceRegion(ee.Reducer.mean(), roi, scale=30).getInfo().get('slope', 0)

        m = geemap.Map(center=[lat, lon], zoom=10)
        m.addLayer(srtm, {'min': 0, 'max': 500}, 'Elevação')
        m.addLayer(landslide_risk, {'palette': 'brown'}, 'Risco de Deslizamento')
        if gpm_size > 0:
            m.addLayer(precip, {'min': 0, 'max': 100, 'palette': ['blue', 'cyan', 'yellow']}, 'Precipitação')

        map_html = f"landslide_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de risco de deslizamento concluída!",
            "metrics": {
                "area_risco_km2": risk_area,
                "inclinação_media_graus": slope_mean,
                "precip_media_mm": precip_mean
            },
            "map_url": f"/static/{map_html}"
        }
    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 💨 Detectar Qualidade do Ar
# ---------------------
@analysis_router.get("/air-quality")
def detect_air_quality(
    lat: float = Query(...),
    lon: float = Query(...),
    radius_km: float = Query(10),
    date: str = Query(datetime.now().strftime("%Y-%m-%d"))
):
    try:
        os.makedirs("static", exist_ok=True)
        point = ee.Geometry.Point(lon, lat)
        roi = point.buffer(radius_km * 1000).bounds()

        start = datetime.strptime(date, "%Y-%m-%d")
        end = start + timedelta(days=7)

        modis_aod_coll = ee.ImageCollection('MODIS/061/MCD19A2') \
            .filterDate(start.strftime("%Y-%m-%d"), end.strftime("%Y-%m-%d")) \
            .filterBounds(roi)
        modis_aod_size = modis_aod_coll.size().getInfo()
        if modis_aod_size > 0:
            modis_aod = modis_aod_coll.first()
            aod = modis_aod.select('Optical_Depth_047').multiply(0.001).clip(roi)
            high_pollution = aod.gt(0.5)
            aod_mean = aod.reduceRegion(ee.Reducer.mean(), roi, scale=1000).getInfo().get('Optical_Depth_047', 0) * 0.001
            poll_stats = high_pollution.multiply(ee.Image.pixelArea()).reduceRegion(
                ee.Reducer.sum(), roi, scale=1000, maxPixels=1e9
            ).getInfo()
            poll_area = poll_stats.get('Optical_Depth_047', 0) * 0.001 / 1e6
        else:
            aod_mean = 0
            poll_area = 0
            aod = ee.Image.constant(0)
            high_pollution = ee.Image.constant(0)

        m = geemap.Map(center=[lat, lon], zoom=10)
        m.addLayer(aod, {'min': 0, 'max': 2, 'palette': ['green', 'yellow', 'red']}, 'AOD')
        m.addLayer(high_pollution, {'palette': 'gray'}, 'Alta Poluição')

        map_html = f"air_map_{int(datetime.now().timestamp())}.html"
        m.to_html(f"static/{map_html}")

        return {
            "message": "✅ Análise de qualidade do ar concluída!",
            "metrics": {
                "aod_medio": aod_mean,
                "area_alta_poluicao_km2": poll_area
            },
            "map_url": f"/static/{map_html}"
        }
    except Exception as e:
        return {"error": str(e)}


# ---------------------
# 🛰️ Info / Healthcheck
# ---------------------
@analysis_router.get("/info")
def gee_info():
    """
    Endpoint de healthcheck para verificar se o Google Earth Engine está ativo
    e listar algumas coleções disponíveis.
    """
    try:
        now = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

        # Testar coleção Sentinel-2
        s2_coll = ee.ImageCollection("COPERNICUS/S2_SR_HARMONIZED") \
            .filterDate("2022-01-01", "2022-01-07") \
            .filterBounds(ee.Geometry.Point([-46.6333, -23.5505]))  # São Paulo
        s2 = s2_coll.first()
        s2_size = s2_coll.size().getInfo()
        s2_info = s2.getInfo() if s2_size > 0 else None

        return {
            "status": "✅ GEE ativo!",
            "time": now,
            "datasets_disponiveis": [
                "MODIS/061/MOD11A1 - Land Surface Temperature",
                "UMD/hansen/global_forest_change_2024_v1_12 - Desmatamento (até 2024)",
                "NASA/GPM_L3/IMERG_V06/daily - Precipitação",
                "COPERNICUS/S2_SR_HARMONIZED - Sentinel-2",
                "LANDSAT/LC08/C02/T1_L2 - Landsat Surface Reflectance (NDVI)",
                "MODIS/061/MOD14A1 - Active Fire Detection",
                "MODIS/061/MCD19A2 - Aerosol Optical Depth (AOD)",
                "USGS/SRTMGL1_003 - Digital Elevation Model"
            ],
            "teste_sentinel2": {
                "id": s2_info["id"] if s2_info else "Nenhum dado encontrado",
                "bands": [b["id"] for b in s2_info["bands"]] if s2_info else []
            }
        }
    except Exception as e:
        return {"status": "❌ Erro ao acessar GEE", "detalhes": str(e)}

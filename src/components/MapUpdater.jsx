import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";

// Componente para atualizar o tile layer
function MapUpdater({ activeMap }) {
  const map = useMap();
  
  useEffect(() => {
    // Remove todas as camadas existentes
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Adiciona a nova camada base
    const baseLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap contributors'
    });

    // Adiciona a camada específica baseada na seleção
    let overlayLayer;
    
    switch(activeMap) {
      case 'temperature_terra':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'MODIS/061/MOD11A1',
          access_token: 'YOUR_EE_TOKEN' // Você precisará configurar o token
        });
        break;
      
      case 'temperature_aqua':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'MODIS/061/MYD11A1',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'era5_climate':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'ECMWF/ERA5_LAND/DAILY_AGGR',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'sentinel3_color':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'COPERNICUS/S3/OLCI',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'landsat5':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'LANDSAT/LT05/C02/T1_L2',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'surface_water':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'JRC/GSW1_4/GlobalSurfaceWater',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'flood_database':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'GLOBAL_FLOOD_DB/MODIS_EVENTS/V1',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'sentinel1_radar':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'COPERNICUS/S1_GRD',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'forest_change':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'UMD/hansen/global_forest_change_2024_v1_12',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'elevation':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'USGS/SRTMGL1_003',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      case 'vegetation':
        overlayLayer = L.tileLayer(`https://earthengine.googleapis.com/v1alpha/projects/earthengine-legacy/maps/{mapid}/tiles/{z}/{x}/{y}?access_token={access_token}`, {
          mapid: 'MODIS/061/MOD13Q1',
          access_token: 'YOUR_EE_TOKEN'
        });
        break;
      
      default:
        overlayLayer = baseLayer;
    }

    if (overlayLayer && activeMap !== 'base') {
      map.addLayer(overlayLayer);
    } else {
      map.addLayer(baseLayer);
    }

  }, [map, activeMap]);

  return null;
}

export default function Monitoramento() {
  const [activeMap, setActiveMap] = useState('base');
  
  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  const mapLayers = [
    { id: 'base', name: 'Mapa Base (OSM)', emoji: '🗺️' },
    { id: 'temperature_terra', name: 'Temperatura Terra (MOD11A1)', emoji: '🌡️' },
    { id: 'temperature_aqua', name: 'Temperatura Aqua (MYD11A1)', emoji: '🌡️' },
    { id: 'era5_climate', name: 'Reanálise Climática (ERA5)', emoji: '🌤️' },
    { id: 'sentinel3_color', name: 'Cor Oceano/Terra (Sentinel-3)', emoji: '🌊' },
    { id: 'landsat5', name: 'Landsat 5', emoji: '🛰️' },
    { id: 'surface_water', name: 'Água Superficial (JRC)', emoji: '💧' },
    { id: 'flood_database', name: 'Banco de Dados de Inundação', emoji: '🌊' },
    { id: 'sentinel1_radar', name: 'Radar (Sentinel-1)', emoji: '📡' },
    { id: 'forest_change', name: 'Mudança Florestal (Hansen)', emoji: '🌳' },
    { id: 'elevation', name: 'Elevação (SRTM)', emoji: '⛰️' },
    { id: 'vegetation', name: 'Vegetação (MOD13Q1)', emoji: '🌿' }
  ];

  return (
    <div className="p-6 flex flex-col">
      {/* Botões de seleção de mapa */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold mb-2">Selecione o tipo de mapa:</h3>
        <div className="flex flex-wrap gap-2 mb-4">
          {mapLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveMap(layer.id)}
              className={`px-3 py-2 rounded text-sm font-medium transition-colors ${
                activeMap === layer.id 
                  ? 'bg-blue-600 text-white' 
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
              }`}
            >
              {layer.emoji} {layer.name}
            </button>
          ))}
        </div>
        
        <div className="bg-blue-50 p-3 rounded mb-4">
          <p className="text-sm text-blue-800">
            <strong>Mapa selecionado:</strong> {mapLayers.find(l => l.id === activeMap)?.name}
            {activeMap !== 'base' && (
              <span className="block text-xs mt-1">
                ⚠️ Nota: Para acessar os dados do Google Earth Engine, você precisará configurar a autenticação.
              </span>
            )}
          </p>
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white shadow rounded overflow-hidden flex">
        <MapContainer
          center={[-15.793889, -47.882778]}
          zoom={4}
          style={{ height: "500px", width: "100%" }}
        >
          <MapUpdater activeMap={activeMap} />
          <Marker position={[-15.793889, -47.882778]} icon={customIcon}>
            <Popup>
              <strong>Exemplo:</strong> Área monitorada em Brasília.
            </Popup>
          </Marker>
        </MapContainer>
      </div>
    </div>
  );
}
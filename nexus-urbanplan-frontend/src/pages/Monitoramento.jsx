import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import { Icon } from "leaflet";
import { useState, useEffect } from "react";

// Componente para controlar a visualização do mapa
function MapView({ activeMap, isGlobalView }) {
  const map = useMap();
  
  useEffect(() => {
    if (isGlobalView) {
      map.setView([20, 0], 2); // Vista global
    } else {
      map.setView([-11.2027, 17.8739], 6); // Angola
    }
  }, [map, activeMap, isGlobalView]);

  return null;
}

// Componente principal do mapa
function MapController({ activeMap }) {
  const map = useMap();

  useEffect(() => {
    // Remove apenas as camadas de tile, mantendo marcadores
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Adiciona a nova camada baseada na seleção
    let tileUrl, attribution;

    switch(activeMap) {
      case 'mod11a1_temperature':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'MOD11A1.061 Terra LST | &copy; NASA';
        break;
      
      case 'temperature_heatmap':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = 'Mapa de Calor Temperatura | &copy; OpenStreetMap';
        break;
      
      case 'grace_gravity':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}';
        attribution = 'GRACE Gravity Field | &copy; NASA/DLR';
        break;
      
      case 'air_pollution':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = 'Qualidade do Ar | &copy; Copernicus Atmosphere';
        break;
      
      case 'sentinel3_color':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'Sentinel-3 OLCI | &copy; ESA';
        break;
      
      case 'surface_water':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = 'JRC Surface Water | &copy; EU';
        break;
      
      case 'forest_change':
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = 'Hansen Forest Change | &copy; UMD';
        break;
      
      case 'elevation':
        tileUrl = 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png';
        attribution = 'SRTM Elevation 30m | &copy; NASA';
        break;
      
      case 'vegetation':
        tileUrl = 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
        attribution = 'MOD13Q1 Vegetation | &copy; NASA';
        break;
      
      default: // base
        tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
        attribution = '&copy; OpenStreetMap contributors';
    }

    const newTileLayer = L.tileLayer(tileUrl, { attribution });
    map.addLayer(newTileLayer);

  }, [map, activeMap]);

  return null;
}

// Componente para overlay de calor de temperatura
function TemperatureHeatmap({ activeMap, isGlobalView }) {
  const map = useMap();

  useEffect(() => {
    if (activeMap === 'temperature_heatmap') {
      let temperatureZones;
      
      if (isGlobalView) {
        // Zonas de temperatura globais
        temperatureZones = [
          {
            coords: [[90, -180], [60, 180]], // Ártico
            color: '#1e3a8a',
            temp: '-40°C to -20°C'
          },
          {
            coords: [[60, -180], [45, 180]], // Subpolar
            color: '#3b82f6',
            temp: '-20°C to 0°C'
          },
          {
            coords: [[45, -180], [30, 180]], // Temperada
            color: '#60a5fa',
            temp: '0°C to 15°C'
          },
          {
            coords: [[30, -180], [15, 180]], // Subtropical
            color: '#fbbf24',
            temp: '15°C to 25°C'
          },
          {
            coords: [[15, -180], [0, 180]], // Tropical
            color: '#f59e0b',
            temp: '25°C to 30°C'
          },
          {
            coords: [[0, -180], [-15, 180]], // Tropical Sul
            color: '#ef4444',
            temp: '25°C to 35°C'
          },
          {
            coords: [[-15, -180], [-90, 180]], // Antártico
            color: '#1e3a8a',
            temp: '-40°C to -20°C'
          }
        ];
      } else {
        // Zonas de temperatura para Angola
        temperatureZones = [
          {
            coords: [[-5.0, 11.0], [-8.0, 14.0]], // Norte - Alta temperatura
            color: '#ff4444',
            temp: '32-35°C'
          },
          {
            coords: [[-8.0, 11.0], [-12.0, 16.0]], // Centro-Norte - Temperatura média-alta
            color: '#ff9966',
            temp: '28-32°C'
          },
          {
            coords: [[-12.0, 13.0], [-15.0, 18.0]], // Centro - Temperatura média
            color: '#ffcc00',
            temp: '24-28°C'
          },
          {
            coords: [[-15.0, 13.0], [-18.0, 16.0]], // Sul - Temperatura mais baixa
            color: '#66ccff',
            temp: '20-24°C'
          },
          {
            coords: [[-12.0, 18.0], [-16.0, 24.0]], // Leste - Temperatura variável
            color: '#99cc66',
            temp: '22-26°C'
          }
        ];
      }

      const zones = temperatureZones.map(zone => 
        L.rectangle(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.6,
          weight: 1
        }).addTo(map)
      );

      // Adicionar legenda de temperatura
      const legend = L.control({ position: 'bottomright' });
      
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend bg-white p-4 rounded-lg shadow-lg border border-gray-300');
        div.innerHTML = `
          <h4 class="font-bold mb-3 text-gray-800">🌡️ Mapa de Calor - Temperatura</h4>
          ${temperatureZones.map(zone => `
            <div class="flex items-center mb-2">
              <div class="w-6 h-6 mr-3 border border-gray-400" style="background-color: ${zone.color}"></div>
              <span class="text-sm text-gray-700">${zone.temp}</span>
            </div>
          `).join('')}
          <div class="mt-3 text-xs text-gray-500">
            Dados baseados em MOD11A1.061 e estações meteorológicas
          </div>
        `;
        return div;
      };
      
      legend.addTo(map);

      return () => {
        zones.forEach(zone => map.removeLayer(zone));
        map.removeControl(legend);
      };
    }
  }, [map, activeMap, isGlobalView]);

  return null;
}

// Componente para overlay de poluição do ar
function AirPollutionOverlay({ activeMap, isGlobalView }) {
  const map = useMap();

  useEffect(() => {
    if (activeMap === 'air_pollution') {
      let pollutionZones;
      let stations;

      if (isGlobalView) {
        // Dados globais de poluição
        pollutionZones = [
          {
            coords: [[50, -10], [60, 40]], // Europa - Moderada
            color: '#ff9966',
            quality: 'Moderada',
            pollutants: 'PM2.5, NO₂'
          },
          {
            coords: [[20, 70], [40, 140]], // Ásia - Alta
            color: '#ff4444',
            quality: 'Pobre',
            pollutants: 'PM2.5, SO₂'
          },
          {
            coords: [[-35, 110], [-10, 155]], // Austrália - Boa
            color: '#66cc66',
            quality: 'Boa',
            pollutants: 'Baixos níveis'
          },
          {
            coords: [[-60, -80], [30, -30]], // Américas - Variável
            color: '#ff9966',
            quality: 'Moderada',
            pollutants: 'O₃, PM10'
          }
        ];

        stations = [
          { pos: [51.5074, -0.1278], name: "Londres", aqi: 78, mainPollutant: "PM2.5" },
          { pos: [39.9042, 116.4074], name: "Beijing", aqi: 156, mainPollutant: "PM2.5" },
          { pos: [40.7128, -74.0060], name: "Nova York", aqi: 67, mainPollutant: "O₃" },
          { pos: [-33.8688, 151.2093], name: "Sydney", aqi: 45, mainPollutant: "PM10" },
          { pos: [-23.5505, -46.6333], name: "São Paulo", aqi: 89, mainPollutant: "NO₂" }
        ];
      } else {
        // Dados de poluição para Angola
        pollutionZones = [
          {
            coords: [[-8.0, 12.0], [-9.5, 14.0]], // Luanda - Alta poluição
            color: '#ff4444',
            quality: 'Pobre',
            pollutants: 'PM2.5, NO₂, SO₂'
          },
          {
            coords: [[-12.5, 15.5], [-13.5, 16.5]], // Huambo - Moderada
            color: '#ff9966',
            quality: 'Moderada',
            pollutants: 'PM10, O₃'
          },
          {
            coords: [[-14.5, 13.0], [-15.5, 14.5]], // Lubango - Boa
            color: '#66cc66',
            quality: 'Boa',
            pollutants: 'Baixos níveis'
          },
          {
            coords: [[-6.5, 12.0], [-8.0, 13.5]], // Cabinda - Industrial
            color: '#ff6666',
            quality: 'Insalubre',
            pollutants: 'SO₂, CO'
          }
        ];

        stations = [
          { pos: [-8.8383, 13.2344], name: "Luanda", aqi: 156, mainPollutant: "PM2.5" },
          { pos: [-12.7761, 15.7395], name: "Huambo", aqi: 78, mainPollutant: "O₃" },
          { pos: [-14.9172, 13.5000], name: "Lubango", aqi: 45, mainPollutant: "PM10" },
          { pos: [-7.3000, 12.6000], name: "Cabinda", aqi: 123, mainPollutant: "SO₂" }
        ];
      }

      const zones = pollutionZones.map(zone => 
        L.rectangle(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.5,
          weight: 2
        }).addTo(map)
      );

      const stationMarkers = stations.map(station => 
        L.circleMarker(station.pos, {
          radius: 8,
          fillColor: station.aqi > 100 ? '#ff4444' : station.aqi > 50 ? '#ff9966' : '#66cc66',
          color: '#000',
          weight: 1,
          opacity: 1,
          fillOpacity: 0.8
        }).addTo(map).bindPopup(`
          <div class="text-center">
            <strong>🏭 ${station.name}</strong><br/>
            <span style="color: ${station.aqi > 100 ? '#ff4444' : station.aqi > 50 ? '#ff9966' : '#66cc66'}">
              IQA: ${station.aqi}
            </span><br/>
            <small>Poluente principal: ${station.mainPollutant}</small>
          </div>
        `)
      );

      // Legenda de qualidade do ar
      const legend = L.control({ position: 'bottomright' });
      
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend bg-white p-4 rounded-lg shadow-lg border border-gray-300');
        div.innerHTML = `
          <h4 class="font-bold mb-3 text-gray-800">🏭 Qualidade do Ar</h4>
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-3 bg-green-500 border border-gray-400"></div>
            <span class="text-sm text-gray-700">0-50: Boa</span>
          </div>
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-3 bg-yellow-500 border border-gray-400"></div>
            <span class="text-sm text-gray-700">51-100: Moderada</span>
          </div>
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-3 bg-orange-500 border border-gray-400"></div>
            <span class="text-sm text-gray-700">101-150: Insalubre</span>
          </div>
          <div class="flex items-center mb-3">
            <div class="w-6 h-6 mr-3 bg-red-500 border border-gray-400"></div>
            <span class="text-sm text-gray-700">151+: Pobre</span>
          </div>
          <div class="text-xs text-gray-500">
            Dados: Copernicus Atmosphere Monitoring Service
          </div>
        `;
        return div;
      };
      
      legend.addTo(map);

      return () => {
        zones.forEach(zone => map.removeLayer(zone));
        stationMarkers.forEach(marker => map.removeLayer(marker));
        map.removeControl(legend);
      };
    }
  }, [map, activeMap, isGlobalView]);

  return null;
}

// Componente para overlay GRACE
function GRACEGravityOverlay({ activeMap, isGlobalView }) {
  const map = useMap();

  useEffect(() => {
    if (activeMap === 'grace_gravity') {
      let graceZones;

      if (isGlobalView) {
        // Dados GRACE globais
        graceZones = [
          {
            coords: [[90, -180], [60, 180]], // Regiões polares
            color: '#3366cc',
            anomaly: '+25 μGal',
            description: 'Camadas de gelo'
          },
          {
            coords: [[-10, -80], [10, -35]], // Bacia Amazônica
            color: '#6699ff',
            anomaly: '+15 μGal',
            description: 'Água subterrânea'
          },
          {
            coords: [[-10, 10], [10, 50]], // Bacia do Congo
            color: '#6699ff',
            anomaly: '+12 μGal',
            description: 'Massa florestal'
          },
          {
            coords: [[-25, 115], [-10, 150]], // Austrália
            color: '#99ccff',
            anomaly: '-8 μGal',
            description: 'Deficiência de água'
          }
        ];
      } else {
        // Dados GRACE para Angola
        graceZones = [
          {
            coords: [[-9.0, 12.0], [-11.0, 14.0]], // Bacia do Congo
            color: '#3366cc',
            anomaly: '+15 μGal',
            description: 'Alta densidade'
          },
          {
            coords: [[-12.0, 13.0], [-15.0, 16.0]], // Planalto Central
            color: '#6699ff',
            anomaly: '+8 μGal',
            description: 'Densidade média'
          },
          {
            coords: [[-15.0, 11.0], [-18.0, 13.0]], // Bacia do Kalahari
            color: '#99ccff',
            anomaly: '-5 μGal',
            description: 'Baixa densidade'
          }
        ];
      }

      const zones = graceZones.map(zone => 
        L.rectangle(zone.coords, {
          color: zone.color,
          fillColor: zone.color,
          fillOpacity: 0.4,
          weight: 2,
          dashArray: '5, 5'
        }).addTo(map).bindTooltip(`
          <strong>${zone.anomaly}</strong><br/>
          <small>${zone.description}</small>
        `)
      );

      // Legenda GRACE
      const legend = L.control({ position: 'bottomright' });
      
      legend.onAdd = function () {
        const div = L.DomUtil.create('div', 'info legend bg-white p-4 rounded-lg shadow-lg border border-gray-300');
        div.innerHTML = `
          <h4 class="font-bold mb-3 text-gray-800">🛰️ GRACE Gravity</h4>
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-3 bg-blue-800 border border-gray-400"></div>
            <span class="text-sm text-gray-700">Anomalia positiva</span>
          </div>
          <div class="flex items-center mb-2">
            <div class="w-6 h-6 mr-3 bg-blue-400 border border-gray-400"></div>
            <span class="text-sm text-gray-700">Anomalia neutra</span>
          </div>
          <div class="flex items-center mb-3">
            <div class="w-6 h-6 mr-3 bg-blue-200 border border-gray-400"></div>
            <span class="text-sm text-gray-700">Anomalia negativa</span>
          </div>
          <div class="text-xs text-gray-500">
            Dados: GRACE-FO NASA/DLR<br/>
            Variações do campo gravitacional
          </div>
        `;
        return div;
      };
      
      legend.addTo(map);

      return () => {
        zones.forEach(zone => map.removeLayer(zone));
        map.removeControl(legend);
      };
    }
  }, [map, activeMap, isGlobalView]);

  return null;
}

export default function Monitoramento() {
  const [activeMap, setActiveMap] = useState('mod11a1_temperature');
  const [isGlobalView, setIsGlobalView] = useState(false);
  
  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  // Coordenadas
  const angolaCenter = [-11.2027, 17.8739];
  const globalCenter = [20, 0];
  const luandaPosition = [-8.8383, 13.2344];
  const huamboPosition = [-12.7761, 15.7395];
  const lubangoPosition = [-14.9172, 13.5000];

  // Pontos de referência globais
  const globalMarkers = [
    { pos: [51.5074, -0.1278], name: "Londres", emoji: "🌧️" },
    { pos: [40.7128, -74.0060], name: "Nova York", emoji: "🏙️" },
    { pos: [35.6762, 139.6503], name: "Tóquio", emoji: "🗾" },
    { pos: [-33.8688, 151.2093], name: "Sydney", emoji: "🌊" },
    { pos: [-15.7975, -47.8919], name: "Brasília", emoji: "🌴" }
  ];

  const mapLayers = [
    { id: 'mod11a1_temperature', name: 'Terra LST', emoji: '🌡️', description: 'Temperatura da Superfície - Satélite Terra' },
    { id: 'temperature_heatmap', name: 'Mapa de Calor', emoji: '🔥', description: 'Distribuição de Temperatura por Cores' },
    { id: 'grace_gravity', name: 'GRACE Gravity', emoji: '🛰️', description: 'Campo Gravitacional e Massa Terrestre' },
    { id: 'air_pollution', name: 'Qualidade do Ar', emoji: '🏭', description: 'Poluição Atmosférica e Composição do Ar' },
    { id: 'sentinel3_color', name: 'Sentinel-3', emoji: '🌊', description: 'Cor do Oceano e Terra' },
    { id: 'surface_water', name: 'Água Superficial', emoji: '💧', description: 'Mapamento de Recursos Hídricos' },
    { id: 'forest_change', name: 'Florestas', emoji: '🌳', description: 'Mudança Florestal 2000-2024' },
    { id: 'elevation', name: 'Elevação', emoji: '⛰️', description: 'Modelo Digital de Elevação' },
    { id: 'vegetation', name: 'Vegetação', emoji: '🌿', description: 'Índices de Vegetação' },
    { id: 'base', name: 'Mapa Base', emoji: '🗺️', description: 'OpenStreetMap' }
  ];

  const getCurrentMapInfo = () => {
    return mapLayers.find(l => l.id === activeMap);
  };

  const currentMap = getCurrentMapInfo();

  const toggleView = () => {
    setIsGlobalView(!isGlobalView);
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mapa de Monitoramento 🌍</h2>
      
      {/* Informações do mapa atual */}
      <div className="bg-gradient-to-r from-blue-50 to-green-50 p-4 rounded-lg mb-4 border border-blue-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-semibold text-gray-800 text-lg">
              {currentMap?.emoji} {currentMap?.name}
            </h3>
            <p className="text-gray-600 text-sm mt-1">
              {currentMap?.description}
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={toggleView}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                isGlobalView 
                  ? 'bg-green-500 text-white hover:bg-green-600' 
                  : 'bg-blue-500 text-white hover:bg-blue-600'
              }`}
            >
              {isGlobalView ? '🌍 Vista Global' : '🇦🇴 Angola'}
            </button>
            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
              {isGlobalView ? '🌐 Mundo Inteiro' : '📍 Angola'}
            </span>
          </div>
        </div>
      </div>

      {/* Botões de seleção de mapa */}
      <div className="mb-6">
        <h3 className="text-lg font-semibold mb-3">Camadas de Monitoramento:</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3 mb-4">
          {mapLayers.map((layer) => (
            <button
              key={layer.id}
              onClick={() => setActiveMap(layer.id)}
              className={`p-3 rounded-lg text-sm font-medium transition-all duration-200 flex flex-col items-center text-center ${
                activeMap === layer.id 
                  ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg transform scale-105' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200 hover:border-blue-300 hover:shadow-md'
              }`}
            >
              <span className="text-lg mb-1">{layer.emoji}</span>
              <span className="font-semibold">{layer.name}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Mapa */}
      <div className="bg-white shadow-xl rounded-lg overflow-hidden border border-gray-200">
        <MapContainer
          center={isGlobalView ? globalCenter : angolaCenter}
          zoom={isGlobalView ? 2 : 6}
          style={{ height: "500px", width: "100%" }}
          scrollWheelZoom={true}
          worldCopyJump={isGlobalView}
        >
          <MapController activeMap={activeMap} />
          <MapView activeMap={activeMap} isGlobalView={isGlobalView} />
          <TemperatureHeatmap activeMap={activeMap} isGlobalView={isGlobalView} />
          <AirPollutionOverlay activeMap={activeMap} isGlobalView={isGlobalView} />
          <GRACEGravityOverlay activeMap={activeMap} isGlobalView={isGlobalView} />
          
          {/* Marcadores - Angola */}
          {!isGlobalView && (
            <>
              <Marker position={luandaPosition} icon={customIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-lg">🏙️ Luanda</strong>
                    <p className="mt-1">Capital de Angola</p>
                  </div>
                </Popup>
              </Marker>
              
              <Marker position={huamboPosition} icon={customIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-lg">🏔️ Huambo</strong>
                    <p className="mt-1">Centro agrícola</p>
                  </div>
                </Popup>
              </Marker>

              <Marker position={lubangoPosition} icon={customIcon}>
                <Popup>
                  <div className="text-center">
                    <strong className="text-lg">⛰️ Lubango</strong>
                    <p className="mt-1">Região montanhosa</p>
                  </div>
                </Popup>
              </Marker>
            </>
          )}
          
          {/* Marcadores - Global */}
          {isGlobalView && globalMarkers.map((marker, index) => (
            <Marker key={index} position={marker.pos} icon={customIcon}>
              <Popup>
                <div className="text-center">
                  <strong className="text-lg">{marker.emoji} {marker.name}</strong>
                  <p className="mt-1">Ponto de referência global</p>
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>

      {/* Informações técnicas */}
      <div className="mt-6 bg-gray-50 p-4 rounded-lg border border-gray-200">
        <h4 className="font-semibold text-gray-800 mb-3">📋 Informações Técnicas</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
          <div>
            <p><strong>🌡️ Mapa de Calor:</strong> Cores representam temperaturas (vermelho=alta, azul=baixa)</p>
            <p><strong>🏭 Qualidade do Ar:</strong> IQA baseado em PM2.5, O₃, NO₂, SO₂</p>
          </div>
          <div>
            <p><strong>🛰️ GRACE:</strong> Medições do campo gravitacional terrestre</p>
            <p><strong>🔄 Vista:</strong> {isGlobalView ? 'Global' : 'Angola'} - Use o botão para alternar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Icon } from "leaflet";

export default function Monitoramento() {
  // exemplo de marcador personalizado
  const customIcon = new Icon({
    iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
    iconSize: [25, 41],
    iconAnchor: [12, 41],
  });

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Mapa de Monitoramento 🌍</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar Filtros */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Filtros</h3>
            <label className="block text-sm">País</label>
            <select className="w-full border rounded p-2 mb-3">
              <option>Todos</option>
              <option>Brasil</option>
              <option>Portugal</option>
              <option>EUA</option>
            </select>

            <label className="block text-sm">Status</label>
            <div className="space-y-1 text-sm">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" /> Críticos
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" /> Moderados
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Leves
              </label>
            </div>
          </div>

          {/* Estatísticas */}
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Estatísticas Globais</h3>
            <p>🌍 Terra – <span className="text-red-500">2 críticos</span></p>
            <p>💧 Água – <span className="text-red-500">47 críticos</span></p>
            <p>🌬️ Ar – <span className="text-red-500">2 críticos</span></p>
            <p>🔥 Fogo – <span className="text-red-500">47 críticos</span></p>
          </div>
        </div>

        {/* Mapa */}
        <div className="md:col-span-3 bg-white shadow rounded overflow-hidden">
          <MapContainer
            center={[-15.793889, -47.882778]} // Brasília como exemplo
            zoom={4}
            style={{ height: "500px", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; <a href='https://www.openstreetmap.org/'>OpenStreetMap</a> contributors"
            />
            <Marker position={[-15.793889, -47.882778]} icon={customIcon}>
              <Popup>
                <strong>Exemplo:</strong> Área monitorada em Brasília.
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </div>
  );
}

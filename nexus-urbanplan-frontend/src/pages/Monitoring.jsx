import { useEffect } from "react";
import L from "leaflet";
import { getReports } from "../api/reports";

function Monitoring() {
  useEffect(() => {
    // cria o mapa
    const map = L.map("map").setView([0, 0], 2);

    // camada base
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(map);

    // carregar reports
    getReports().then((reports) => {
      reports.forEach((report) => {
        L.marker([report.latitude, report.longitude])
          .addTo(map)
          .bindPopup(`<b>${report.problem_type}</b><br>${report.description}`);
      });
    });
  }, []);

  return (
    <div className="container">
      <h2>Mapa de Monitoramento</h2>
      <div id="map" style={{ height: "500px", borderRadius: "8px" }}></div>
    </div>
  );
}

export default Monitoring;

const API_URL = "http://localhost:8000"; // backend FastAPI

// Criar novo report
export async function createReport(report) {
  const response = await fetch(`${API_URL}/reports/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(report),
  });
  if (!response.ok) {
    throw new Error("Erro ao criar report");
  }
  return response.json();
}

// Buscar todos os reports
export async function getReports() {
  const response = await fetch(`${API_URL}/reports/`);
  if (!response.ok) {
    throw new Error("Erro ao buscar reports");
  }
  return response.json();
}

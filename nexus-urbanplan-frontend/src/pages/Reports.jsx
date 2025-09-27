import { useEffect, useState } from "react";
import ReportForm from "../components/ReportForm";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/reports/") // rota do backend
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Erro ao buscar reports:", err);
        setLoading(false);
      });
  }, []);

  if (loading) return <p className="text-center text-gray-500">Carregando reports...</p>;

  return (
    <div className="container mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        📋 Reports Recentes da Comunidade
      </h2>

      {/* Formulário */}
      <ReportForm onReportCreated={(newReport) => setReports([newReport, ...reports])} />

      {/* Lista de Reports */}
      {reports.length === 0 ? (
        <p className="text-gray-500 italic">Nenhum report encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <div
              key={report.id}
              className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
            >
              <div className="flex justify-between items-center mb-3">
                <h6 className="text-lg font-semibold text-gray-800">
                  {report.problem_type}
                </h6>
                <span className="text-xs text-gray-400">ID: {report.id}</span>
              </div>

              <p className="text-gray-700 mb-2">{report.description}</p>
              <p className="text-sm text-gray-500">📍 {report.location}</p>

              {report.solution && (
                <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
                  💡 <strong>Sugestão:</strong> {report.solution}
                </p>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Reports;

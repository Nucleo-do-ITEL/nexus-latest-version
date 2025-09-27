import { useState } from "react";

function ReportForm({ onReportCreated }) {
  const [problemType, setProblemType] = useState("");
  const [description, setDescription] = useState("");
  const [location, setLocation] = useState("");
  const [solution, setSolution] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const newReport = { problem_type: problemType, description, location, solution };

    try {
      const response = await fetch("http://127.0.0.1:8000/reports/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newReport),
      });

      if (response.ok) {
        const savedReport = await response.json();
        onReportCreated(savedReport);

        // limpar campos
        setProblemType("");
        setDescription("");
        setLocation("");
        setSolution("");
      } else {
        console.error("Erro ao enviar report");
      }
    } catch (err) {
      console.error("Erro de rede:", err);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-2xl p-6 mb-6 border border-gray-200"
    >
      <h4 className="text-xl font-bold text-blue-600 mb-4">
        ➕ Criar Novo Report
      </h4>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Tipo de Problema</label>
        <input
          type="text"
          className="w-full mt-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={problemType}
          onChange={(e) => setProblemType(e.target.value)}
          placeholder="Ex: Falta de iluminação"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Descrição</label>
        <textarea
          className="w-full mt-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          rows="3"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Explique o problema..."
          required
        ></textarea>
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Localização</label>
        <input
          type="text"
          className="w-full mt-1 p-3 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          placeholder="Ex: Bairro X, Rua Y"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-medium">Sugestão de Solução (opcional)</label>
        <input
          type="text"
          className="w-full mt-1 p-3 border border-green-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:outline-none"
          value={solution}
          onChange={(e) => setSolution(e.target.value)}
          placeholder="Ex: Instalar postes de luz"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-3 px-4 rounded-lg transition duration-300"
      >
        🚀 Enviar Report
      </button>
    </form>
  );
}

export default ReportForm;

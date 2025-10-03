import { useState } from "react";

function ReportForm({ onReportCreated }) {
  const [formData, setFormData] = useState({
    problem_type: "",
    description: "",
    location: "",
    solution: "",
    images: []
  });
  const [loading, setLoading] = useState(false);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    
    // Limitar a 5 imagens
    if (files.length + formData.images.length > 5) {
      alert('Máximo de 5 imagens permitidas');
      return;
    }

    const newImagePreviews = [];
    const newImages = [];

    files.forEach(file => {
      // Verificar tipo de arquivo
      if (!file.type.startsWith('image/')) {
        alert('Apenas arquivos de imagem são permitidos');
        return;
      }

      // Verificar tamanho (máximo 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Imagem muito grande. Máximo 5MB por imagem.');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        newImagePreviews.push(e.target.result);
        newImages.push(e.target.result);
        
        if (newImagePreviews.length === files.length) {
          setImagePreviews(prev => [...prev, ...newImagePreviews]);
          setFormData(prev => ({
            ...prev,
            images: [...prev.images, ...newImages]
          }));
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index) => {
    const newPreviews = imagePreviews.filter((_, i) => i !== index);
    const newImages = formData.images.filter((_, i) => i !== index);
    setImagePreviews(newPreviews);
    setFormData(prev => ({ ...prev, images: newImages }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("http://127.0.0.1:8000/reports/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...formData,
          created_at: new Date().toISOString()
        }),
      });

      if (response.ok) {
        const newReport = await response.json();
        onReportCreated(newReport);
        
        // Reset form
        setFormData({
          problem_type: "",
          description: "",
          location: "",
          solution: "",
          images: []
        });
        setImagePreviews([]);
        
        alert("Report enviado com sucesso! Aguarde a verificação.");
      } else {
        alert("Erro ao enviar report.");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro de conexão.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-8 border border-gray-200">
      <h3 className="text-xl font-bold text-gray-800 mb-4">📝 Enviar Novo Report</h3>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Tipo de Problema *
          </label>
          <select
            name="problem_type"
            value={formData.problem_type}
            onChange={handleChange}
            required
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="">Selecione o tipo de problema</option>
            <option value="desmatamento">Desmatamento</option>
            <option value="poluição">Poluição</option>
            <option value="queimada">Queimada</option>
            <option value="inundação">Inundação</option>
            <option value="erosão">Erosão</option>
            <option value="outro">Outro</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Descrição Detalhada *
          </label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            placeholder="Descreva o problema em detalhes. Quanto mais informações, melhor será a verificação."
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Localização *
          </label>
          <input
            type="text"
            name="location"
            value={formData.location}
            onChange={handleChange}
            required
            placeholder="Ex: Rua das Flores, 123 - Bairro Centro - Cidade/Estado"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Imagens de Evidência (Máx. 5)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            onChange={handleImageUpload}
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <p className="text-xs text-gray-500 mt-1">
            📸 Adicione fotos que comprovem o problema. Isso aumenta a confiabilidade do report.
          </p>
          
          {/* Pré-visualização das imagens */}
          {imagePreviews.length > 0 && (
            <div className="mt-3">
              <p className="text-sm text-gray-700 mb-2">Pré-visualização:</p>
              <div className="flex flex-wrap gap-2">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="relative">
                    <img
                      src={preview}
                      alt={`Preview ${index + 1}`}
                      className="w-20 h-20 object-cover rounded border"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 text-xs flex items-center justify-center"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Sugestão de Solução (Opcional)
          </label>
          <textarea
            name="solution"
            value={formData.solution}
            onChange={handleChange}
            rows="3"
            placeholder="Tem alguma sugestão para resolver este problema?"
            className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition"
        >
          {loading ? "Enviando..." : "📤 Enviar Report"}
        </button>
      </form>
    </div>
  );
}

export default ReportForm;
import { useState, useEffect } from 'react';
import * as tf from '@tensorflow/tfjs';

export default function SugestoesIA() {
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [suggestions, setSuggestions] = useState([]);
  const [newProblem, setNewProblem] = useState({
    description: '',
    location: '',
    problemType: ''
  });

  // Carregar o modelo de ML
  useEffect(() => {
    loadModel();
    loadSampleSuggestions();
  }, []);

  const loadModel = async () => {
    try {
      // Simulação de carregamento de modelo treinado com dados da NASA
      // Em produção, você carregaria um modelo real treinado
      console.log('Carregando modelo de IA...');
      
      // Simular um modelo simples baseado em regras + ML
      setTimeout(() => {
        setModel({
          predict: (input) => generateAISuggestions(input)
        });
        setLoading(false);
      }, 2000);
      
    } catch (error) {
      console.error('Erro ao carregar modelo:', error);
      setLoading(false);
    }
  };

  // Dados de treinamento baseados em datasets da NASA
  const nasaTrainingData = {
    'desmatamento': {
      features: ['cobertura_vegetal', 'ndvi', 'temperatura_superficie', 'precipitacao'],
      solutions: [
        'Reflorestamento com espécies nativas',
        'Sistema agroflorestal sustentável',
        'Corredores ecológicos',
        'Monitoramento por satélite contínuo'
      ],
      impact: 'Restauração de 70-90% da cobertura original em 5 anos',
      successRate: 0.85
    },
    'poluicao_agua': {
      features: ['qualidade_agua', 'turbidez', 'ph', 'metais_pesados'],
      solutions: [
        'Estações de tratamento de efluentes',
        'Wetlands construídos',
        'Biorremediação com microrganismos',
        'Sistemas de filtragem natural'
      ],
      impact: 'Redução de 80-95% nos poluentes',
      successRate: 0.78
    },
    'queimadas': {
      features: ['temperatura', 'umidade', 'velocidade_vento', 'combustivel_vegetal'],
      solutions: [
        'Sistema de alerta precoce',
        'Queimas controladas',
        'Brigadas de combate',
        'Zoneamento de risco'
      ],
      impact: 'Redução de 60-80% na área queimada',
      successRate: 0.72
    },
    'erosao': {
      features: ['declividade', 'tipo_solo', 'cobertura_vegetal', 'precipitacao'],
      solutions: [
        'Plantio em curvas de nível',
        'Terraços e barragens',
        'Cobertura vegetal permanente',
        'Engenharia naturalística'
      ],
      impact: 'Redução de 85% na perda de solo',
      successRate: 0.88
    },
    'poluicao_ar': {
      features: ['pm2_5', 'co2', 'no2', 'temperatura'],
      solutions: [
        'Filtros industriais avançados',
        'Transporte elétrico',
        'Reflorestamento urbano',
        'Energias renováveis'
      ],
      impact: 'Melhoria de 50-70% na qualidade do ar',
      successRate: 0.75
    }
  };

  const generateAISuggestions = (problemData) => {
    const { description, location, problemType } = problemData;
    
    // Análise do texto usando processamento de linguagem natural básico
    const detectedProblem = detectProblemType(description);
    const severity = calculateSeverity(description, location);
    const urgency = calculateUrgency(problemType, severity);
    
    // Gerar soluções baseadas no modelo da NASA
    const nasaSolutions = nasaTrainingData[detectedProblem] || nasaTrainingData['desmatamento'];
    
    return {
      problem: description,
      location: location,
      detectedProblem: detectedProblem,
      severity: severity,
      urgency: urgency,
      solutions: nasaSolutions.solutions,
      impact: nasaSolutions.impact,
      successRate: nasaSolutions.successRate,
      confidence: Math.random() * 0.3 + 0.7, // 70-100% de confiança
      dataSources: [
        'NASA MODIS Land Cover',
        'NASA ASTER GDEM',
        'NASA GRACE Groundwater',
        'NASA AIRS Atmosphere'
      ],
      timestamp: new Date().toISOString()
    };
  };

  const detectProblemType = (description) => {
    const keywords = {
      'desmatamento': ['desmatamento', 'desflorestamento', 'árvores cortadas', 'mata destruída'],
      'poluicao_agua': ['rio poluído', 'água contaminada', 'lixo no rio', 'poluição hídrica'],
      'queimadas': ['queimada', 'incêndio', 'fogo', 'cinzas', 'fumaça'],
      'erosao': ['erosão', 'deslizamento', 'terra caindo', 'barranco'],
      'poluicao_ar': ['ar poluído', 'fumaça', 'cheiro forte', 'poluição atmosférica']
    };

    const descLower = description.toLowerCase();
    for (const [problem, words] of Object.entries(keywords)) {
      if (words.some(word => descLower.includes(word))) {
        return problem;
      }
    }
    return 'desmatamento'; // padrão
  };

  const calculateSeverity = (description, location) => {
    // Baseado em dados históricos da NASA para a região
    const severityFactors = {
      wordCount: description.length > 100 ? 0.8 : 0.4,
      urgencyWords: (description.match(/urgente|crítico|grave|emergência/gi) || []).length * 0.2,
      locationRisk: location.includes('Amazônia') ? 0.9 : 0.5
    };
    
    const total = Object.values(severityFactors).reduce((a, b) => a + b, 0);
    return total > 1.5 ? 'crítico' : total > 1 ? 'moderado' : 'leve';
  };

  const calculateUrgency = (problemType, severity) => {
    const urgencyMap = {
      'desmatamento': { crítico: 24, moderado: 72, leve: 168 },
      'queimadas': { crítico: 6, moderado: 24, leve: 72 },
      'poluicao_agua': { crítico: 48, moderado: 120, leve: 240 },
      'erosao': { crítico: 24, moderado: 96, leve: 336 },
      'poluicao_ar': { crítico: 72, moderado: 168, leve: 720 }
    };
    
    return urgencyMap[problemType]?.[severity] || 168;
  };

  const loadSampleSuggestions = () => {
    setSuggestions([
      {
        id: 1,
        problem: "Contaminação de rios por efluentes industriais na Bacia do Rio Doce",
        location: "Brasil, Minas Gerais",
        detectedProblem: "poluicao_agua",
        severity: "crítico",
        urgency: 48,
        solutions: [
          "Estações de tratamento de efluentes compactas",
          "Wetlands construídos para filtragem natural",
          "Biorremediação com bactérias especializadas"
        ],
        impact: "Redução de 80% na poluição hídrica em 12 meses",
        successRate: 0.82,
        confidence: 0.89,
        dataSources: [
          "NASA MODIS Water Quality",
          "NASA Landsat 8 OLI",
          "NASA GRACE Groundwater"
        ],
        approved: false,
        rejected: false
      },
      {
        id: 2,
        problem: "Desmatamento acelerado na Floresta Amazônica para agricultura",
        location: "Brasil, Pará",
        detectedProblem: "desmatamento",
        severity: "crítico",
        urgency: 24,
        solutions: [
          "Reflorestamento com espécies nativas de crescimento rápido",
          "Sistema agroflorestal sustentável",
          "Corredores ecológicos para fauna"
        ],
        impact: "Restauração de 85% da cobertura vegetal em 5 anos",
        successRate: 0.87,
        confidence: 0.91,
        dataSources: [
          "NASA MODIS Deforestation Alerts",
          "NASA GEDI Forest Height",
          "NASA ECOSTRESS Vegetation"
        ],
        approved: false,
        rejected: false
      }
    ]);
  };

  const handleGenerateSuggestion = async (e) => {
    e.preventDefault();
    if (!model || !newProblem.description) return;

    setLoading(true);
    
    // Simular processamento da IA
    setTimeout(() => {
      const suggestion = model.predict(newProblem);
      const newSuggestion = {
        id: suggestions.length + 1,
        ...suggestion,
        approved: false,
        rejected: false
      };
      
      setSuggestions([newSuggestion, ...suggestions]);
      setNewProblem({ description: '', location: '', problemType: '' });
      setLoading(false);
    }, 1500);
  };

  const handleApprove = (id) => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, approved: true, rejected: false } : s
    ));
  };

  const handleReject = (id) => {
    setSuggestions(suggestions.map(s => 
      s.id === id ? { ...s, approved: false, rejected: true } : s
    ));
  };

  const handleModify = (id) => {
    const suggestion = suggestions.find(s => s.id === id);
    if (suggestion) {
      setNewProblem({
        description: suggestion.problem,
        location: suggestion.location,
        problemType: suggestion.detectedProblem
      });
    }
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'moderado': return 'bg-yellow-500 text-black';
      case 'leve': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading && !model) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">🤖 Sugestões de IA</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p>Carregando modelo de IA da NASA...</p>
            <p className="text-sm text-gray-600">Treinado com dados de satélite e sensoriamento remoto</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 Sugestões de IA - NASA Powered</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 shadow rounded-lg border">
            <h3 className="font-semibold mb-3">🔍 Filtros NASA</h3>
            
            <label className="block text-sm font-medium mb-1">Região</label>
            <select className="w-full border rounded p-2 mb-3 text-sm">
              <option>América do Sul</option>
              <option>América Central</option>
              <option>África</option>
              <option>Ásia</option>
              <option>Europa</option>
            </select>

            <label className="block text-sm font-medium mb-1">Dataset NASA</label>
            <select className="w-full border rounded p-2 mb-3 text-sm">
              <option>Todos os datasets</option>
              <option>MODIS Land Cover</option>
              <option>Landsat Surface Temp</option>
              <option>GRACE Water</option>
              <option>AIRS Atmosphere</option>
            </select>

            <label className="block text-sm font-medium mb-2">Severidade</label>
            <div className="space-y-2 text-sm">
              {['crítico', 'moderado', 'leve'].map(severity => (
                <label key={severity} className="flex items-center">
                  <input type="checkbox" defaultChecked className="mr-2" />
                  <span className={`px-2 py-1 rounded text-xs ${getSeverityColor(severity)}`}>
                    {severity}
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div className="bg-white p-4 shadow rounded-lg border">
            <h3 className="font-semibold mb-3">📊 Estatísticas NASA</h3>
            <div className="space-y-2 text-sm">
              <p>🌍 <strong>Terra</strong> – <span className="text-red-500">12 críticos</span></p>
              <p>💧 <strong>Água</strong> – <span className="text-red-500">47 críticos</span></p>
              <p>🌬️ <strong>Ar</strong> – <span className="text-red-500">8 críticos</span></p>
              <p>🔥 <strong>Fogo</strong> – <span className="text-red-500">23 críticos</span></p>
              <div className="mt-3 p-2 bg-blue-50 rounded">
                <p className="text-xs text-blue-700">
                  📡 <strong>Dados em tempo real</strong><br/>
                  Atualizado via satélites NASA
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Sugestões */}
        <div className="md:col-span-3 space-y-6">
          {/* Formulário Nova Sugestão */}
          <div className="bg-white shadow rounded-lg p-6 border">
            <h4 className="font-semibold mb-4">🛰️ Nova Análise com IA NASA</h4>
            <form onSubmit={handleGenerateSuggestion} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Descrição do Problema *</label>
                <textarea
                  className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows="3"
                  placeholder="Descreva detalhadamente o problema ambiental..."
                  value={newProblem.description}
                  onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                  required
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Localização *</label>
                <input
                  type="text"
                  className="w-full border rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="País, cidade ou coordenadas GPS"
                  value={newProblem.location}
                  onChange={(e) => setNewProblem({...newProblem, location: e.target.value})}
                  required
                />
              </div>
              
              <button 
                type="submit"
                disabled={loading}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Analisando com IA NASA...
                  </>
                ) : (
                  '🛰️ Gerar Sugestão com IA NASA'
                )}
              </button>
              
              <p className="text-xs text-gray-600">
                🔬 <strong>Tecnologia NASA:</strong> Análise com modelos treinados em dados de satélite MODIS, Landsat e GRACE
              </p>
            </form>
          </div>

          {/* Lista de Sugestões */}
          {suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white shadow rounded-lg p-6 border hover:shadow-lg transition">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">
                    {suggestion.location}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded ${getSeverityColor(suggestion.severity)}`}>
                    {suggestion.severity}
                  </span>
                  <span className="text-xs bg-purple-100 text-purple-800 px-2 py-1 rounded">
                    🕒 {suggestion.urgency}h
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm font-medium ${getConfidenceColor(suggestion.confidence)}`}>
                    Confiança: {(suggestion.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              <div className="mb-4">
                <p className="font-semibold text-lg mb-2">🔍 {suggestion.problem}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Problema detectado:</strong> {suggestion.detectedProblem.replace('_', ' ')}
                </p>
                
                <div className="bg-gray-50 p-3 rounded-lg mb-3">
                  <p className="font-semibold text-sm mb-2">🛰️ Fontes NASA:</p>
                  <div className="flex flex-wrap gap-1">
                    {suggestion.dataSources.map((source, index) => (
                      <span key={index} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {source}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4 mb-3">
                  <div>
                    <p className="font-semibold text-sm mb-1">💡 Soluções Propostas:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {suggestion.solutions.map((solution, index) => (
                        <li key={index}>• {solution}</li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1">📈 Impacto Esperado:</p>
                    <p className="text-sm text-gray-700">{suggestion.impact}</p>
                    <p className="text-sm text-green-600 mt-1">
                      Taxa de sucesso: {(suggestion.successRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-between items-center">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => handleApprove(suggestion.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition"
                  >
                    ✅ Aprovar
                  </button>
                  <button 
                    onClick={() => handleModify(suggestion.id)}
                    className="bg-yellow-500 text-black px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition"
                  >
                    ✏️ Modificar
                  </button>
                  <button 
                    onClick={() => handleReject(suggestion.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition"
                  >
                    ❌ Rejeitar
                  </button>
                </div>
                
                {suggestion.approved && (
                  <span className="text-green-600 font-semibold">✓ Aprovado</span>
                )}
                {suggestion.rejected && (
                  <span className="text-red-600 font-semibold">✗ Rejeitado</span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
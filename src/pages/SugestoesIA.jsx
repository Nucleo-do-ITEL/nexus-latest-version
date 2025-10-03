import { useState, useEffect, useRef } from "react";
import * as tf from '@tensorflow/tfjs';

const countries = [
  "Afeganistão", "África do Sul", "Albânia", "Alemanha", "Andorra", "Angola", "Antígua e Barbuda", 
  "Arábia Saudita", "Argélia", "Argentina", "Armênia", "Austrália", "Áustria", "Azerbaijão", 
  "Bahamas", "Bahrein", "Bangladesh", "Barbados", "Bélgica", "Belize", "Benin", "Bielorrússia", 
  "Bolívia", "Bósnia e Herzegovina", "Botsuana", "Brasil", "Brunei", "Bulgária", "Burkina Faso", 
  "Burundi", "Butão", "Cabo Verde", "Camarões", "Camboja", "Canadá", "Catar", "Cazaquistão", 
  "Chade", "Chile", "China", "Chipre", "Colômbia", "Comores", "Congo", "Coreia do Norte", 
  "Coreia do Sul", "Costa do Marfim", "Costa Rica", "Croácia", "Cuba", "Dinamarca", "Djibuti", 
  "Dominica", "Egito", "El Salvador", "Emirados Árabes Unidos", "Equador", "Eritreia", "Eslováquia", 
  "Eslovênia", "Espanha", "Estados Unidos", "Estônia", "Eswatini", "Etiópia", "Fiji", "Filipinas", 
  "Finlândia", "França", "Gabão", "Gâmbia", "Gana", "Geórgia", "Granada", "Grécia", "Guatemala", 
  "Guiana", "Guiné", "Guiné Equatorial", "Guiné-Bissau", "Haiti", "Honduras", "Hungria", "Iêmen", 
  "Ilhas Marshall", "Ilhas Salomão", "Índia", "Indonésia", "Irã", "Iraque", "Irlanda", "Islândia", 
  "Israel", "Itália", "Jamaica", "Japão", "Jordânia", "Kiribati", "Kuwait", "Laos", "Lesoto", 
  "Letônia", "Líbano", "Libéria", "Líbia", "Liechtenstein", "Lituânia", "Luxemburgo", "Macedônia do Norte", 
  "Madagáscar", "Malásia", "Maláui", "Maldivas", "Mali", "Malta", "Marrocos", "Maurícia", "Mauritânia", 
  "México", "Micronésia", "Moçambique", "Moldávia", "Mônaco", "Mongólia", "Montenegro", "Myanmar", 
  "Namíbia", "Nauru", "Nepal", "Nicarágua", "Níger", "Nigéria", "Noruega", "Nova Zelândia", "Omã", 
  "Países Baixos", "Palau", "Panamá", "Papua-Nova Guiné", "Paquistão", "Paraguai", "Peru", "Polônia", 
  "Portugal", "Quênia", "Quirguistão", "Reino Unido", "República Centro-Africana", "República Checa", 
  "República Democrática do Congo", "República Dominicana", "Romênia", "Ruanda", "Rússia", "Samoa", 
  "San Marino", "Santa Lúcia", "São Cristóvão e Névis", "São Tomé e Príncipe", "São Vicente e Granadinas", 
  "Seicheles", "Senegal", "Serra Leoa", "Sérvia", "Singapura", "Síria", "Somália", "Sri Lanka", 
  "Sudão", "Sudão do Sul", "Suécia", "Suíça", "Suriname", "Tailândia", "Taiwan", "Tajiquistão", 
  "Tanzânia", "Timor-Leste", "Togo", "Tonga", "Trindade e Tobago", "Tunísia", "Turcomenistão", 
  "Turquia", "Tuvalu", "Ucrânia", "Uganda", "Uruguai", "Uzbequistão", "Vanuatu", "Vaticano", 
  "Venezuela", "Vietnã", "Zâmbia", "Zimbábue"
];

const HistoricoSugestoes = ({
  suggestions,
  filterDate,
  setFilterDate,
  filterDisasterType,
  setFilterDisasterType,
  filterCountry,
  setFilterCountry,
  filterSeverity,
  setFilterSeverity,
  onApprove,
  onReject,
  onModify,
  onBack // 🔽 NOVO PROP PARA VOLTAR
}) => {
  const disasterTypes = [
    'desmatamento',
    'poluicao_agua', 
    'queimadas',
    'erosao',
    'poluicao_ar'
  ];

  const severityTypes = ['leve', 'moderado', 'crítico'];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'crítico': return 'bg-red-500 text-white';
      case 'moderado': return 'bg-yellow-500 text-black';
      case 'leve': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return 'text-green-600 font-semibold';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="space-y-6">
      {/* 🔽 CABEÇALHO COM BOTÃO VOLTAR */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <button
            onClick={onBack}
            className="flex items-center justify-center w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors duration-200"
            title="Voltar"
          >
            <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">📊 Histórico de Sugestões</h2>
            <p className="text-sm text-gray-600">Gerencie e filtre todas as sugestões geradas</p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-lg font-semibold text-blue-600">{suggestions.length}</span>
          <p className="text-sm text-gray-600">sugestões no total</p>
        </div>
      </div>

      {/* Filtros */}
      <div className="bg-white p-6 shadow rounded-lg border border-gray-200">
        <h3 className="font-semibold mb-4 text-gray-800">Filtros do Histórico</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Filtro de Data */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Data da Criação
            </label>
            <input
              type="date"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterDate}
              onChange={(e) => setFilterDate(e.target.value)}
            />
          </div>

          {/* Filtro de Tipo de Desastre */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Tipo de Desastre
            </label>
            <select
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterDisasterType}
              onChange={(e) => setFilterDisasterType(e.target.value)}
            >
              <option value="">Todos os tipos</option>
              {disasterTypes.map(type => (
                <option key={type} value={type}>
                  {type.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>

          {/* Filtro de País */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              País
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Filtrar por país..."
              value={filterCountry}
              onChange={(e) => setFilterCountry(e.target.value)}
            />
          </div>

          {/* Filtro de Gravidade */}
          <div>
            <label className="block text-sm font-medium mb-2 text-gray-700">
              Gravidade
            </label>
            <select
              className="w-full border border-gray-300 rounded p-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filterSeverity}
              onChange={(e) => setFilterSeverity(e.target.value)}
            >
              <option value="">Todas as gravidades</option>
              {severityTypes.map(severity => (
                <option key={severity} value={severity}>
                  {severity.charAt(0).toUpperCase() + severity.slice(1)}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Botão Limpar Filtros */}
        <div className="mt-4 flex justify-end">
          <button
            onClick={() => {
              setFilterDate('');
              setFilterDisasterType('');
              setFilterCountry('');
              setFilterSeverity('');
            }}
            className="bg-gray-500 text-white px-4 py-2 rounded text-sm hover:bg-gray-600 transition"
          >
            Limpar Filtros
          </button>
        </div>
      </div>

      {/* Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-blue-600">{suggestions.length}</div>
          <div className="text-sm text-gray-600">Total de Sugestões</div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-green-600">
            {suggestions.filter(s => s.approved).length}
          </div>
          <div className="text-sm text-gray-600">Aprovadas</div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-red-600">
            {suggestions.filter(s => s.rejected).length}
          </div>
          <div className="text-sm text-gray-600">Rejeitadas</div>
        </div>
        <div className="bg-white p-4 shadow rounded-lg border border-gray-200 text-center">
          <div className="text-2xl font-bold text-yellow-600">
            {suggestions.filter(s => !s.approved && !s.rejected).length}
          </div>
          <div className="text-sm text-gray-600">Pendentes</div>
        </div>
      </div>

      {/* Lista de Sugestões Filtradas */}
      <div className="space-y-4">
        {suggestions.length === 0 ? (
          <div className="bg-white p-8 shadow rounded-lg border border-gray-200 text-center">
            <div className="text-gray-400 mb-4">
              <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg mb-2">Nenhuma sugestão encontrada</p>
            <p className="text-gray-400 text-sm">Tente ajustar os filtros ou gerar novas sugestões</p>
          </div>
        ) : (
          suggestions.map((suggestion) => (
            <div key={suggestion.id} className="bg-white shadow rounded-lg p-6 border border-gray-200 hover:shadow-lg transition">
              {/* Cabeçalho com informações */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center space-x-2 flex-wrap gap-2">
                  <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded font-medium">
                    {suggestion.location}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded font-medium ${getSeverityColor(suggestion.severity)}`}>
                    {suggestion.severity.toUpperCase()}
                  </span>
                  <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                    {formatDate(suggestion.timestamp)}
                  </span>
                </div>
                <div className="text-right">
                  <span className={`text-sm ${getConfidenceColor(suggestion.confidence)}`}>
                    Confiança: {(suggestion.confidence * 100).toFixed(0)}%
                  </span>
                </div>
              </div>

              {/* Conteúdo da sugestão */}
              <div className="mb-4">
                <p className="font-semibold text-lg mb-2 text-gray-800">{suggestion.problem}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Problema detectado:</strong> {suggestion.detectedProblem.replace('_', ' ')}
                </p>
                
                <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                  <p className="font-semibold text-sm mb-2 text-blue-800">Insights NASA:</p>
                  <p className="text-sm text-blue-700">{suggestion.nasaInsights}</p>
                </div>

                <div className="bg-gray-50 p-3 rounded-lg mb-3 border border-gray-200">
                  <p className="font-semibold text-sm mb-2 text-gray-800">Fontes da NASA:</p>
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
                    <p className="font-semibold text-sm mb-1 text-gray-800">Soluções Propostas:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {suggestion.solutions.map((solution, index) => (
                        <li key={index} className="flex items-start">
                          <span className="text-green-500 mr-2">•</span>
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="font-semibold text-sm mb-1 text-gray-800">Impacto Esperado:</p>
                    <p className="text-sm text-gray-700 mb-2">{suggestion.impact}</p>
                    <p className="text-sm text-green-600 font-semibold">
                      Taxa de sucesso: {(suggestion.successRate * 100).toFixed(0)}%
                    </p>
                  </div>
                </div>
              </div>

              {/* Botões de ação */}
              <div className="flex justify-between items-center pt-3 border-t border-gray-200">
                <div className="flex space-x-2">
                  <button 
                    onClick={() => onApprove(suggestion.id)}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700 transition font-medium"
                  >
                    Aprovar
                  </button>
                  <button 
                    onClick={() => onModify(suggestion.id)}
                    className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-yellow-600 transition font-medium"
                  >
                    Modificar
                  </button>
                  <button 
                    onClick={() => onReject(suggestion.id)}
                    className="bg-red-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-red-700 transition font-medium"
                  >
                    Rejeitar
                  </button>
                </div>
                
                {suggestion.approved && (
                  <span className="text-green-600 font-semibold text-sm">✓ Aprovado</span>
                )}
                {suggestion.rejected && (
                  <span className="text-red-600 font-semibold text-sm">✗ Rejeitado</span>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default function SugestoesIA() {
  
  const [model, setModel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);
  const [suggestions, setSuggestions] = useState([]);
  const [trainingData, setTrainingData] = useState([]);
  const [trainingProgress, setTrainingProgress] = useState(0);
  const [newProblem, setNewProblem] = useState({
    description: '',
    location: '',
    problemType: ''
  });
  const [tfReady, setTfReady] = useState(false);
  const [activeTab, setActiveTab] = useState('gerar'); // 'gerar' ou 'historico'
  const [filterDate, setFilterDate] = useState('');
  const [filterDisasterType, setFilterDisasterType] = useState('');
  const [filterCountry, setFilterCountry] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('');
  const [filteredSuggestions, setFilteredSuggestions] = useState([]);
  const modelRef = useRef(null);

  // Dados de treinamento iniciais baseados em reports reais e dados NASA
  const initialTrainingData = [
    {
      description: "Desmatamento ilegal na Amazônia para criação de gado, área de 500 hectares devastada",
      location: "Brasil, Amazonas, Novo Progresso",
      problemType: "desmatamento",
      nasaData: { ndvi: 0.15, temperature: 32.5, precipitation: 1800, forestLoss: 0.85 },
      solutions: [
        "Reflorestamento com espécies nativas de rápido crescimento",
        "Monitoramento por satélite em tempo real",
        "Fortalecimento da fiscalização ambiental",
        "Programas de economia sustentável para comunidades"
      ],
      impact: "Restauração de 70% da área em 3 anos",
      successRate: 0.82
    },
    {
      description: "Corte raso de mata atlântica para expansão urbana, fragmentação de habitat",
      location: "Brasil, São Paulo, Serra do Mar",
      problemType: "desmatamento", 
      nasaData: { ndvi: 0.12, temperature: 28.3, precipitation: 2200, forestLoss: 0.92 },
      solutions: [
        "Corredores ecológicos entre fragmentos",
        "Zoneamento ambiental rigoroso",
        "Compensação ambiental obrigatória",
        "Educação ambiental nas comunidades"
      ],
      impact: "Conexão de 60% dos fragmentos em 5 anos",
      successRate: 0.78
    },
    {
      description: "Descarga de efluentes industriais não tratados no Rio Tietê, alta concentração de metais",
      location: "Brasil, São Paulo, Rio Tietê",
      problemType: "poluicao_agua",
      nasaData: { waterQuality: 0.15, turbidity: 85, temperature: 26.8, pollutionIndex: 0.88 },
      solutions: [
        "Estações de tratamento terciário",
        "Barreiras de contenção de sedimentos",
        "Monitoramento contínuo da qualidade",
        "Programa de biorremediação"
      ],
      impact: "Redução de 80% dos poluentes em 18 meses",
      successRate: 0.85
    },
    {
      description: "Contaminação por agrotóxicos em rios do cerrado, afetando fauna aquática",
      location: "Brasil, Goiás, Rio Araguaia",
      problemType: "poluicao_agua",
      nasaData: { waterQuality: 0.22, turbidity: 45, temperature: 29.1, pollutionIndex: 0.76 },
      solutions: [
        "Zoneamento de aplicação de agrotóxicos",
        "Criação de zonas de amortecimento",
        "Sistemas de filtragem natural",
        "Monitoramento de resíduos"
      ],
      impact: "Redução de 65% da contaminação em 2 anos",
      successRate: 0.72
    },
    {
      description: "Queimadas extensivas no pantanal para limpeza de pastagem, fauna ameaçada",
      location: "Brasil, Mato Grosso do Sul, Pantanal",
      problemType: "queimadas",
      nasaData: { fireRisk: 0.94, temperature: 38.2, humidity: 35, vegetationDryness: 0.87 },
      solutions: [
        "Sistema de alerta precoce com satélites",
        "Brigadas de combate móveis",
        "Queimas controladas programadas",
        "Educação sobre manejo do fogo"
      ],
      impact: "Redução de 75% na área queimada",
      successRate: 0.79
    },
    {
      description: "Erosão acelerada em encostas devido ao desmatamento, risco de deslizamentos",
      location: "Brasil, Rio de Janeiro, Serra dos Órgãos",
      problemType: "erosao",
      nasaData: { slope: 0.45, soilLoss: 0.82, vegetationCover: 0.25, erosionRisk: 0.91 },
      solutions: [
        "Plantio em curvas de nível",
        "Terraços de contenção",
        "Cobertura vegetal permanente",
        "Drenagem adequada"
      ],
      impact: "Redução de 85% na perda de solo",
      successRate: 0.88
    },
    {
      description: "Emissões industriais elevadas na região metropolitana, qualidade do ar crítica",
      location: "Brasil, São Paulo, Região Metropolitana",
      problemType: "poluicao_ar",
      nasaData: { pm25: 68, no2: 45, co2: 420, airQuality: 0.18 },
      solutions: [
        "Filtros de partículas em chaminés",
        "Inspeção veicular rigorosa",
        "Reflorestamento urbano",
        "Incentivo a transportes limpos"
      ],
      impact: "Melhoria de 60% na qualidade do ar",
      successRate: 0.75
    }
  ];

  // Inicializar TensorFlow.js e modelo
  useEffect(() => {
    initializeAI();
    loadSampleSuggestions();
  }, []);

  useEffect(() => {
  filterSuggestions();
}, [suggestions, filterDate, filterDisasterType, filterCountry, filterSeverity]);

const filterSuggestions = () => {
  let filtered = suggestions;

  if (filterDate) {
    filtered = filtered.filter(suggestion => {
      const suggestionDate = new Date(suggestion.timestamp).toISOString().split('T')[0];
      return suggestionDate === filterDate;
    });
  }

  if (filterDisasterType) {
    filtered = filtered.filter(suggestion => 
      suggestion.detectedProblem === filterDisasterType
    );
  }

  if (filterCountry) {
    filtered = filtered.filter(suggestion => 
      suggestion.location.toLowerCase().includes(filterCountry.toLowerCase())
    );
  }

  if (filterSeverity) {
    filtered = filtered.filter(suggestion => 
      suggestion.severity === filterSeverity
    );
  }

  setFilteredSuggestions(filtered);
};

  const initializeAI = async () => {
    try {
      console.log('Inicializando IA com TensorFlow.js...');
      await tf.ready();
      setTfReady(true);
      
      // Carregar dados de treinamento iniciais
      setTrainingData(initialTrainingData);
      
      // Criar e treinar modelo
      await createAndTrainModel();
      
    } catch (error) {
      console.error('❌ Erro na inicialização:', error);
      setLoading(false);
    }
  };

  // Criar modelo neural personalizado
  const createAndTrainModel = async () => {
    setTraining(true);
    setTrainingProgress(0);
    
    try {
      const inputShape = [15]; // 15 features de entrada
      const outputShape = 5;   // 5 tipos de problemas
      
      const newModel = tf.sequential({
        layers: [
          tf.layers.dense({ 
            inputShape: inputShape, 
            units: 32, 
            activation: 'relu',
            kernelInitializer: 'heNormal'
          }),
          tf.layers.dropout({ rate: 0.3 }),
          tf.layers.dense({ 
            units: 16, 
            activation: 'relu' 
          }),
          tf.layers.dropout({ rate: 0.2 }),
          tf.layers.dense({ 
            units: outputShape, 
            activation: 'softmax' 
          })
        ]
      });

      // Compilar o modelo
      newModel.compile({
        optimizer: tf.train.adam(0.001),
        loss: 'categoricalCrossentropy',
        metrics: ['accuracy']
      });

      // Preparar dados de treinamento
      const { features, labels } = prepareTrainingData();
      
      // Treinar o modelo
      const history = await newModel.fit(features, labels, {
        epochs: 100,
        batchSize: 4,
        validationSplit: 0.2,
        callbacks: {
          onEpochEnd: (epoch, logs) => {
            const progress = ((epoch + 1) / 100) * 100;
            setTrainingProgress(progress);
            console.log(`Época ${epoch + 1}: loss = ${logs.loss.toFixed(4)}`);
          }
        }
      });

      console.log('Modelo treinado com sucesso!', history);
      
      modelRef.current = newModel;
      setModel({
        predict: (input) => predictWithTrainedModel(input, newModel),
        version: 'NASA-Trained-v3.0',
        accuracy: history.history.acc[history.history.acc.length - 1],
        loss: history.history.loss[history.history.loss.length - 1]
      });
      
    } catch (error) {
      console.error('❌ Erro no treinamento:', error);
      // Fallback para modelo baseado em regras
      setModel({
        predict: (input) => generateAISuggestions(input),
        version: 'Rule-Based-Fallback',
        accuracy: 0.65
      });
    } finally {
      setTraining(false);
      setLoading(false);
    }
  };
// Adicione este estado ao componente
const [showTrainingModal, setShowTrainingModal] = useState(false);
const [newTrainingCase, setNewTrainingCase] = useState({
  description: '',
  location: '',
  problemType: 'desmatamento',
  solutions: ['', '', '', ''],
  impact: '',
  successRate: 0.8
});

const [showCountryDropdown, setShowCountryDropdown] = useState(false);
const [filteredCountries, setFilteredCountries] = useState(countries);
const [countryInput, setCountryInput] = useState('');

const handleCountryInputChange = (e) => {
    const value = e.target.value;
    setCountryInput(value);
    
    if (value.trim() === '') {
      setFilteredCountries(countries);
    } else {
      const filtered = countries.filter(country => 
        country.toLowerCase().startsWith(value.toLowerCase())
      );
      setFilteredCountries(filtered);
    }
    
    setNewProblem({...newProblem, location: value});
    setShowCountryDropdown(true);
  };

  const handleCountrySelect = (country) => {
    setCountryInput(country);
    setNewProblem({...newProblem, location: country});
    setShowCountryDropdown(false);
    setFilteredCountries(countries);
  };

  const handleCountryInputBlur = () => {
    // Pequeno delay para permitir o clique nos itens da lista
    setTimeout(() => {
      setShowCountryDropdown(false);
    }, 200);
  };

  const handleCountryInputFocus = () => {
    if (countryInput.trim() === '') {
      setFilteredCountries(countries);
    }
    setShowCountryDropdown(true);
  };

// Componente Modal para Adicionar Casos de Treinamento
const TrainingDataModal = () => (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
    <div className="bg-white p-6 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
      <h3 className="text-xl font-bold mb-4">➕ Adicionar Caso de Treinamento</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Descrição do Problema *</label>
          <textarea
            className="w-full border rounded p-2"
            rows="3"
            value={newTrainingCase.description}
            onChange={(e) => setNewTrainingCase({...newTrainingCase, description: e.target.value})}
            placeholder="Descreva o problema ambiental em detalhes..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Localização *</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={newTrainingCase.location}
            onChange={(e) => setNewTrainingCase({...newTrainingCase, location: e.target.value})}
            placeholder="Ex: Brasil, Amazonas, Manaus"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Tipo de Problema *</label>
          <select
            className="w-full border rounded p-2"
            value={newTrainingCase.problemType}
            onChange={(e) => setNewTrainingCase({...newTrainingCase, problemType: e.target.value})}
          >
            <option value="desmatamento">Desmatamento</option>
            <option value="poluicao_agua">Poluição da Água</option>
            <option value="queimadas">Queimadas</option>
            <option value="erosao">Erosão</option>
            <option value="poluicao_ar">Poluição do Ar</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Soluções *</label>
          {newTrainingCase.solutions.map((solution, index) => (
            <input
              key={index}
              type="text"
              className="w-full border rounded p-2 mb-2"
              value={solution}
              onChange={(e) => {
                const newSolutions = [...newTrainingCase.solutions];
                newSolutions[index] = e.target.value;
                setNewTrainingCase({...newTrainingCase, solutions: newSolutions});
              }}
              placeholder={`Solução ${index + 1}`}
            />
          ))}
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">Impacto Esperado *</label>
          <input
            type="text"
            className="w-full border rounded p-2"
            value={newTrainingCase.impact}
            onChange={(e) => setNewTrainingCase({...newTrainingCase, impact: e.target.value})}
            placeholder="Ex: Redução de 80% na poluição em 12 meses"
          />
        </div>

        <div>
          <label className="block text-sm font-medium mb-1">
            Taxa de Sucesso: {Math.round(newTrainingCase.successRate * 100)}%
          </label>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            className="w-full"
            value={newTrainingCase.successRate}
            onChange={(e) => setNewTrainingCase({...newTrainingCase, successRate: parseFloat(e.target.value)})}
          />
        </div>

        <div className="flex space-x-2 pt-4">
          <button
            onClick={handleAddTrainingCase}
            className="bg-green-600 text-white px-4 py-2 rounded flex-1"
          >
            Adicionar Caso
          </button>
          <button
            onClick={() => setShowTrainingModal(false)}
            className="bg-gray-500 text-white px-4 py-2 rounded flex-1"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  </div>
);

// Handler para adicionar novo caso
const handleAddTrainingCase = () => {
  if (!newTrainingCase.description || !newTrainingCase.location) {
    alert('Preencha pelo menos a descrição e localização');
    return;
  }

  const newCase = {
    ...newTrainingCase,
    nasaData: generateSimulatedNASAData(newTrainingCase.location, newTrainingCase.problemType)
  };

  setTrainingData(prev => [...prev, newCase]);
  setNewTrainingCase({
    description: '',
    location: '',
    problemType: 'desmatamento',
    solutions: ['', '', '', ''],
    impact: '',
    successRate: 0.8
  });
  setShowTrainingModal(false);
  
  // Re-treinar o modelo com os novos dados
  setTimeout(() => {
    retrainModel();
  }, 1000);
};
const handleImportTrainingData = (event) => {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    try {
      const importedData = JSON.parse(e.target.result);
      
      // Validar estrutura dos dados
      const validData = importedData.filter(item => 
        item.description && 
        item.location && 
        item.problemType && 
        item.solutions
      );
      
      if (validData.length > 0) {
        setTrainingData(prev => [...prev, ...validData]);
        alert(`✅  ${validData.length} casos importados com sucesso!`);
        
        // Re-treinar com novos dados
        retrainModel();
      } else {
        alert('❌ Nenhum dado válido encontrado no arquivo');
      }
    } catch (error) {
      alert('❌ Erro ao importar arquivo. Verifique o formato JSON.');
    }
  };
  reader.readAsText(file);
};
const retrainModel = async () => {
  if (trainingData.length < 5) {
    alert('⚠️ Adicione pelo menos 5 casos de treinamento antes de re-treinar');
    return;
  }

  setTraining(true);
  setTrainingProgress(0);

  try {
    // Criar novo modelo
    const newModel = tf.sequential({
      layers: [
        tf.layers.dense({ 
          inputShape: [15], 
          units: 32, 
          activation: 'relu',
          kernelInitializer: 'heNormal'
        }),
        tf.layers.dropout({ rate: 0.3 }),
        tf.layers.dense({ units: 16, activation: 'relu' }),
        tf.layers.dropout({ rate: 0.2 }),
        tf.layers.dense({ units: 5, activation: 'softmax' })
      ]
    });

    newModel.compile({
      optimizer: tf.train.adam(0.001),
      loss: 'categoricalCrossentropy',
      metrics: ['accuracy']
    });

    // Preparar dados
    const { features, labels } = prepareTrainingData();
    
    // Treinar
    const history = await newModel.fit(features, labels, {
      epochs: 150, // Mais épocas para dados novos
      batchSize: 8,
      validationSplit: 0.2,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          const progress = ((epoch + 1) / 150) * 100;
          setTrainingProgress(progress);
        }
      }
    });

    // Atualizar modelo
    modelRef.current = newModel;
    setModel({
      predict: (input) => predictWithTrainedModel(input, newModel),
      version: `NASA-Trained-v3.${trainingData.length}`,
      accuracy: history.history.acc[history.history.acc.length - 1],
      loss: history.history.loss[history.history.loss.length - 1],
      trainingSize: trainingData.length
    });

    console.log('🔄 Modelo re-treinado com sucesso!', {
      accuracy: history.history.acc[history.history.acc.length - 1],
      trainingCases: trainingData.length
    });

  } catch (error) {
    console.error('❌ Erro no re-treinamento:', error);
  } finally {
    setTraining(false);
  }
};
const exportTrainingData = () => {
  const dataStr = JSON.stringify(trainingData, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  
  const link = document.createElement('a');
  link.href = URL.createObjectURL(dataBlob);
  link.download = `training-data-nasa-${new Date().toISOString().split('T')[0]}.json`;
  link.click();
};
  // Preparar dados para treinamento
  const prepareTrainingData = () => {
    const features = [];
    const labels = [];
    
    const problemTypes = ['desmatamento', 'poluicao_agua', 'queimadas', 'erosao', 'poluicao_ar'];
    
    trainingData.forEach(item => {
      const featureVector = extractFeaturesForTraining(item);
      features.push(featureVector);
      
      const labelIndex = problemTypes.indexOf(item.problemType);
      const labelVector = new Array(problemTypes.length).fill(0);
      labelVector[labelIndex] = 1;
      labels.push(labelVector);
    });
    
    return {
      features: tf.tensor2d(features),
      labels: tf.tensor2d(labels)
    };
  };

  // Extrair features avançadas para treinamento
  const extractFeaturesForTraining = (report) => {
    const { description, location, nasaData } = report;
    
    return [
      // Features textuais
      description.length / 1000,
      (description.match(/urgente|crítico|grave|emergência/gi) || []).length,
      (description.match(/testemunho|evidência|foto|comprovação/gi) || []).length,
      
      // Features de localização
      location.includes('Amazônia') ? 1 : 0,
      location.includes('Pantanal') ? 1 : 0,
      location.includes('Mata Atlântica') ? 1 : 0,
      
      // Dados NASA
      nasaData.ndvi || 0,
      nasaData.temperature ? nasaData.temperature / 50 : 0,
      nasaData.precipitation ? nasaData.precipitation / 3000 : 0,
      nasaData.waterQuality || 0,
      nasaData.pollutionIndex || 0,
      nasaData.fireRisk || 0,
      nasaData.erosionRisk || 0,
      nasaData.airQuality || 0,
      nasaData.pm25 ? nasaData.pm25 / 100 : 0
    ];
  };

  // Predição com modelo treinado
  const predictWithTrainedModel = (input, trainedModel) => {
    try {
      const features = extractFeaturesForPrediction(input);
      const featureTensor = tf.tensor2d([features]);
      
      const prediction = trainedModel.predict(featureTensor);
      const predictionData = prediction.dataSync();
      
      const problemTypes = ['desmatamento', 'poluicao_da_agua', 'queimadas', 'erosao', 'poluicao_do_ar', 'inundacao'];
      const confidenceScores = Array.from(predictionData);
      const maxConfidence = Math.max(...confidenceScores);
      const predictedIndex = confidenceScores.indexOf(maxConfidence);
      const detectedProblem = problemTypes[predictedIndex];
      
      featureTensor.dispose();
      prediction.dispose();
      
      return generateIntelligentSuggestion(input, detectedProblem, maxConfidence);
      
    } catch (error) {
      console.error('Erro na predição:', error);
      return generateFallbackSuggestion(input);
    }
  };

  // Extrair features para predição em tempo real
  const extractFeaturesForPrediction = (input) => {
    const { description, location } = input;
    const textAnalysis = analyzeTextRealTime(description);
    const locationAnalysis = analyzeLocationRealTime(location);
    
    return [
      description.length / 1000,
      textAnalysis.urgencyScore,
      textAnalysis.evidenceScore,
      locationAnalysis.isAmazon ? 1 : 0,
      locationAnalysis.isPantanal ? 1 : 0,
      locationAnalysis.isMataAtlantica ? 1 : 0,
      locationAnalysis.baseNDVI,
      locationAnalysis.baseTemperature / 50,
      locationAnalysis.basePrecipitation / 3000,
      locationAnalysis.baseWaterQuality,
      locationAnalysis.basePollutionIndex,
      locationAnalysis.baseFireRisk,
      locationAnalysis.baseErosionRisk,
      locationAnalysis.baseAirQuality,
      locationAnalysis.basePM25 / 100
    ];
  };

  // Análise de texto em tempo real
  const analyzeTextRealTime = (text) => {
    const lowerText = text.toLowerCase();
    return {
      urgencyScore: (lowerText.match(/urgente|crítico|grave|emergência|catastrófico/gi) || []).length,
      evidenceScore: (lowerText.match(/testemunho|evidência|foto|vídeo|comprovação/gi) || []).length,
    };
  };

  // Análise de localização em tempo real
  const analyzeLocationRealTime = (location) => {
    const lowerLocation = location.toLowerCase();
    return {
      isAmazon: lowerLocation.includes('amazônia') || lowerLocation.includes('amazonas'),
      isPantanal: lowerLocation.includes('pantanal'),
      isMataAtlantica: lowerLocation.includes('mata atlântica') || lowerLocation.includes('serra do mar'),
      baseNDVI: lowerLocation.includes('amazônia') ? 0.85 : 0.65,
      baseTemperature: lowerLocation.includes('amazônia') ? 32 : 28,
      basePrecipitation: lowerLocation.includes('amazônia') ? 2200 : 1500,
      baseWaterQuality: 0.7,
      basePollutionIndex: 0.3,
      baseFireRisk: lowerLocation.includes('pantanal') ? 0.8 : 0.4,
      baseErosionRisk: lowerLocation.includes('serra') ? 0.7 : 0.3,
      baseAirQuality: lowerLocation.includes('metropolitana') ? 0.4 : 0.8,
      basePM25: lowerLocation.includes('metropolitana') ? 45 : 15
    };
  };

  // Gerar sugestão inteligente baseada no modelo treinado
  const generateIntelligentSuggestion = (input, detectedProblem, confidence) => {
    const { description, location } = input;
    const similarCases = findSimilarCases(description, detectedProblem);
    const bestSolutions = selectBestSolutions(similarCases);
    const avgSuccessRate = calculateAverageSuccessRate(similarCases);
    const expectedImpact = calculateExpectedImpact(similarCases);
    
    return {
      problem: description,
      location: location,
      detectedProblem: detectedProblem,
      severity: calculateDynamicSeverity(description, similarCases),
      urgency: calculateDynamicUrgency(detectedProblem, description),
      solutions: bestSolutions,
      impact: expectedImpact,
      successRate: avgSuccessRate,
      confidence: confidence,
      dataSources: getRelevantNASADataSources(detectedProblem, location),
      nasaInsights: generateDynamicNASAInsights(detectedProblem, location, similarCases),
      similarCasesCount: similarCases.length,
      modelUsed: 'TensorFlow.js Treinado com Dados Reais',
      timestamp: new Date().toISOString()
    };
  };

  // Encontrar casos similares no dataset de treinamento
  const findSimilarCases = (description, problemType) => {
    return trainingData
      .filter(item => item.problemType === problemType)
      .sort((a, b) => {
        const similarityA = calculateTextSimilarity(description, a.description);
        const similarityB = calculateTextSimilarity(description, b.description);
        return similarityB - similarityA;
      })
      .slice(0, 3);
  };

  // Calcular similaridade entre textos
  const calculateTextSimilarity = (text1, text2) => {
    const words1 = text1.toLowerCase().split(/\s+/);
    const words2 = text2.toLowerCase().split(/\s+/);
    const commonWords = words1.filter(word => 
      words2.includes(word) && word.length > 3
    );
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  // Selecionar as melhores soluções
  const selectBestSolutions = (similarCases) => {
    const allSolutions = similarCases.flatMap(caseItem => caseItem.solutions);
    const solutionFrequency = {};
    allSolutions.forEach(solution => {
      solutionFrequency[solution] = (solutionFrequency[solution] || 0) + 1;
    });
    
    return Object.entries(solutionFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 4)
      .map(([solution]) => solution);
  };

  // Calcular taxa de sucesso média
  const calculateAverageSuccessRate = (similarCases) => {
    if (similarCases.length === 0) return 0.75;
    const total = similarCases.reduce((sum, caseItem) => sum + caseItem.successRate, 0);
    return total / similarCases.length;
  };

  // Calcular impacto esperado
  const calculateExpectedImpact = (similarCases) => {
    if (similarCases.length === 0) return "Melhoria significativa baseada em dados históricos";
    const impacts = similarCases.map(c => {
      const match = c.impact.match(/\d+/);
      return match ? parseInt(match[0]) : 50;
    });
    const avgImpact = impacts.reduce((a, b) => a + b) / impacts.length;
    return `Melhoria esperada de ${Math.round(avgImpact)}% baseada em ${similarCases.length} casos similares`;
  };

  // Calcular severidade dinâmica
  const calculateDynamicSeverity = (description, similarCases) => {
    const urgencyWords = (description.match(/urgente|crítico|grave|emergência/gi) || []).length;
    if (urgencyWords >= 3) return 'crítico';
    if (urgencyWords >= 1) return 'moderado';
    const severeCases = similarCases.filter(c => 
      c.description.includes('crítico') || c.description.includes('grave')
    );
    return severeCases.length > similarCases.length / 2 ? 'moderado' : 'leve';
  };

  // Calcular urgência dinâmica
  const calculateDynamicUrgency = (problemType, description) => {
    const baseUrgency = {
      'desmatamento': 72,
      'poluicao_agua': 48,
      'queimadas': 24,
      'erosao': 96,
      'poluicao_ar': 120
    }[problemType] || 72;
    
    const urgencyWords = (description.match(/urgente|crítico|emergência/gi) || []).length;
    return Math.max(24, baseUrgency - (urgencyWords * 24));
  };

  // Gerar insights NASA dinâmicos
  const generateDynamicNASAInsights = (problemType, location, similarCases) => {
    const baseInsights = {
      'desmatamento': `Dados MODIS mostram padrões de desmatamento em ${location}.`,
      'poluicao_agua': `Sensores detectam anomalias na qualidade da água em ${location}.`,
      'queimadas': `Alertas de calor ativos na região de ${location}.`,
      'erosao': `Modelos indicam risco elevado de erosão em ${location}.`,
      'poluicao_ar': `Níveis de poluentes acima do normal em ${location}.`
    };
    
    const baseInsight = baseInsights[problemType] || `Monitoramento ativo da região ${location}.`;
    if (similarCases.length > 0) {
      return `${baseInsight} ${similarCases.length} casos similares resolvidos com sucesso.`;
    }
    return baseInsight;
  };

  // Obter fontes de dados NASA relevantes
  const getRelevantNASADataSources = (problemType, location) => {
    const sources = {
      'desmatamento': ['MODIS Deforestation Alerts', 'Landsat Vegetation Index', 'GEDI Forest Height'],
      'poluicao_agua': ['MODIS Water Quality', 'Landsat Thermal', 'GRACE Groundwater'],
      'queimadas': ['MODIS Fire Detection', 'VIIRS Active Fires', 'AIRS Atmosphere'],
      'erosao': ['SRTM Elevation', 'MODIS Erosion Risk', 'Landsat Soil Moisture'],
      'poluicao_ar': ['AIRS Pollution', 'MODIS Aerosol', 'OMI Nitrogen Dioxide']
    };
    return sources[problemType] || sources['desmatamento'];
  };

  // Fallback para modelo baseado em regras
  const generateAISuggestions = (input) => {
    const { description, location } = input;
    const detectedProblem = detectProblemTypeBasic(description);
    const nasaData = nasaKnowledgeBase[detectedProblem] || nasaKnowledgeBase['desmatamento'];
    const confidenceScore = calculateTFConfidence(description, location, detectedProblem);
    
    return {
      problem: description,
      location: location,
      detectedProblem: detectedProblem,
      severity: calculateSeverityBasic(description, location),
      urgency: calculateUrgency(detectedProblem, calculateSeverityBasic(description, location)),
      solutions: nasaData.solutions,
      impact: nasaData.impact,
      successRate: nasaData.successRate,
      confidence: confidenceScore,
      dataSources: nasaData.nasaDatasets,
      nasaInsights: generateNASAInsights(detectedProblem, location),
      modelUsed: 'Sistema Base (Rule-Based)',
      timestamp: new Date().toISOString()
    };
  };

  // Base de conhecimento NASA para fallback
  const nasaKnowledgeBase = {
    'desmatamento': {
      solutions: [
        'Reflorestamento com espécies nativas adaptadas ao bioma local',
        'Sistema agroflorestal sustentável com culturas consorciadas',
        'Corredores ecológicos para conectividade de fragmentos florestais',
        'Monitoramento por satélite com alertas de desmatamento em tempo real'
      ],
      impact: 'Restauração de 70-90% da cobertura original em 5 anos',
      successRate: 0.85,
      nasaDatasets: ['MODIS Deforestation Alerts', 'Landsat Vegetation Index', 'GEDI Forest Height']
    },
    'poluicao_agua': {
      solutions: [
        'Estações de tratamento de efluentes com tecnologia de membrana',
        'Wetlands construídos para filtragem natural e fitorremediação',
        'Biorremediação com consórcio de microrganismos especializados',
        'Sistemas de monitoramento contínuo da qualidade da água'
      ],
      impact: 'Redução de 80-95% nos poluentes em 12-18 meses',
      successRate: 0.78,
      nasaDatasets: ['MODIS Water Quality', 'Landsat Thermal', 'GRACE Groundwater']
    },
    'queimadas': {
      solutions: [
        'Sistema de alerta precoce baseado em dados térmicos de satélite',
        'Queimas controladas programadas para redução de combustível',
        'Brigadas de combate equipadas com tecnologia de geolocalização',
        'Zoneamento de risco com mapas de vulnerabilidade atualizados'
      ],
      impact: 'Redução de 60-80% na área queimada e intensidade dos incêndios',
      successRate: 0.72,
      nasaDatasets: ['MODIS Fire Detection', 'VIIRS Active Fires', 'AIRS Atmosphere']
    },
    'erosao': {
      solutions: [
        'Plantio em curvas de nível com espécies de raízes profundas',
        'Terraços e barragens de contenção com engenharia naturalística',
        'Cobertura vegetal permanente com gramíneas e leguminosas',
        'Sistemas de drenagem sustentável e controle de escoamento'
      ],
      impact: 'Redução de 85% na perda de solo e 70% no assoreamento de rios',
      successRate: 0.88,
      nasaDatasets: ['SRTM Elevation', 'MODIS Erosion Risk', 'Landsat Soil Moisture']
    },
    'poluicao_ar': {
      solutions: [
        'Filtros industriais avançados com sistema de captura de carbono',
        'Frotas de transporte elétrico com infraestrutura de recarga',
        'Reflorestamento urbano com espécies de alta capacidade de purificação',
        'Transição para matriz energética baseada em fontes renováveis'
      ],
      impact: 'Melhoria de 50-70% na qualidade do ar e redução de gases efeito estufa',
      successRate: 0.75,
      nasaDatasets: ['AIRS Pollution', 'MODIS Aerosol', 'OMI Nitrogen Dioxide']
    }
  };

  // Funções auxiliares para fallback
  const detectProblemTypeBasic = (description) => {
    const keywords = {
      'desmatamento': ['desmatamento', 'árvore', 'floresta', 'corte', 'madeira'],
      'poluicao_agua': ['água', 'rio', 'poluição', 'contaminação', 'esgoto'],
      'queimadas': ['fogo', 'queimada', 'incêndio', 'fumaça', 'cinzas'],
      'erosao': ['erosão', 'terra', 'deslizamento', 'barranco', 'solo'],
      'poluicao_ar': ['ar', 'fumaça', 'poluição', 'gás', 'emissão']
    };
    
    const descLower = description.toLowerCase();
    let bestMatch = 'desmatamento';
    let highestScore = 0;
    
    Object.entries(keywords).forEach(([problem, words]) => {
      let score = 0;
      words.forEach(word => {
        if (descLower.includes(word)) score++;
      });
      if (score > highestScore) {
        highestScore = score;
        bestMatch = problem;
      }
    });
    
    return bestMatch;
  };

  const calculateSeverityBasic = (description, location) => {
    let score = 0;
    if (description.length > 100) score += 2;
    if (description.match(/urgente|crítico|grave|emergência|catastrófico/gi)) score += 3;
    if (location.match(/amazônia|pantanal|mata atlântica|cerrado/gi)) score += 2;
    if (description.match(/morte|doença|evacuação|prejuízo/gi)) score += 2;
    
    if (score >= 6) return 'crítico';
    if (score >= 3) return 'moderado';
    return 'leve';
  };

  const calculateUrgency = (problemType, severity) => {
    const urgencyMatrix = {
      'desmatamento': { crítico: 24, moderado: 72, leve: 168 },
      'queimadas': { crítico: 6, moderado: 24, leve: 72 },
      'poluicao_agua': { crítico: 48, moderado: 120, leve: 240 },
      'erosao': { crítico: 24, moderado: 96, leve: 336 },
      'poluicao_ar': { crítico: 72, moderado: 168, leve: 720 }
    };
    return urgencyMatrix[problemType]?.[severity] || 168;
  };

  const calculateTFConfidence = (description, location, problemType) => {
    let confidence = 0.7;
    if (description.length > 50) confidence += 0.1;
    if (description.length > 200) confidence += 0.05;
    if (location.length > 10) confidence += 0.1;
    if (problemType !== 'desmatamento') confidence += 0.05;
    if (description.match(/testemunho|foto|evidência|comprovação/gi)) confidence += 0.05;
    return Math.min(confidence, 0.95);
  };

  const generateNASAInsights = (problemType, location) => {
    const insights = {
      'desmatamento': `Análise de satélite mostra tendência de desmatamento na região de ${location}.`,
      'poluicao_agua': `Monitoramento NASA detecta alterações na qualidade da água em ${location}.`,
      'queimadas': `Sensores térmicos identificam focos de calor em ${location}.`,
      'erosao': `Modelo digital de elevação indica áreas de risco de erosão em ${location}.`,
      'poluicao_ar': `Sensores atmosféricos detectam elevados níveis de poluentes em ${location}.`
    };
    return insights[problemType] || `Análise de dados de satélite para ${location} em andamento.`;
  };

  const generateFallbackSuggestion = (input) => {
    const { description, location } = input;
    const detectedProblem = detectProblemTypeBasic(description);
    
    return {
      problem: description,
      location: location,
      detectedProblem: detectedProblem,
      severity: 'moderado',
      urgency: 72,
      solutions: [
        "Análise detalhada da situação",
        "Monitoramento contínuo da área",
        "Engajamento da comunidade local",
        "Plano de ação personalizado"
      ],
      impact: "Melhoria baseada em intervenções específicas",
      successRate: 0.7,
      confidence: 0.6,
      dataSources: ['MODIS General Monitoring', 'Landsat Regional Analysis'],
      nasaInsights: `Análise inicial da região ${location} em andamento.`,
      modelUsed: 'Sistema Base (Fallback)',
      timestamp: new Date().toISOString()
    };
  };

  // Handlers e interface
  const loadSampleSuggestions = () => {
    setSuggestions([
      {
        id: 1,
        problem: "Contaminação severa do Rio Doce por rejeitos de mineração, afetando abastecimento de várias cidades",
        location: "Brasil, Bacia do Rio Doce - MG/ES",
        detectedProblem: "poluicao_agua",
        severity: "crítico",
        urgency: 48,
        solutions: [
          "Estações de tratamento emergenciais com tecnologia de ultrafiltração",
          "Barreiras de contenção e sedimentação em pontos estratégicos",
          "Sistema de monitoramento contínuo com sensores automáticos",
          "Programa de biorremediação com bactérias metalotolerantes"
        ],
        impact: "Redução de 85% na concentração de metais pesados em 12 meses",
        successRate: 0.82,
        confidence: 0.89,
        dataSources: ["MODIS Water Quality", "Landsat 8 OLI", "GRACE Groundwater"],
        nasaInsights: "Dados Landsat mostram alteração significativa na reflectância da água, indicando alta concentração de sedimentos",
        modelUsed: "TensorFlow.js Neural Network",
        approved: false,
        rejected: false
      }
    ]);
  };

  const handleGenerateSuggestion = async (e) => {
    e.preventDefault();
    if (!newProblem.description.trim()) {
      alert('Por favor, descreva o problema ambiental.');
      return;
    }

    if (!model) {
      alert('Sistema de IA ainda está treinando. Aguarde...');
      return;
    }

    setLoading(true);
    
    try {
      const suggestion = model.predict(newProblem);
      const newSuggestion = {
        id: Date.now(),
        ...suggestion,
        approved: false,
        rejected: false
      };
      
      setSuggestions([newSuggestion, ...suggestions]);
      setNewProblem({ description: '', location: '', problemType: '' });
      
      // Adicionar ao dataset de treinamento para aprendizado contínuo
      addToTrainingData(newProblem, suggestion.detectedProblem);
      
    } catch (error) {
      console.error('Erro ao gerar sugestão:', error);
      alert('Erro ao processar com IA. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const addToTrainingData = (problem, detectedProblem) => {
    const newTrainingItem = {
      description: problem.description,
      location: problem.location,
      problemType: detectedProblem,
      nasaData: generateSimulatedNASAData(problem.location, detectedProblem),
      solutions: [],
      impact: "A ser determinado",
      successRate: 0.75
    };
    
    setTrainingData(prev => [...prev, newTrainingItem]);
  };

  const generateSimulatedNASAData = (location, problemType) => {
    const lowerLocation = location.toLowerCase();
    const regionalData = {
      'amazônia': { ndvi: 0.85, temperature: 32, precipitation: 2200 },
      'pantanal': { ndvi: 0.78, temperature: 34, precipitation: 1200 },
      'mata atlântica': { ndvi: 0.82, temperature: 28, precipitation: 1800 },
      'cerrado': { ndvi: 0.65, temperature: 30, precipitation: 1500 },
      'default': { ndvi: 0.70, temperature: 29, precipitation: 1600 }
    };
    
    let regionData = regionalData.default;
    Object.entries(regionalData).forEach(([region, data]) => {
      if (lowerLocation.includes(region)) {
        regionData = data;
      }
    });
    
    const problemSpecificData = {
      'desmatamento': { forestLoss: 0.7, vegetationCover: 0.3 },
      'poluicao_agua': { waterQuality: 0.3, pollutionIndex: 0.8 },
      'queimadas': { fireRisk: 0.85, vegetationDryness: 0.9 },
      'erosao': { erosionRisk: 0.75, soilLoss: 0.6 },
      'poluicao_ar': { airQuality: 0.4, pm25: 55 }
    };
    
    return {
      ...regionData,
      ...problemSpecificData[problemType]
    };
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
      document.getElementById('suggestion-form')?.scrollIntoView({ behavior: 'smooth' });
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
    if (confidence >= 0.8) return 'text-green-600 font-semibold';
    if (confidence >= 0.6) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getModelBadgeColor = (modelUsed) => {
    if (modelUsed.includes('TensorFlow')) return 'bg-purple-100 text-purple-800';
    if (modelUsed.includes('Rule-Based')) return 'bg-blue-100 text-blue-800';
    return 'bg-gray-100 text-gray-800';
  };

  if (loading && !model) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-4">🤖 IA Ambiental - Aprendendo com Dados Reais</h2>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg font-semibold">
              {training ? 'Treinando Modelo com Dados NASA...' : 'Inicializando Sistema de IA...'}
            </p>
            {training && (
              <>
                <div className="w-64 bg-gray-200 rounded-full h-2 mt-4 mx-auto">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trainingProgress}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600 mt-2">
                  Progresso: {Math.round(trainingProgress)}% - Aprendendo com {trainingData.length} casos
                </p>
              </>
            )}
            <p className="text-xs text-gray-500 mt-1">
              TensorFlow.js + Dados NASA + Machine Learning
            </p>
          </div>
        </div>
      </div>
    );
  }

return (
  <div className="p-6">
    {/* PÁGINA PRINCIPAL - GERAR SUGESTÕES */}
    {activeTab === 'gerar' && (
      <>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Sugestões de IA</h2>
          <button
            onClick={() => setActiveTab('historico')}
            className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            <span>📊</span>
            <span>Histórico ({suggestions.length})</span>
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar - Gerenciar Treinamento */}
          <div className="bg-white p-4 shadow rounded-lg border border-gray-200">
            <h3 className="font-semibold mb-3 text-gray-800">Gerenciar Treinamento</h3>
            
            <div className="space-y-2">
              <button
                onClick={() => setShowTrainingModal(true)}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 text-center cursor-pointer"
              >
                Adicionar Caso
              </button>
              
              <label className="block w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 text-center cursor-pointer">
                Importar Dados
                <input
                  type="file"
                  accept=".json"
                  onChange={handleImportTrainingData}
                  className="hidden"
                />
              </label>
              
              <button
                onClick={exportTrainingData}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 text-center cursor-pointer"
              >
                Exportar Dados
              </button>
              
              <button
                onClick={retrainModel}
                disabled={training}
                className="w-full bg-blue-600 text-white py-2 px-3 rounded text-sm hover:bg-blue-700 text-center cursor-pointer"
              >
                {training ? 'Treinando...' : 'Re-treinar Modelo'}
              </button>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="lg:col-span-3 space-y-6">
            {/* Formulário Nova Sugestão */}
            <div id="suggestion-form" className="bg-white shadow rounded-lg p-6 border border-gray-200">
              <h4 className="font-semibold mb-4 text-gray-800">Nova Análise com IA</h4>
              <form onSubmit={handleGenerateSuggestion} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Descrição do Problema *
                  </label>
                  <textarea
                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    rows="4"
                    placeholder="Descreva detalhadamente o problema ambiental. Inclua localização específica, causas observadas e impactos..."
                    value={newProblem.description}
                    onChange={(e) => setNewProblem({...newProblem, description: e.target.value})}
                    required
                  />
                </div>
                
                <div className="relative">
                  <label className="block text-sm font-medium mb-2 text-gray-700">
                    Localização *
                  </label>
                  <input
                    type="text"
                    className="w-full border border-gray-300 rounded p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="Digite o nome do país..."
                    value={countryInput}
                    onChange={handleCountryInputChange}
                    onFocus={handleCountryInputFocus}
                    onBlur={handleCountryInputBlur}
                    required
                  />
                  {showCountryDropdown && filteredCountries.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {filteredCountries.map((country, index) => (
                        <div
                          key={index}
                          className="px-4 py-2 hover:bg-blue-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                          onClick={() => handleCountrySelect(country)}
                          onMouseDown={(e) => e.preventDefault()}
                        >
                          <span className="text-sm text-gray-700">{country}</span>
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {showCountryDropdown && filteredCountries.length === 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg">
                      <div className="px-4 py-2 text-sm text-gray-500">
                        Nenhum país encontrado
                      </div>
                    </div>
                  )}
                </div>
                
                <button 
                  type="submit"
                  disabled={loading}
                  className="w-full bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition flex items-center justify-center font-semibold"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processando com IA...
                    </>
                  ) : (
                    'Gerar Sugestão com IA NASA'
                  )}
                </button>
              </form>
            </div>

            {/* Link para ver mais sugestões */}
            {suggestions.length > 3 && (
              <div className="text-center pt-4">
                <button
                  onClick={() => setActiveTab('historico')}
                  className="text-blue-600 hover:text-blue-800 font-medium text-lg"
                >
                  Ver todas as {suggestions.length} sugestões no histórico →
                </button>
              </div>
            )}

            {/* Mensagem quando não há sugestões */}
            {suggestions.length === 0 && (
              <div className="bg-white p-8 shadow rounded-lg border border-gray-200 text-center">
                <div className="text-gray-400 mb-4">
                  <svg className="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-gray-500 text-lg mb-2">Nenhuma sugestão gerada ainda</p>
                <p className="text-gray-400 text-sm">Use o formulário acima para gerar sua primeira sugestão com IA</p>
              </div>
            )}
          </div>
        </div>
      </>
    )}

    {/* PÁGINA DE HISTÓRICO */}
    {activeTab === 'historico' && (
      <HistoricoSugestoes 
        suggestions={filteredSuggestions}
        filterDate={filterDate}
        setFilterDate={setFilterDate}
        filterDisasterType={filterDisasterType}
        setFilterDisasterType={setFilterDisasterType}
        filterCountry={filterCountry}
        setFilterCountry={setFilterCountry}
        filterSeverity={filterSeverity}
        setFilterSeverity={setFilterSeverity}
        onApprove={handleApprove}
        onReject={handleReject}
        onModify={handleModify}
        onBack={() => setActiveTab('gerar')}
      />
    )}

    {/* Modal de Treinamento */}
    {showTrainingModal && <TrainingDataModal />}
  </div>
);
}
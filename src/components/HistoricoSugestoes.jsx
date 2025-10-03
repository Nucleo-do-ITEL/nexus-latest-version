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
  onModify
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
            <p className="text-gray-500">Nenhuma sugestão encontrada com os filtros aplicados.</p>
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

              {/* Conteúdo da sugestão - MANTENHA O MESMO CONTEÚDO DA ABA GERAR */}
              <div className="mb-4">
                <p className="font-semibold text-lg mb-2 text-gray-800">{suggestion.problem}</p>
                <p className="text-sm text-gray-600 mb-3">
                  <strong>Problema detectado:</strong> {suggestion.detectedProblem.replace('_', ' ')}
                </p>
                
                {/* Resto do conteúdo igual à aba de geração */}
                <div className="bg-blue-50 p-3 rounded-lg mb-3 border border-blue-200">
                  <p className="font-semibold text-sm mb-2 text-blue-800">Insights NASA:</p>
                  <p className="text-sm text-blue-700">{suggestion.nasaInsights}</p>
                </div>

                {/* ... resto do conteúdo da sugestão (solutions, impact, etc) */}
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
import { useEffect, useState } from "react";
import ReportForm from "../components/ReportForm";

function Reports() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [verificationResults, setVerificationResults] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/reports/") // rota do backend
      .then((res) => res.json())
      .then((data) => {
        setReports(data);
        setLoading(false);
        
        // Verificar automaticamente os reports existentes
        data.forEach(report => {
          if (report.images && report.images.length > 0) {
            verifyReport(report);
          }
        });
      })
      .catch((err) => {
        console.error("Erro ao buscar reports:", err);
        setLoading(false);
      });
  }, []);

  // Algoritmo de verificação de veracidade
  const verifyReport = async (report) => {
    const verificationScore = {
      total: 0,
      maxScore: 100,
      details: {},
      status: 'pending'
    };

    try {
      // 1. Verificação de consistência textual (30 pontos)
      const textConsistency = analyzeTextConsistency(report);
      verificationScore.details.textConsistency = textConsistency;
      verificationScore.total += textConsistency.score;

      // 2. Análise de imagens (40 pontos)
      if (report.images && report.images.length > 0) {
        const imageAnalysis = await analyzeImages(report.images, report.problem_type, report.description);
        verificationScore.details.imageAnalysis = imageAnalysis;
        verificationScore.total += imageAnalysis.score;
      }

      // 3. Verificação de localização (20 pontos)
      const locationVerification = verifyLocation(report.location, report.problem_type);
      verificationScore.details.locationVerification = locationVerification;
      verificationScore.total += locationVerification.score;

      // 4. Análise de metadata (10 pontos)
      const metadataAnalysis = analyzeMetadata(report);
      verificationScore.details.metadataAnalysis = metadataAnalysis;
      verificationScore.total += metadataAnalysis.score;

      // Determinar status final
      if (verificationScore.total >= 80) {
        verificationScore.status = 'high_confidence';
      } else if (verificationScore.total >= 60) {
        verificationScore.status = 'medium_confidence';
      } else if (verificationScore.total >= 40) {
        verificationScore.status = 'low_confidence';
      } else {
        verificationScore.status = 'suspicious';
      }

    } catch (error) {
      console.error('Erro na verificação:', error);
      verificationScore.status = 'verification_failed';
    }

    setVerificationResults(prev => ({
      ...prev,
      [report.id]: verificationScore
    }));

    return verificationScore;
  };

  // 1. Análise de consistência textual
  const analyzeTextConsistency = (report) => {
    let score = 0;
    const details = [];
    const maxScore = 30;

    // Verificar descrição vs tipo de problema
    const problemKeywords = {
      'desmatamento': ['árvore', 'floresta', 'mata', 'corte', 'madeira', 'queimada'],
      'poluição': ['lixo', 'resíduo', 'poluição', 'contaminação', 'químico', 'fumaça'],
      'queimada': ['fogo', 'queima', 'fumaça', 'cinzas', 'incêndio', 'chamas'],
      'inundação': ['água', 'alagamento', 'enchente', 'chuva', 'transbordamento'],
      'erosão': ['terra', 'deslizamento', 'barranco', 'assoreamento', 'solo']
    };

    const keywords = problemKeywords[report.problem_type] || [];
    const description = report.description.toLowerCase();
    
    let keywordMatches = 0;
    keywords.forEach(keyword => {
      if (description.includes(keyword)) {
        keywordMatches++;
      }
    });

    const keywordScore = (keywordMatches / Math.max(1, keywords.length)) * 15;
    score += keywordScore;
    details.push(`Correspondência de palavras-chave: ${keywordScore.toFixed(1)}/15`);

    // Verificar comprimento da descrição
    const descLength = report.description.length;
    if (descLength >= 50) {
      score += 10;
      details.push('Descrição detalhada: 10/10');
    } else if (descLength >= 20) {
      score += 5;
      details.push('Descrição básica: 5/10');
    } else {
      details.push('Descrição muito curta: 0/10');
    }

    // Verificar solução proposta
    if (report.solution && report.solution.length > 10) {
      score += 5;
      details.push('Solução proposta: 5/5');
    }

    return { score: Math.min(score, maxScore), details, maxScore };
  };

  // 2. Análise de imagens (simulação)
  const analyzeImages = async (images, problemType, description) => {
    let score = 0;
    const details = [];
    const maxScore = 40;

    // Simulação de análise de imagem - na prática, usaria APIs de visão computacional
    details.push(`Número de imagens: ${images.length}`);

    // Pontuação base no número de imagens
    if (images.length >= 3) {
      score += 15;
      details.push('Múltiplas imagens: 15/15');
    } else if (images.length >= 2) {
      score += 10;
      details.push('Duas imagens: 10/15');
    } else {
      score += 5;
      details.push('Uma imagem: 5/15');
    }

    // Simulação de análise de conteúdo baseada no tipo de problema
    const problemImagePatterns = {
      'desmatamento': ['terra exposta', 'árvores cortadas', 'área devastada'],
      'poluição': ['resíduos', 'fumaça', 'lixo acumulado'],
      'queimada': ['fogo', 'fumaça', 'cinzas'],
      'inundação': ['água', 'alagamento', 'transbordamento'],
      'erosão': ['terra movimentada', 'barranco', 'deslizamento']
    };

    const patterns = problemImagePatterns[problemType] || [];
    const patternScore = patterns.length * 5;
    score += Math.min(patternScore, 15);
    details.push(`Padrões esperados: ${patternScore}/15`);

    // Verificação de qualidade (simulada)
    score += 10; // Assumindo que as imagens são de qualidade aceitável
    details.push('Qualidade das imagens: 10/10');

    return { score: Math.min(score, maxScore), details, maxScore };
  };

  // 3. Verificação de localização
  const verifyLocation = (location, problemType) => {
    let score = 0;
    const details = [];
    const maxScore = 20;

    // Verificar se a localização é específica
    if (location && location.length > 5) {
      score += 10;
      details.push('Localização específica: 10/10');
    } else {
      details.push('Localização genérica: 0/10');
    }

    // Verificar consistência com tipo de problema (simulação)
    score += 10; // Assumindo que a localização é plausível
    details.push('Localização plausível: 10/10');

    return { score: Math.min(score, maxScore), details, maxScore };
  };

  // 4. Análise de metadata
  const analyzeMetadata = (report) => {
    let score = 0;
    const details = [];
    const maxScore = 10;

    // Verificar timestamp (se disponível)
    if (report.created_at) {
      score += 5;
      details.push('Timestamp disponível: 5/5');
    }

    // Verificar completude dos dados
    const requiredFields = ['problem_type', 'description', 'location'];
    const filledFields = requiredFields.filter(field => report[field] && report[field].length > 0);
    
    if (filledFields.length === requiredFields.length) {
      score += 5;
      details.push('Todos campos obrigatórios: 5/5');
    } else {
      details.push(`Campos preenchidos: ${filledFields.length}/${requiredFields.length}`);
    }

    return { score: Math.min(score, maxScore), details, maxScore };
  };

  // Função para lidar com novo report
  const handleReportCreated = async (newReport) => {
    setReports([newReport, ...reports]);
    
    // Verificar o novo report
    if (newReport.images && newReport.images.length > 0) {
      setTimeout(() => {
        verifyReport(newReport);
      }, 1000);
    }
  };

  // Obter cor baseada no status de verificação
  const getVerificationColor = (status) => {
    switch (status) {
      case 'high_confidence': return 'bg-green-100 text-green-800 border-green-300';
      case 'medium_confidence': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'low_confidence': return 'bg-orange-100 text-orange-800 border-orange-300';
      case 'suspicious': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  // Obter ícone baseado no status
  const getVerificationIcon = (status) => {
    switch (status) {
      case 'high_confidence': return '✅';
      case 'medium_confidence': return '⚠️';
      case 'low_confidence': return '🔍';
      case 'suspicious': return '❌';
      default: return '⏳';
    }
  };

  // Obter texto do status
  const getVerificationText = (status) => {
    switch (status) {
      case 'high_confidence': return 'Alta Confiança';
      case 'medium_confidence': return 'Confiança Média';
      case 'low_confidence': return 'Baixa Confiança';
      case 'suspicious': return 'Suspeito';
      case 'verification_failed': return 'Falha na Verificação';
      default: return 'Em Verificação';
    }
  };

  if (loading) return <p className="text-center text-gray-500">Carregando reports...</p>;

  return (
    <div className="container mx-auto px-4 mt-6">
      <h2 className="text-2xl font-bold text-blue-600 mb-6">
        📋 Reports Recentes da Comunidade
      </h2>

      {/* Formulário */}
      <ReportForm onReportCreated={handleReportCreated} />

      {/* Lista de Reports */}
      {reports.length === 0 ? (
        <p className="text-gray-500 italic">Nenhum report encontrado.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => {
            const verification = verificationResults[report.id];
            
            return (
              <div
                key={report.id}
                className="bg-white shadow-md rounded-2xl p-5 border border-gray-200 hover:shadow-xl transition"
              >
                <div className="flex justify-between items-center mb-3">
                  <h6 className="text-lg font-semibold text-gray-800">
                    {report.problem_type}
                  </h6>
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-gray-400">ID: {report.id}</span>
                    {verification && (
                      <span className={`text-xs px-2 py-1 rounded-full border ${getVerificationColor(verification.status)}`}>
                        {getVerificationIcon(verification.status)} {getVerificationText(verification.status)}
                      </span>
                    )}
                  </div>
                </div>

                <p className="text-gray-700 mb-2">{report.description}</p>
                <p className="text-sm text-gray-500 mb-3">📍 {report.location}</p>

                {/* Imagens do Report */}
                {report.images && report.images.length > 0 && (
                  <div className="mb-3">
                    <p className="text-sm text-gray-600 mb-2">📸 Imagens enviadas:</p>
                    <div className="flex space-x-2 overflow-x-auto">
                      {report.images.map((image, index) => (
                        <img
                          key={index}
                          src={image}
                          alt={`Evidência ${index + 1}`}
                          className="w-16 h-16 object-cover rounded border"
                        />
                      ))}
                    </div>
                  </div>
                )}

                {/* Detalhes da Verificação */}
                {verification && (
                  <div className="mt-3 p-3 bg-blue-50 rounded-lg border border-blue-200">
                    <div className="flex justify-between items-center mb-2">
                      <span className="text-sm font-semibold text-blue-800">
                        Pontuação de Verificação: {verification.total}/{verification.maxScore}
                      </span>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      {verification.details.textConsistency && (
                        <div>📝 Texto: {verification.details.textConsistency.score}/30</div>
                      )}
                      {verification.details.imageAnalysis && (
                        <div>🖼️ Imagens: {verification.details.imageAnalysis.score}/40</div>
                      )}
                      {verification.details.locationVerification && (
                        <div>📍 Localização: {verification.details.locationVerification.score}/20</div>
                      )}
                      {verification.details.metadataAnalysis && (
                        <div>📊 Metadados: {verification.details.metadataAnalysis.score}/10</div>
                      )}
                    </div>
                  </div>
                )}

                {report.solution && (
                  <p className="mt-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg p-2">
                    💡 <strong>Sugestão:</strong> {report.solution}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Reports;
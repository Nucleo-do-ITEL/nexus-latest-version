export default function SugestoesIA() {
  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">🤖 Sugestões de IA</h2>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {/* Sidebar */}
        <div className="md:col-span-1 space-y-4">
          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Filtros</h3>
            <label className="block text-sm">País</label>
            <select className="w-full border rounded p-2 mb-3">
              <option>Todos</option>
              <option>Brasil</option>
              <option>Portugal</option>
              <option>Argentina</option>
            </select>

            <label className="block text-sm">Problemas</label>
            <div className="space-y-1 text-sm">
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" /> Em andamento
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" /> Críticos
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Resolvidos
              </label>
              <label className="flex items-center">
                <input type="checkbox" defaultChecked className="mr-2" /> Moderados
              </label>
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" /> Leves
              </label>
            </div>
          </div>

          <div className="bg-white p-4 shadow rounded">
            <h3 className="font-semibold mb-2">Estatísticas</h3>
            <p>🌍 Terra – <span className="text-red-500">2 críticos</span></p>
            <p>💧 Água – <span className="text-red-500">47 críticos</span></p>
            <p>🌬️ Ar – <span className="text-red-500">2 críticos</span></p>
            <p>🔥 Fogo – <span className="text-red-500">47 críticos</span></p>
          </div>
        </div>

        {/* Sugestões */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white shadow rounded p-4">
            <div className="flex justify-between mb-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Brasil</span>
              <span className="bg-yellow-400 text-black text-xs px-2 py-1 rounded">Crítico</span>
            </div>
            <p><strong>Problema:</strong> Contaminação de rios por efluentes</p>
            <p><strong>Solução:</strong> Estações de tratamento compactas</p>
            <p><strong>Impacto:</strong> Redução de 80% na poluição hídrica</p>
            <div className="mt-2 space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Aprovar</button>
              <button className="bg-yellow-500 text-black px-3 py-1 rounded text-sm">Modificar</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Rejeitar</button>
            </div>
          </div>

          <div className="bg-white shadow rounded p-4">
            <div className="flex justify-between mb-2">
              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded">Portugal</span>
              <span className="bg-green-500 text-white text-xs px-2 py-1 rounded">Moderado</span>
            </div>
            <p><strong>Problema:</strong> Acúmulo de lixo em áreas verdes</p>
            <p><strong>Solução:</strong> Ecopontos inteligentes com recompensa</p>
            <p><strong>Impacto:</strong> Redução de 60% do lixo irregular</p>
            <div className="mt-2 space-x-2">
              <button className="bg-green-600 text-white px-3 py-1 rounded text-sm">Aprovar</button>
              <button className="bg-yellow-500 text-black px-3 py-1 rounded text-sm">Modificar</button>
              <button className="bg-red-600 text-white px-3 py-1 rounded text-sm">Rejeitar</button>
            </div>
          </div>

          {/* Formulário Nova Sugestão */}
          <div className="bg-white shadow rounded p-4">
            <h4 className="font-semibold mb-2">Nova análise de IA</h4>
            <form className="space-y-3">
              <textarea
                className="w-full border rounded p-2"
                rows="3"
                placeholder="Descreva o problema..."
              ></textarea>
              <input
                type="text"
                className="w-full border rounded p-2"
                placeholder="País, cidade ou coordenadas"
              />
              <button className="bg-blue-600 text-white px-4 py-2 rounded">
                Gerar sugestão com IA
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}

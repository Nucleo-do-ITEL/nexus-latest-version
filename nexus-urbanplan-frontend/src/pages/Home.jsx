import { Link } from "react-router-dom";

function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 text-white text-center p-6">
      <h1 className="text-5xl font-bold mb-4">🌍 Bem-vindo ao Nexus UrbanPlan</h1>
      <p className="text-lg mb-6 max-w-xl">
        Uma plataforma inteligente para monitoramento urbano, relatórios
        comunitários e soluções colaborativas para cidades mais seguras.
      </p>
      <div className="space-x-4">
        <Link
          to="/login"
          className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition"
        >
          Login
        </Link>
        <Link
          to="/register"
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-semibold hover:bg-yellow-300 transition"
        >
          Criar Conta
        </Link>
      </div>
    </div>
  );
}

export default Home;

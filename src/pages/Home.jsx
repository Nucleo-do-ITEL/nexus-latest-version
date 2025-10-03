import { Link } from "react-router-dom";
import Dashboard from "./Dashboard";

function Home() {
  return (
    <>
    <div className="flex flex-col items-center justify-center bg-[linear-gradient(135deg,#0042A6,#07173F)] text-white text-center p-6">
      <h1 className="text-5xl font-bold mb-4">Bem-vindo ao Nexus UrbanPlan</h1>
      <p className="text-lg mb-6 max-w-xl">
        Uma plataforma inteligente para monitoramento urbano, relatórios
        comunitários e soluções colaborativas para cidades mais seguras.
      </p>
    </div>
    <Dashboard />
    </>
  );
}

export default Home;

import { Link } from "react-router-dom";
import avatarImg from "../avatar.png";
import reportsImg from "../reports.png";
import sugestionsImg from "../sugestions.png";

export default function Dashboard() {
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Card Monitoramento */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 border rounded-xl shadow p-6 bg-white">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-700">Monitoramento</h2>
          <p className="text-gray-600">
            Acesse dados em tempo real sobre qualidade do ar, ilhas de calor e riscos
            ambientais para ajudar no planejamento urbano inteligente.
          </p>
          <Link
            to="/monitoramento"
            className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition"
          >
            Ir para Monitoramento
          </Link>
        </div>
        <img
          src={avatarImg}
          alt="Monitoramento"
          className="w-[500px] rounded-xl shadow mx-auto"
        />
      </div>

      {/* Card Reports */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 border rounded-xl shadow p-6 bg-white">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-green-700">Reports</h2>
          <p className="text-gray-600">
            Gere relatórios personalizados com base nos dados coletados pela plataforma
            e crie insights úteis para secretarias e gestores.
          </p>
          <Link
            to="/reports"
            className="px-4 py-2 bg-green-600 text-white text-center rounded hover:bg-green-700 transition"
          >
            Ir para Reports
          </Link>
        </div>
        <img
          src={reportsImg}
          alt="Reports"
          className="w-[500px] rounded-xl shadow mx-auto"
        />
      </div>

      {/* Card Sugestões IA */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6 border rounded-xl shadow p-6 bg-white">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-purple-700">Sugestões de IA</h2>
          <p className="text-gray-600">
            Explore recomendações automáticas da inteligência artificial para ações de
            mitigação, adaptação climática e melhorias urbanas.
          </p>
          <Link
            to="/sugestoes-ia"
            className="px-4 py-2 bg-purple-600 text-white text-center rounded hover:bg-purple-700 transition"
          >
            Ir para Sugestões de IA
          </Link>
        </div>
        <img
          src={sugestionsImg}
          alt="Sugestões de IA"
          className="w-[500px] rounded-xl shadow mx-auto"
        />
      </div>
    </div>
  );
}

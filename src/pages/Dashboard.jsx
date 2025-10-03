import { Link } from "react-router-dom";
import avatarImg from "../avatar.png";
import reportsImg from "../reports.png";
import sugestionsImg from "../sugestions.png";

export default function Dashboard() {
  return (
    <>
    {/* Card Monitoramento */}
    <img src={avatarImg} alt="Avatar"/>
    <div className="flex gap-6 p-6">
      {/* Card Monitoramento */}
      <div className="items-center gap-6 border rounded-xl shadow p-6 bg-white hover:animate-breathe-float">
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
      </div>

      {/* Card Reports */}
      <div className="items-center gap-6 border rounded-xl shadow p-6 bg-white hover:animate-breathe-float">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-700">Reports</h2>
          <p className="text-gray-600">
            Gere relatórios personalizados com base nos dados coletados pela plataforma
            e crie insights úteis para secretarias e gestores.
          </p>
          <Link
            to="/reports"
            className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition"
          >
            Ir para Reports
          </Link>
        </div>
      </div>

      {/* Card Sugestões IA */}
      <div className="items-center border rounded-xl shadow p-6 bg-white hover:animate-breathe-float">
        <div className="flex flex-col gap-4">
          <h2 className="text-xl font-bold text-blue-700">Sugestões de IA</h2>
          <p className="text-gray-600">
            Explore recomendações automáticas da inteligência artificial para ações de
            mitigação, adaptação climática e melhorias urbanas.
          </p>
          <Link
            to="/sugestoes-ia"
            className="px-4 py-2 bg-blue-600 text-white text-center rounded hover:bg-blue-700 transition"
          >
            Ir para Sugestões de IA
          </Link>
        </div>
      </div>
    </div></>
  );
}

import { Link, useNavigate } from "react-router-dom";

export default function Navbar() {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // apaga token
    navigate("/"); // manda pro home
  };

  return (
    <nav className="flex justify-between items-center bg-[#07173F] text-white px-6 py-4 shadow-md">
      <h1 className="text-xl font-bold">Nexus UrbanPlan</h1>

      <ul className="flex gap-6">
        {!token ? (
          // 👉 Navbar antes do login
          <>
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/about" className="hover:underline">About</Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">Contact</Link>
            </li>
            <li>
              <Link to="/login" className="hover:underline">Login</Link>
            </li>
            <li>
              <Link to="/register" className="hover:underline">Registrar</Link>
            </li>
          </>
        ) : (
          // 👉 Navbar depois do login
          <>
            <li>
              <Link to="/" className="hover:underline">Home</Link>
            </li>
            <li>
              <Link to="/monitoramento" className="hover:underline">Monitoramento</Link>
            </li>
            <li>
              <Link to="/reports" className="hover:underline">Reports</Link>
            </li>
            <li>
              <Link to="/sugestoes-ia" className="hover:underline">Sugestões IA</Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-500 transition"
              >
                Logout
              </button>
            </li>
          </>
        )}
      </ul>
    </nav>
  );
}

import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Monitoramento from "./pages/Monitoramento"
import Reports from "./pages/Reports"
import SugestoesIA from "./pages/SugestoesIA"
import Login from "./pages/Login"
import Register from "./pages/Register"
import Dashboard from "./pages/Dashboard"

const isAuthenticated = () => {
  return localStorage.getItem("token") !== null;
};

function PrivateRoute({ children }) {
  return isAuthenticated() ? children : <Navigate to="/login" />;
}

// Navbar simples para navegar entre páginas
function Navbar() {
  return (
    <nav className="flex justify-between items-center px-6 py-4 bg-white shadow">
      <div className="flex items-center gap-2">
        <h1 className="font-bold text-lg text-blue-600">NEXUS URBANPLAN</h1>
      </div>
      <div className="flex gap-4">
        <Link to="/" className="hover:text-blue-600">Home</Link>
        <Link to="/about" className="hover:text-blue-600">About</Link>
        <Link to="/contact" className="hover:text-blue-600">Contact</Link>
        <Link to="/monitoramento" className="hover:text-blue-600">Monitoramento</Link>
        <Link to="/reports" className="hover:text-blue-600">Reports</Link>
        <Link to="/sugestoes-ia" className="hover:text-blue-600">Sugestões IA</Link>
	<Link to="/login"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >Login
            </Link>
      </div>
    </nav>
  )
}

// App principal com rotas
export default function App() {
  return (
    <Router>
      <Navbar />
      <div className="p-6">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/monitoramento" element={<PrivateRoute><Monitoramento /></PrivateRoute>} />
          <Route path="/reports" element={<PrivateRoute><Reports /></PrivateRoute>} />
          <Route path="/sugestoes-ia" element={<PrivateRoute><SugestoesIA /></PrivateRoute>} />
	  <Route path="/login" element={<Login />} />
	  <Route path="/register" element={<Register />} />
	  <Route
          path="/dashboard"
          element={
            <PrivateRoute>
              <Dashboard />
            </PrivateRoute>
          }
        />
        </Routes>
      </div>
    </Router>
  )
}

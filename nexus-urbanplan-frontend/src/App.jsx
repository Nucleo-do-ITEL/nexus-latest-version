import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom"
import Home from "./pages/Home"
import About from "./pages/About"
import Contact from "./pages/Contact"
import Monitoramento from "./pages/Monitoramento"
import Reports from "./pages/Reports"
import SugestoesIA from "./pages/SugestoesIA"

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
          <Route path="/monitoramento" element={<Monitoramento />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="/sugestoes-ia" element={<SugestoesIA />} />
        </Routes>
      </div>
    </Router>
  )
}

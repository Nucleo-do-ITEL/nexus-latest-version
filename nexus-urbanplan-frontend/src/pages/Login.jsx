import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();

    // 🔒 Simulação de login - aqui depois vai entrar a chamada ao backend
    if (email.trim() && password.trim()) {
      // Salva um token fake para simular usuário autenticado
      localStorage.setItem("token", "fake-jwt-token");

      // Redireciona automaticamente para o Dashboard
      navigate("/dashboard");
    } else {
      alert("Preencha os campos corretamente!");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleLogin}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>

        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        />

        <input
          type="password"
          placeholder="Senha"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-3 p-2 border rounded-lg"
          required
        />

        <button
          type="submit"
          className="w-full bg-blue-600 text-white p-2 rounded-lg hover:bg-blue-700 transition"
        >
          Entrar
        </button>

        <p className="text-sm mt-3 text-center">
          Ainda não tem conta?{" "}
          <Link to="/register" className="text-blue-600 hover:underline">
            Criar Conta
          </Link>
        </p>
      </form>
    </div>
  );
}

// src/components/PrivateRoute.jsx
import { Navigate } from "react-router-dom";

export default function PrivateRoute({ children }) {
  const token = localStorage.getItem("token"); // pega token do login

  if (!token) {
    // Se não tiver token, manda para o login
    return <Navigate to="/login" replace />;
  }

  // Se tiver token, renderiza a página
  return children;
}

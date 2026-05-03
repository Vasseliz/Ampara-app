import { Outlet, Navigate } from "react-router-dom";

export function PacienteRoute() {
  const isPaciente = true; // temporario enquanto não implementamos a autenticação

  if (!isPaciente) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
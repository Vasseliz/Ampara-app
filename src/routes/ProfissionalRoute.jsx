import { Outlet, Navigate } from "react-router-dom";

export function ProfissionalRoute() {
  const isProfissional = true; // temporario enquanto não implementamos a autenticação

  if (!isProfissional) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
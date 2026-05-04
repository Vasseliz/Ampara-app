import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

export function ProfissionalRoute() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div style={{ padding: "2rem", textAlign: "center", color: "#6b7280", fontSize: "0.9rem" }}>
                Carregando…
            </div>
        );
    }

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role !== "professional") {
        return <Navigate to="/" replace />;
    }

    return <Outlet />;
}
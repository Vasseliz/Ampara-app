import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../contexts/AuthContext";
import { toast } from "../../../shared/atoms/toast/Toast";

export function useLogin() {
    const navigate = useNavigate();
    const { refresh } = useAuth();
    const [loading, setLoading] = useState(false);

    async function login({ email, password }) {
        setLoading(true);
        try {
            const base = import.meta.env.VITE_API_URL ?? "";
            const res = await fetch(`${base}/auth/login`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ email, password }),
            });
            const text = await res.text();
            let data = {};
            if (text) {
                try {
                    data = JSON.parse(text);
                } catch {
                    data = {};
                }
            }
            if (!res.ok) {
                const err = new Error(data.message || "Falha no login");
                err.status = res.status;
                throw err;
            }

            toast.success("Bem-vindo de volta!");
            await refresh();
            navigate("/", { replace: true });
            return { ok: true };
        } catch (err) {
            const msg =
                err.status === 401
                    ? "E-mail ou senha incorretos."
                    : err.message || "Erro ao entrar. Tente novamente.";
            toast.error(msg);
            return { ok: false };
        } finally {
            setLoading(false);
        }
    }

    return { login, loading };
}

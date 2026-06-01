import { useEffect, useState, useCallback } from "react";
import { toast } from "../../../shared/atoms/toast/Toast";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL ?? "";

async function jsonOuErro(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try { data = JSON.parse(text); } catch { data = { message: text }; }
  }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Erro na requisição");
    err.status = res.status;
    throw err;
  }
  return data;
}

export function useVisaoGeralPaciente(pacienteId) {
  const [overview, setOverview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!pacienteId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchComSessao(`${API}/patients/${pacienteId}/overview`);
      const data = await jsonOuErro(res);
      setOverview(data);
    } catch (e) {
      const msg = e.message || "Não foi possível carregar os dados do paciente.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  useEffect(() => {
    load();
  }, [load]);

  return { overview, loading, error, reload: load };
}

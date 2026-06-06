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

export function useHumorPaciente(pacienteId, dias = 30) {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!pacienteId) {
      setEntries([]);
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetchComSessao(`${API}/mood/patients/${pacienteId}?days=${dias}`);
      const data = await jsonOuErro(res);
      setEntries(Array.isArray(data?.entries) ? data.entries : []);
    } catch (e) {
      const msg = e.message || "Não foi possível carregar o histórico de humor.";
      setError(msg);
      toast.error(msg);
      setEntries([]);
    } finally {
      setLoading(false);
    }
  }, [pacienteId, dias]);

  useEffect(() => {
    load();
  }, [load]);

  return { entries, loading, error, reload: load };
}

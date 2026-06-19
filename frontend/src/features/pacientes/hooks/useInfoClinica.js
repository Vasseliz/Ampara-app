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

export function useInfoClinica(pacienteId) {
  const [info, setInfo] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!pacienteId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchComSessao(`${API}/patients/${pacienteId}/clinical-info`);
      const data = await jsonOuErro(res);
      setInfo(data);
    } catch (e) {
      const msg = e.message || "Não foi possível carregar as informações clínicas.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  const salvar = useCallback(
    async ({ biologicalSex, mainDiagnoses, customDiagnoses }) => {
      const res = await fetchComSessao(`${API}/patients/${pacienteId}/clinical-info`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ biologicalSex, mainDiagnoses, customDiagnoses }),
      });
      const data = await jsonOuErro(res);
      setInfo(data);
      return data;
    },
    [pacienteId],
  );

  useEffect(() => {
    load();
  }, [load]);

  return { info, loading, error, reload: load, salvar };
}

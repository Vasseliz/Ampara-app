import { useEffect, useState, useCallback } from "react";
import { toast } from "../../../shared/atoms/toast/Toast";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL ?? "";

async function jsonOuErro(res) {
  const text = await res.text();
  let data = null;
  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { message: text };
    }
  }
  if (!res.ok) {
    const err = new Error(data?.message || res.statusText || "Erro na requisição");
    err.status = res.status;
    throw err;
  }
  return data;
}

export function useMedicamentosProfissional(pacienteId) {
  const [medications, setMedications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [removingId, setRemovingId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async () => {
    if (!pacienteId) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetchComSessao(`${API}/medications/patients/${pacienteId}`);
      const data = await jsonOuErro(res);
      setMedications(Array.isArray(data) ? data : []);
    } catch (e) {
      const msg = e.message || "Não foi possível carregar medicamentos.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, [pacienteId]);

  const criar = useCallback(async (entrada) => {
    setSubmitting(true);
    try {
      const res = await fetchComSessao(`${API}/medications/patients/${pacienteId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrada),
      });
      const criado = await jsonOuErro(res);
      setMedications((prev) => [criado, ...prev]);
      toast.success("Medicamento registrado com sucesso.");
      return criado;
    } catch (e) {
      toast.error(e.message || "Não foi possível registrar o medicamento.");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, [pacienteId]);

  const atualizar = useCallback(async (id, entrada) => {
    setSubmitting(true);
    try {
      const res = await fetchComSessao(`${API}/medications/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(entrada),
      });
      const atualizado = await jsonOuErro(res);
      setMedications((prev) => prev.map((m) => (m.id === id ? atualizado : m)));
      toast.success("Medicamento atualizado.");
      return atualizado;
    } catch (e) {
      toast.error(e.message || "Não foi possível atualizar o medicamento.");
      throw e;
    } finally {
      setSubmitting(false);
    }
  }, []);

  const remover = useCallback(async (id) => {
    setRemovingId(id);
    try {
      const res = await fetchComSessao(`${API}/medications/${id}`, { method: "DELETE" });
      if (!res.ok) await jsonOuErro(res);
      setMedications((prev) => prev.map((m) => m.id === id ? { ...m, active: false } : m));
      toast.success("Medicamento desativado.");
    } catch (e) {
      toast.error(e.message || "Não foi possível desativar o medicamento.");
      throw e;
    } finally {
      setRemovingId("");
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { medications, loading, submitting, removingId, error, reload: load, criar, atualizar, remover };
}

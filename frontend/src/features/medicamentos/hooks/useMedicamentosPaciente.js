import { useCallback, useEffect, useState } from "react";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";
import { toast } from "../../../shared/atoms/toast/Toast";

const API = import.meta.env.VITE_API_URL ?? "";

async function jsonOuErro(response) {
  const data = await response.json().catch(() => null);
  if (!response.ok) {
    throw new Error(data?.message || "Não foi possível carregar os medicamentos.");
  }
  return data;
}

function normalizarAdesao(data) {
  return (Array.isArray(data) ? data : []).map((item) => ({
    ...item,
    value: item.value == null ? null : Math.round(item.value * 100),
  }));
}

export function useMedicamentosPaciente() {
  const [today, setToday] = useState([]);
  const [medications, setMedications] = useState([]);
  const [adherence, setAdherence] = useState([]);
  const [averageAdherence, setAverageAdherence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [takingId, setTakingId] = useState("");
  const [error, setError] = useState("");

  const load = useCallback(async ({ silent = false } = {}) => {
    if (!silent) setLoading(true);
    setError("");

    try {
      const [medicationsResponse, adherenceResponse] = await Promise.all([
        fetchComSessao(`${API}/medications`),
        fetchComSessao(`${API}/medications/adherence`),
      ]);
      const [medicationsData, adherenceData] = await Promise.all([
        jsonOuErro(medicationsResponse),
        jsonOuErro(adherenceResponse),
      ]);

      setToday(Array.isArray(medicationsData?.today) ? medicationsData.today : []);
      setMedications(
        (Array.isArray(medicationsData?.all) ? medicationsData.all : []).filter(
          (medication) => medication.active
        )
      );
      setAdherence(normalizarAdesao(adherenceData?.data));
      setAverageAdherence(
        adherenceData?.averageAdherence == null
          ? null
          : Math.round(adherenceData.averageAdherence * 100)
      );
    } catch (loadError) {
      const message = loadError.message || "Não foi possível carregar os medicamentos.";
      setError(message);
      if (!silent) toast.error(message);
      throw loadError;
    } finally {
      if (!silent) setLoading(false);
    }
  }, []);

  const markAsTaken = useCallback(async (id) => {
    setTakingId(id);
    try {
      const response = await fetchComSessao(`${API}/medications/${id}/take`, {
        method: "POST",
      });
      await jsonOuErro(response);
      setToday((current) =>
        current.map((medication) =>
          medication.id === id ? { ...medication, taken: true } : medication
        )
      );
      toast.success("Medicamento registrado como tomado.");
      await load({ silent: true }).catch(() => {});
    } catch (takeError) {
      toast.error(takeError.message || "Não foi possível registrar o medicamento.");
      throw takeError;
    } finally {
      setTakingId("");
    }
  }, [load]);

  useEffect(() => {
    load().catch(() => {});
  }, [load]);

  return {
    today,
    medications,
    adherence,
    averageAdherence,
    loading,
    takingId,
    error,
    reload: load,
    markAsTaken,
  };
}

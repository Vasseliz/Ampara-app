import { useState, useEffect, useCallback } from "react";
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

function mapAdesao(adesao) {
  return {
    data: (adesao?.data ?? []).map((d) => ({
      day: d.day,
      value: d.value == null ? 0 : Math.round(d.value * 100),
    })),
    averageAdherence:
      adesao?.averageAdherence == null
        ? 0
        : Math.round(adesao.averageAdherence * 100),
  };
}

export function useMedicamentos() {
  const [today, setToday] = useState([]);
  const [all, setAll] = useState([]);
  const [adherence, setAdherence] = useState({ data: [], averageAdherence: 0 });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const recarregarAdesao = useCallback(async () => {
    try {
      const res = await fetchComSessao(`${API}/medications/adherence`);
      const adesao = await jsonOuErro(res);
      setAdherence(mapAdesao(adesao));
    } catch {
      /* silencioso: o grafico de adesao apenas nao atualiza desta vez */
    }
  }, []);

  const reload = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const [listaRes, adesaoRes] = await Promise.all([
        fetchComSessao(`${API}/medications`),
        fetchComSessao(`${API}/medications/adherence`),
      ]);
      const lista = await jsonOuErro(listaRes);
      const adesao = await jsonOuErro(adesaoRes);

      setToday(Array.isArray(lista?.today) ? lista.today : []);
      setAll(Array.isArray(lista?.all) ? lista.all : []);
      setAdherence(mapAdesao(adesao));
    } catch (e) {
      const msg = e.message || "Não foi possível carregar seus medicamentos.";
      setError(msg);
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  }, []);

  const registrarTomada = useCallback(
    async (id) => {
      try {
        const res = await fetchComSessao(`${API}/medications/${id}/take`, {
          method: "POST",
        });
        await jsonOuErro(res);
        setToday((prev) => prev.map((m) => (m.id === id ? { ...m, taken: true } : m)));
        toast.success("Medicamento marcado como tomado.");
        // Atualiza o grafico/percentual de adesao sem recarregar a tela inteira.
        await recarregarAdesao();
      } catch (e) {
        toast.error(e.message || "Não foi possível registrar a tomada.");
        throw e;
      }
    },
    [recarregarAdesao],
  );

  useEffect(() => {
    reload();
  }, [reload]);

  return { today, all, adherence, loading, error, reload, registrarTomada };
}

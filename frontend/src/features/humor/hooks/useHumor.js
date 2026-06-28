import { useState, useEffect, useCallback } from "react";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL;

export function useHumorHoje() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetch_ = async () => {
    setLoading(true);
    try {
      const res = await fetchComSessao(`${API}/mood/today`);
      if (res.status === 204) {
        setData(null);
      } else if (res.ok) {
        setData(await res.json());
      }
    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    fetch_();
  }, []);

  return { data, loading, refetch: fetch_ };
}

export function useHistoricoHumor(dias) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetch_ = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetchComSessao(`${API}/mood/history?days=${dias}`);
      if (res.ok) {
        const json = await res.json();
        setData(json.entries ?? []);
      }
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [dias]);

  useEffect(() => {
    void fetch_();
  }, [fetch_]);

  return { data, loading, refetch: fetch_ };
}

export async function registrarHumor({ score, factors, notes }) {
  const res = await fetchComSessao(`${API}/mood`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ score, factors, notes }),
  });
  return res;
}

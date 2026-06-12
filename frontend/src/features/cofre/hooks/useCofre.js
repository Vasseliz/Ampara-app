import { useState, useEffect } from "react";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL ?? "";

const useNotas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchComSessao(`${API}/vault`);
        if (!response.ok) throw new Error(`HTTP Error Status: ${response.status}`);
        const dados = await response.json();
        setData(Array.isArray(dados) ? dados : []);
      } catch (err) {
        console.error("Erro: ", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return { data, loading, setData };
};

export { useNotas };

const salvarNota = async (content) => {
  const response = await fetchComSessao(`${API}/vault`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return response;
};

export { salvarNota };

const deletarNota = async (id) => {
  const response = await fetchComSessao(`${API}/vault/${id}`, {
    method: "DELETE",
  });
  return response;
};

export { deletarNota };

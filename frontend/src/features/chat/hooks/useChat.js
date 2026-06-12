import { useState, useEffect } from "react";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL ?? "";

const useConversas = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchComSessao(`${API}/chat/conversations`);
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

  return { data, loading };
};

export { useConversas };

const useMensagens = (pacienteId, profissionalId) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!pacienteId || !profissionalId) {
      setData([]);
      setLoading(false);
      return;
    }

    const fetchData = async () => {
      try {
        const response = await fetchComSessao(`${API}/chat/${pacienteId}/${profissionalId}`);
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
  }, [pacienteId, profissionalId]);

  return { data, loading, setData };
};

export { useMensagens };

const enviarMensagem = async (pacienteId, profissionalId, content) => {
  const response = await fetchComSessao(`${API}/chat/${pacienteId}/${profissionalId}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ content }),
  });
  return response;
};

export { enviarMensagem };

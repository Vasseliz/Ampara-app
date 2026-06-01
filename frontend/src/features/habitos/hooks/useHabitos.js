import { useState, useEffect } from "react";
import { fetchComSessao } from "../../../shared/api/fetchComSessao";

const API = import.meta.env.VITE_API_URL ?? "";

const useHabitosHoje = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchComSessao(`${API}/habits/today`);
        if (!response.ok) {
          throw new Error(`HTTP Error Status: ${response.status}`);
        }

        if (response.status === 204) {
          return setData(null);
        }
        const dados = await response.json();
        setData(dados);
      } catch (err) {
        console.error("Erro: ", err.message);
      } finally {
        setLoading(false);
      }
      return;
    };
    fetchData();
  }, []);
  return { data, loading };
};

export { useHabitosHoje };

const registrarHabito = async ({
  exercitou,
  horasSono,
  qualidadeSono,
  agua,
}) => {
  const response = await fetchComSessao(`${API}/habits`, {
      headers: { "Content-Type": "application/json" },
      method: "POST",
      body: JSON.stringify({ exercitou, horasSono, qualidadeSono, agua }),
    });
    console.log(response)
    return response;
};

export { registrarHabito };

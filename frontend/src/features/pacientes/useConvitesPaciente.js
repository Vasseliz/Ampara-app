import { useEffect, useState } from "react";
import { toast } from "../../shared/atoms/toast/Toast";
import { fetchComSessao } from "../../shared/api/fetchComSessao";

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
    const err = new Error(
      data?.message || res.statusText || "Erro na requisição",
    );
    err.status = res.status;
    err.body = data;
    throw err;
  }

  return data;
}

function normalizarConvite(invite) {
  return {
    id: invite?.id ?? "",
    professionalName:
      typeof invite?.professionalName === "string"
        ? invite.professionalName.trim()
        : "Profissional",
    professionalEmail:
      typeof invite?.professionalEmail === "string"
        ? invite.professionalEmail.trim()
        : "",
    sentAt: invite?.sentAt ?? null,
    expiresAt: invite?.expiresAt ?? null,
  };
}

export function useConvitesPaciente() {
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [acceptingId, setAcceptingId] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const res = await fetchComSessao(`${API}/patients/invites/received`);
      const list = await jsonOuErro(res);
      setInvites(Array.isArray(list) ? list.map(normalizarConvite) : []);
    } catch (e) {
      const message = e.message || "Não foi possível carregar seus convites.";
      setInvites([]);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function acceptInvite(inviteId) {
    setAcceptingId(inviteId);

    try {
      const res = await fetchComSessao(
        `${API}/patients/invites/${inviteId}/accept`,
        {
          method: "POST",
        },
      );
      const accepted = await jsonOuErro(res);
      setInvites((current) =>
        current.filter((invite) => invite.id !== inviteId),
      );
      toast.success(
        `Convite aceito com ${accepted?.professionalName || "o profissional"}.`,
      );
      return accepted;
    } catch (e) {
      const message = e.message || "Não foi possível aceitar o convite.";
      toast.error(message);
      throw e;
    } finally {
      setAcceptingId("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    invites,
    loading,
    error,
    acceptingId,
    reload: load,
    acceptInvite,
  };
}

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

function normalizarPaciente(patient) {
  const firstName =
    typeof patient?.firstName === "string" ? patient.firstName.trim() : "";
  const lastName =
    typeof patient?.lastName === "string" ? patient.lastName.trim() : "";
  const email = typeof patient?.email === "string" ? patient.email.trim() : "";
  const fullName = `${firstName} ${lastName}`.trim() || email || "Paciente";

  return {
    id: patient?.id ?? "",
    firstName,
    lastName,
    email,
    linkedAt: patient?.linkedAt ?? null,
    fullName,
  };
}

function normalizarConvite(invite) {
  return {
    id: invite?.id ?? "",
    email: typeof invite?.email === "string" ? invite.email.trim() : "",
    sentAt: invite?.sentAt ?? null,
    expiresAt: invite?.expiresAt ?? null,
  };
}

export function usePacientes() {
  const [patients, setPatients] = useState([]);
  const [invites, setInvites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [cancelingId, setCancelingId] = useState("");
  const [error, setError] = useState("");

  async function load() {
    setLoading(true);
    setError("");

    try {
      const [patientsRes, invitesRes] = await Promise.all([
        fetchComSessao(`${API}/patients`),
        fetchComSessao(`${API}/patients/invites`),
      ]);
      const [patientsList, invitesList] = await Promise.all([
        jsonOuErro(patientsRes),
        jsonOuErro(invitesRes),
      ]);

      setPatients(
        Array.isArray(patientsList) ? patientsList.map(normalizarPaciente) : [],
      );
      setInvites(
        Array.isArray(invitesList) ? invitesList.map(normalizarConvite) : [],
      );
    } catch (e) {
      const message = e.message || "Não foi possível carregar os pacientes.";
      setPatients([]);
      setInvites([]);
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  }

  async function invitePatient(email) {
    const normalizedEmail =
      typeof email === "string" ? email.trim().toLowerCase() : "";

    if (!normalizedEmail) {
      throw new Error("Informe o e-mail do paciente.");
    }

    setSubmitting(true);

    try {
      const res = await fetchComSessao(`${API}/patients/invite`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: normalizedEmail }),
      });
      const created = normalizarConvite(await jsonOuErro(res));

      setInvites((current) => [
        created,
        ...current.filter((invite) => invite.id !== created.id),
      ]);
      toast.success(
        "Paciente adicionado por e-mail. O convite ficou pendente de aceite.",
      );

      return created;
    } catch (e) {
      const message =
        e.message || "Não foi possível adicionar o paciente por e-mail.";
      toast.error(message);
      throw e;
    } finally {
      setSubmitting(false);
    }
  }

  async function cancelInvite(inviteId) {
    if (!inviteId) {
      return;
    }

    setCancelingId(inviteId);

    try {
      const res = await fetchComSessao(`${API}/patients/invites/${inviteId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        await jsonOuErro(res);
      }

      setInvites((current) =>
        current.filter((invite) => invite.id !== inviteId),
      );
      toast.success("Convite removido com sucesso.");
    } catch (e) {
      const message = e.message || "Não foi possível excluir o convite.";
      toast.error(message);
      throw e;
    } finally {
      setCancelingId("");
    }
  }

  useEffect(() => {
    load();
  }, []);

  return {
    patients,
    invites,
    loading,
    submitting,
    cancelingId,
    error,
    reload: load,
    invitePatient,
    cancelInvite,
  };
}

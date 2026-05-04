import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "../../shared/atoms/toast/Toast";
import { fetchComSessao } from "../../shared/api/fetchComSessao";
import { mapApiNote } from "./prontuarioFormat";

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
        err.body = data;
        throw err;
    }
    return data;
}

export function useProntuario(pacienteId) {
    const navigate = useNavigate();

    const [patients, setPatients] = useState([]);
    const [loadingPatients, setLoadingPatients] = useState(true);
    const [notes, setNotes] = useState([]);
    const [loadingNotes, setLoadingNotes] = useState(false);
    const [formOpen, setFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [monthFilter, setMonthFilter] = useState("all");
    const [yearFilter, setYearFilter] = useState(String(new Date().getFullYear()));

    const selectedPatient = patients.find((p) => p.id === pacienteId);
    const patientLabel = selectedPatient
        ? `${selectedPatient.firstName} ${selectedPatient.lastName}`.trim()
        : "Paciente";

    const filteredNotes =
        monthFilter === "all"
            ? notes
            : notes.filter((n) => n.sessionDate?.slice(5, 7) === monthFilter);

    const patientOptions = patients.map((p) => ({
        value: p.id,
        label: `${p.firstName} ${p.lastName}`.trim() || p.email,
    }));

    useEffect(() => {
        let alive = true;
        (async () => {
            setLoadingPatients(true);
            try {
                const res = await fetchComSessao(`${API}/patients`);
                const list = await jsonOuErro(res);
                if (alive) setPatients(Array.isArray(list) ? list : []);
            } catch (e) {
                if (alive) {
                    toast.error(e.message || "Não foi possível carregar pacientes.");
                    setPatients([]);
                }
            } finally {
                if (alive) setLoadingPatients(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, []);

    useEffect(() => {
        if (!pacienteId) {
            setNotes([]);
            return;
        }
        let alive = true;
        (async () => {
            setLoadingNotes(true);
            try {
                const res = await fetchComSessao(
                    `${API}/prontuario/${pacienteId}?year=${encodeURIComponent(yearFilter)}&month=all`,
                );
                const list = await jsonOuErro(res);
                if (alive) setNotes(Array.isArray(list) ? list.map(mapApiNote) : []);
            } catch (e) {
                if (alive) {
                    toast.error(e.message || "Não foi possível carregar as notas.");
                    setNotes([]);
                }
            } finally {
                if (alive) setLoadingNotes(false);
            }
        })();
        return () => {
            alive = false;
        };
    }, [pacienteId, yearFilter]);

    async function reloadNotes() {
        if (!pacienteId) return;
        setLoadingNotes(true);
        try {
            const res = await fetchComSessao(
                `${API}/prontuario/${pacienteId}?year=${encodeURIComponent(yearFilter)}&month=all`,
            );
            const list = await jsonOuErro(res);
            setNotes(Array.isArray(list) ? list.map(mapApiNote) : []);
        } catch (e) {
            toast.error(e.message || "Não foi possível atualizar as notas.");
        } finally {
            setLoadingNotes(false);
        }
    }

    async function handleSave(formData) {
        if (!pacienteId) return;
        const isEdit = !!editingNote?.id;
        const payload = {
            sessionDate: formData.sessionDate,
            sessionType: formData.sessionType,
            content: formData.content.trim(),
            nextSessionDate: formData.nextSessionDate || null,
        };
        try {
            if (isEdit) {
                const res = await fetchComSessao(
                    `${API}/prontuario/${pacienteId}/notes/${editingNote.id}`,
                    {
                        method: "PUT",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify(payload),
                    },
                );
                await jsonOuErro(res);
            } else {
                const res = await fetchComSessao(`${API}/prontuario/${pacienteId}`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(payload),
                });
                await jsonOuErro(res);
            }
            await reloadNotes();
            toast.success(isEdit ? "Anotação atualizada." : "Anotação salva.");
            setEditingNote(null);
        } catch (e) {
            toast.error(e.message || "Não foi possível salvar.");
            throw e;
        }
    }

    function handleEdit(note) {
        setEditingNote(note);
        setFormOpen(true);
    }

    async function handleDelete(id) {
        if (!pacienteId || !id) return;
        if (!window.confirm("Excluir esta anotação?")) return;
        try {
            const res = await fetchComSessao(`${API}/prontuario/${pacienteId}/notes/${id}`, {
                method: "DELETE",
            });
            await jsonOuErro(res);
            toast.success("Anotação removida.");
            await reloadNotes();
        } catch (e) {
            toast.error(e.message || "Não foi possível excluir.");
        }
    }

    function handleOpenNew() {
        setEditingNote(null);
        setFormOpen(true);
    }

    function handlePatientChange(value) {
        if (!value) {
            navigate("/profissional/prontuario");
            return;
        }
        navigate(`/profissional/prontuario/${value}`);
    }

    function closeForm() {
        setFormOpen(false);
        setEditingNote(null);
    }

    return {
        patients,
        loadingPatients,
        loadingNotes,
        notes,
        filteredNotes,
        monthFilter,
        setMonthFilter,
        yearFilter,
        setYearFilter,
        patientLabel,
        patientOptions,
        formOpen,
        editingNote,
        setFormOpen,
        handleSave,
        handleEdit,
        handleDelete,
        handleOpenNew,
        handlePatientChange,
        closeForm,
    };
}

import { useState, useCallback } from "react";
import { FileText, RefreshCw, Plus, ShieldOff } from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { SectionHeading } from "../../shared/atoms/sectionHeading/SectionaHeading";
import Button from "../../shared/atoms/button/Button";
import { NoteCard } from "./NoteCard";
import { NoteForm } from "./NoteForm";
import { DateFilter } from "../../shared/molecules/dateFilter/DateFilter";
import "./Prontuario.css";

const MONTH_OPTIONS = [
    { value: "all", label: "Todos os meses" },
    { value: "01", label: "Janeiro" },
    { value: "02", label: "Fevereiro" },
    { value: "03", label: "Março" },
    { value: "04", label: "Abril" },
    { value: "05", label: "Maio" },
    { value: "06", label: "Junho" },
    { value: "07", label: "Julho" },
    { value: "08", label: "Agosto" },
    { value: "09", label: "Setembro" },
    { value: "10", label: "Outubro" },
    { value: "11", label: "Novembro" },
    { value: "12", label: "Dezembro" },
];

const MOCK_NOTES = [
    {
        id: 1,
        sessionDate: "2025-04-02",
        sessionType: "individual",
        content:
            "Paciente demonstrou avanços significativos na regulação emocional. Relatou menos episódios de dissociação ao longo da semana. Trabalhamos técnicas de grounding durante a sessão. Hipótese de reforçar o plano terapêutico com maior frequência de sessões nas próximas semanas.",
        nextSessionDate: "2025-04-09",
    },
    {
        id: 2,
        sessionDate: "2025-03-26",
        sessionType: "individual",
        content:
            "Sessão focada em revisão de metas. Paciente apresentou resistência ao explorar memórias de infância. Observar possível evitação experiencial. Considerar EMDR na próxima etapa.",
        nextSessionDate: "",
    },
    {
        id: 3,
        sessionDate: "2025-03-12",
        sessionType: "avaliacao",
        content:
            "Avaliação inicial. Triagem de sintomas depressivos e ansiosos. PHQ-9 aplicado — escore 14 (moderado). GAD-7 — escore 11 (moderado). Encaminhamento para psiquiatria discutido e aceito pelo paciente.",
        nextSessionDate: "2025-03-26",
    },
];

function formatDateDisplay(isoDate) {
    if (!isoDate) return "";
    const [year, month, day] = isoDate.split("-");
    const months = [
        "Jan", "Fev", "Mar", "Abr", "Mai", "Jun",
        "Jul", "Ago", "Set", "Out", "Nov", "Dez",
    ];
    return `${day} de ${months[parseInt(month, 10) - 1]} de ${year}`;
}

export function Prontuario({ patientName = "Paciente", onBack }) {
    const [notes, setNotes] = useState(MOCK_NOTES);
    const [formOpen, setFormOpen] = useState(false);
    const [editingNote, setEditingNote] = useState(null);
    const [monthFilter, setMonthFilter] = useState("all");



    const filteredNotes = notes.filter((n) => {
        if (monthFilter === "all") return true;
        return n.sessionDate.startsWith(`${n.sessionDate.slice(0, 4)}-${monthFilter}`);
    });

    function handleSave(formData) {
        if (editingNote) {
            setNotes((prev) =>
                prev.map((n) =>
                    n.id === editingNote.id ? { ...n, ...formData } : n
                )
            );
        } else {
            const newNote = { ...formData, id: Date.now() };
            setNotes((prev) => [newNote, ...prev]);
        }
        setEditingNote(null);
    }

    function handleEdit(note) {
        setEditingNote(note);
        setFormOpen(true);
    }

    function handleDelete(id) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
    }

    function handleOpenNew() {
        setEditingNote(null);
        setFormOpen(true);
    }

    return (
        <div className="app-layout">
            <div className="app-container">
                <PageHeader
                    title="Prontuário"
                    iconTitle={FileText}
                    icon={FileText}
                    subtitle={patientName}
                    comment={`${notes.length} notas`}
                    onBack={onBack}
                />

                <div className="prontuario">
                    <InfoBanner
                        icon={ShieldOff}
                        iconColor="#374151"
                        text="Conteúdo visível apenas para você. O paciente não tem acesso a este prontuário em nenhuma circunstância."
                    />


                    <div className="prontuario__filter-row">
                        <DateFilter
                            value={monthFilter}
                            onChange={setMonthFilter}
                            options={MONTH_OPTIONS}
                        />
                        <Button variant="primary" size="sm" onClick={handleOpenNew}>
                            <Plus size={15} />
                            Nova nota
                        </Button>
                    </div>

                    <div>
                        <SectionHeading title="Anotações de sessões" />
                        <div style={{ height: "0.75rem" }} />

                        {filteredNotes.length === 0 ? (
                            <div className="prontuario__empty">
                                <FileText size={48} className="prontuario__empty-icon" />
                                <p className="prontuario__empty-title">Nenhuma anotação encontrada</p>
                                <p className="prontuario__empty-desc">
                                    {monthFilter !== "all"
                                        ? "Tente selecionar outro período ou remova o filtro."
                                        : "As anotações clínicas desta sessão aparecerão aqui."}
                                </p>
                                <Button variant="primary" size="md" onClick={handleOpenNew}>
                                    <Plus size={15} />
                                    Criar primeira anotação
                                </Button>
                            </div>
                        ) : (
                            <div className="prontuario__notes-list">
                                {filteredNotes.map((note) => (
                                    <NoteCard
                                        key={note.id}
                                        note={{
                                            ...note,
                                            sessionDate: formatDateDisplay(note.sessionDate),
                                            nextSessionDate: note.nextSessionDate
                                                ? formatDateDisplay(note.nextSessionDate)
                                                : "",
                                        }}
                                        onEdit={() => handleEdit(note)}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <NoteForm
                    open={formOpen}
                    onClose={() => { setFormOpen(false); setEditingNote(null); }}
                    onSave={handleSave}
                    initialData={editingNote}
                />
            </div>
        </div>
    );
}

export default Prontuario;
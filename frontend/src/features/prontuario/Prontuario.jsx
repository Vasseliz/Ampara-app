import { useParams } from "react-router-dom";
import { FileText, Plus, ShieldOff } from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import Button from "../../shared/atoms/button/Button";
import { Select } from "../../shared/atoms/select/Select";
import { NoteForm } from "./NoteForm";
import { DateFilter } from "../../shared/molecules/dateFilter/DateFilter";
import { ProntuarioNotesSection } from "./ProntuarioNotesSection";
import { useProntuario } from "./useProntuario";
import { MONTH_OPTIONS, YEAR_OPTIONS } from "./prontuarioFormat";
import "./prontuario.css";

export function Prontuario({ onBack }) {
    const { pacienteId } = useParams();
    const {
        patients,
        loadingPatients,
        loadingNotes,
        filteredNotes,
        monthFilter,
        setMonthFilter,
        yearFilter,
        setYearFilter,
        patientLabel,
        patientOptions,
        formOpen,
        editingNote,
        handleSave,
        handleEdit,
        handleDelete,
        handleOpenNew,
        handlePatientChange,
        closeForm,
    } = useProntuario(pacienteId);

    return (
        <div className="app-layout">
            <div className="page-container">
                <PageHeader
                    title="Prontuário"
                    iconTitle={FileText}
                    icon={FileText}
                    subtitle={pacienteId ? patientLabel : "Selecione um paciente"}
                    comment={pacienteId ? `${filteredNotes.length} nota(s)` : undefined}
                    onBack={onBack}
                />

                <div className="prontuario">
                    <InfoBanner
                        icon={ShieldOff}
                        iconColor="#374151"
                        text="Conteúdo visível apenas para você. O paciente não tem acesso a este prontuário em nenhuma circunstância."
                    />

                    <div className="prontuario__filter-row" style={{ flexWrap: "wrap", gap: "0.75rem" }}>
                        <div style={{ minWidth: "200px", flex: "1 1 200px" }}>
                            <span className="prontuario__select-label">Paciente</span>
                            <Select
                                value={pacienteId || ""}
                                onChange={handlePatientChange}
                                options={[
                                    {
                                        value: "",
                                        label: loadingPatients ? "Carregando…" : "Escolher paciente",
                                    },
                                    ...patientOptions,
                                ]}
                            />
                            {!loadingPatients && patients.length === 0 ? (
                                <p className="prontuario__hint">
                                    Nenhum paciente vinculado. Convidar em Pacientes (quando disponível).
                                </p>
                            ) : null}
                        </div>
                        <DateFilter
                            value={monthFilter}
                            onChange={setMonthFilter}
                            options={MONTH_OPTIONS}
                        />
                        <div style={{ minWidth: "120px" }}>
                            <span className="prontuario__select-label">Ano</span>
                            <Select
                                value={yearFilter}
                                onChange={setYearFilter}
                                options={YEAR_OPTIONS}
                            />
                        </div>
                        <Button
                            variant="primary"
                            size="sm"
                            onClick={handleOpenNew}
                            disabled={!pacienteId}
                        >
                            <Plus size={15} />
                            Nova nota
                        </Button>
                    </div>

                    <ProntuarioNotesSection
                        pacienteId={pacienteId}
                        loadingNotes={loadingNotes}
                        filteredNotes={filteredNotes}
                        monthFilter={monthFilter}
                        onEdit={handleEdit}
                        onDelete={handleDelete}
                        onOpenNew={handleOpenNew}
                    />
                </div>

                <NoteForm
                    open={formOpen}
                    onClose={closeForm}
                    onSave={handleSave}
                    initialData={editingNote}
                />
            </div>
        </div>
    );
}

export default Prontuario;

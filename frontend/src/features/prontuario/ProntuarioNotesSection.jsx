import { FileText, Plus, Loader2 } from "lucide-react";
import { SectionHeading } from "../../shared/atoms/sectionHeading/SectionaHeading";
import Button from "../../shared/atoms/button/Button";
import { NoteCard } from "./NoteCard";
import { formatDateDisplay } from "./prontuarioFormat";


export function ProntuarioNotesSection({
    pacienteId,
    loadingNotes,
    filteredNotes,
    monthFilter,
    onEdit,
    onDelete,
    onOpenNew,
}) {
    return (
        <div>
            <SectionHeading title="Anotações de sessões" />
            <div style={{ height: "0.75rem" }} />

            {!pacienteId ? (
                <div className="prontuario__empty">
                    <FileText size={48} className="prontuario__empty-icon" />
                    <p className="prontuario__empty-title">Escolha um paciente</p>
                    <p className="prontuario__empty-desc">
                        O prontuário é por paciente vinculado ao seu perfil profissional.
                    </p>
                </div>
            ) : loadingNotes ? (
                <div className="prontuario__empty">
                    <Loader2 size={40} className="animate-spin" />
                    <p className="prontuario__empty-desc">Carregando notas…</p>
                </div>
            ) : filteredNotes.length === 0 ? (
                <div className="prontuario__empty">
                    <FileText size={48} className="prontuario__empty-icon" />
                    <p className="prontuario__empty-title">Nenhuma anotação encontrada</p>
                    <p className="prontuario__empty-desc">
                        {monthFilter !== "all"
                            ? "Tente outro mês ou remova o filtro."
                            : "As anotações clínicas aparecerão aqui."}
                    </p>
                    <Button variant="primary" size="md" onClick={onOpenNew}>
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
                            onEdit={() => onEdit(note)}
                            onDelete={onDelete}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

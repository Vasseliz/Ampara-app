import { useState, useEffect } from "react";
import { X, FileText } from "lucide-react";
import Button from "../../shared/atoms/button/Button";
import { PrivateBadge } from "../../shared/atoms/privateBadge/PrivateBadge";
import { Select } from "../../shared/atoms/select/Select";
import Textarea from "../../shared/atoms/textArea/TextArea";
import "./NoteForm.css";

const EMPTY_FORM = {
    sessionDate: "",
    sessionType: "individual",
    content: "",
    nextSessionDate: "",
};

export function NoteForm({ open, onClose, onSave, initialData }) {
    const [form, setForm] = useState(EMPTY_FORM);

    useEffect(() => {
        if (open) {
            setForm(initialData ? { ...initialData } : EMPTY_FORM);
        }
    }, [open, initialData]);

    if (!open) return null;

    const isEditing = !!initialData?.id;

    function handleChange(field, value) {
        setForm((prev) => ({ ...prev, [field]: value }));
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!form.sessionDate || !form.content.trim()) return;
        onSave(form);
        onClose();
    }

    function handleOverlayClick(e) {
        if (e.target === e.currentTarget) onClose();
    }

    return (
        <div className="note-form-overlay" onClick={handleOverlayClick}>
            <div className="note-form" role="dialog" aria-modal="true" aria-label="Anotação clínica">
                <div className="note-form__drag-handle" />

                <div className="note-form__header">
                    <h2 className="note-form__title">
                        <FileText size={18} />
                        {isEditing ? "Editar anotação" : "Nova anotação clínica"}
                        <PrivateBadge />
                    </h2>
                    <button className="note-form__close-btn" onClick={onClose} aria-label="Fechar">
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="note-form__grid">
                        <div className="form-field">
                            <label className="form-field__label">Data da sessão</label>
                            <input
                                type="date"
                                className="form-field__input"
                                value={form.sessionDate}
                                onChange={(e) => handleChange("sessionDate", e.target.value)}
                                required
                            />
                        </div>

                        <div className="form-field">
                            <label className="form-field__label">Tipo</label>

                            <Select
                                value={form.sessionType}
                                onChange={(value) => handleChange("sessionType", value)}
                                options={[
                                    { value: "individual", label: "Individual" },
                                    { value: "grupo", label: "Grupo" },
                                    { value: "familia", label: "Família" },
                                    { value: "casal", label: "Casal" },
                                    { value: "avaliacao", label: "Avaliação" },
                                ]}
                            />
                        </div>

                        <div className="form-field form-field--full">
                            <label className="form-field__label">Observações clínicas</label>

                            <Textarea
                                value={form.content}
                                onChange={(value) => handleChange("content", value)}
                                placeholder="Registre suas observações desta sessão..."
                                counterClassName="form-field__counter"
                                required
                            />
                        </div>

                        <div className="form-field form-field--full">
                            <label className="form-field__label">Próxima sessão (opcional)</label>
                            <input
                                type="date"
                                className="form-field__input"
                                value={form.nextSessionDate}
                                onChange={(e) => handleChange("nextSessionDate", e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="note-form__footer">
                        <Button type="button" variant="ghost" size="md" onClick={onClose}>
                            Cancelar
                        </Button>
                        <Button type="submit" variant="primary" size="md" fullWidth>
                            {isEditing ? "Salvar alterações" : "Salvar no Prontuário"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}
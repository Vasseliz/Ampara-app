import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Pill, Plus, Pencil, Trash2, TriangleAlert } from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { Select } from "../../shared/atoms/select/Select";
import { TextField } from "../../shared/atoms/form/TextField";
import Button from "../../shared/atoms/button/Button";
import { useMedicamentosProfissional } from "./hooks/useMedicamentosProfissional";
import { usePacientes } from "../pacientes/usePacientes";
import styles from "./MedicamentosProfissional.module.css";

export function MedicamentosProfissional() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const { patients, loading: loadingPatients } = usePacientes();
  const {
    medications,
    loading,
    submitting,
    removingId,
    error,
    reload,
    criar,
    atualizar,
    remover,
  } = useMedicamentosProfissional(pacienteId);

  const [modalOpen, setModalOpen] = useState(false);
  const [medicationToRemove, setMedicationToRemove] = useState(null);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ name: "", dosage: "", time: "", observation: "" });
  const [formErrors, setFormErrors] = useState({});

  const safePatients = Array.isArray(patients) ? patients : [];
  const safeMedications = Array.isArray(medications) ? medications : [];

  const selectedPatient = safePatients.find((p) => p.id === pacienteId);
  const patientLabel = selectedPatient
    ? `${selectedPatient.firstName || ""} ${selectedPatient.lastName || ""}`.trim() ||
      selectedPatient.email ||
      "Paciente"
    : "Paciente";

  const patientOptions = safePatients.map((p) => ({
    value: p.id,
    label: `${p.firstName || ""} ${p.lastName || ""}`.trim() || p.email || "Paciente",
  }));

  function handlePatientChange(id) {
    navigate(id ? `/profissional/medicamentos/${id}` : "/profissional/medicamentos");
  }

  function openCreate() {
    setEditingId(null);
    setForm({ name: "", dosage: "", time: "", observation: "" });
    setFormErrors({});
    setModalOpen(true);
  }

  function openEdit(med) {
    setEditingId(med.id);
    setForm({
      name: med.name || "",
      dosage: med.dosage || "",
      time: med.time || "",
      observation: med.observation || "",
    });
    setFormErrors({});
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditingId(null);
  }

  function setField(field, value) {
    setForm((prev) => ({ ...prev, [field]: value }));
    setFormErrors((prev) => ({ ...prev, [field]: "" }));
  }

  async function handleSubmit(evt) {
    evt.preventDefault();
    const errs = {};
    if (!form.name.trim()) errs.name = "Informe o nome.";
    if (!form.dosage.trim()) errs.dosage = "Informe a dosagem.";
    if (!form.time.trim()) errs.time = "Informe o horário.";
    if (Object.keys(errs).length) {
      setFormErrors(errs);
      return;
    }

    const payload = {
      name: form.name.trim(),
      dosage: form.dosage.trim(),
      time: form.time.trim(),
      observation: form.observation.trim() || null,
    };

    try {
      if (editingId) {
        await atualizar(editingId, payload);
      } else {
        await criar(payload);
      }
      closeModal();
    } catch {
      /* toast no hook */
    }
  }

  function requestRemove(med) {
    setMedicationToRemove(med);
  }

  function cancelRemove() {
    if (!removingId) setMedicationToRemove(null);
  }

  async function confirmRemove() {
    if (!medicationToRemove) return;
    try {
      await remover(medicationToRemove.id);
      setMedicationToRemove(null);
    } catch {
      /* toast no hook */
    }
  }

  useEffect(() => {
    if (!medicationToRemove) return undefined;

    function handleKeyDown(event) {
      if (event.key === "Escape" && !removingId) {
        setMedicationToRemove(null);
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [medicationToRemove, removingId]);

  const activeCount = safeMedications.filter((m) => m.active).length;

  return (
    <div className="page-container">
      <PageHeader
        title="Medicamentos"
        iconTitle={Pill}
        icon={Pill}
        subtitle={pacienteId ? patientLabel : "Selecione um paciente"}
        comment={pacienteId ? `${activeCount} ativo(s)` : undefined}
      />

      <div className={styles.page}>
        <div className={styles.patientSelector}>
          <span className={styles.selectorLabel}>Paciente</span>
          <Select
            dataCy="select-paciente"
            value={pacienteId || ""}
            onChange={handlePatientChange}
            options={[
              { value: "", label: loadingPatients ? "Carregando..." : "Escolher paciente" },
              ...patientOptions,
            ]}
          />
        </div>

        {pacienteId ? (
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.cardTitle}>Lista de medicamentos</h2>
              <Button size="sm" onClick={openCreate}>
                <Plus size={14} />
                Novo medicamento
              </Button>
            </div>

            {loading ? (
              <p className={styles.emptyState}>Carregando...</p>
            ) : error ? (
              <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "#b91c1c" }}>
                <TriangleAlert size={16} />
                <span>{error}</span>
                <Button variant="ghost" size="sm" onClick={reload}>
                  Tentar novamente
                </Button>
              </div>
            ) : safeMedications.length === 0 ? (
              <p className={styles.emptyState}>
                Nenhum medicamento registrado para este paciente.
              </p>
            ) : (
              <div className={styles.medList}>
                {safeMedications.map((med) => {
                  const itemClass = med.active
                    ? styles.medItem
                    : `${styles.medItem} ${styles.medItemInactive}`;
                  const badgeClass = med.active
                    ? styles.medBadge
                    : `${styles.medBadge} ${styles.medBadgeInactive}`;
                  return (
                    <div key={med.id} data-testid="med-item" className={itemClass}>
                      <div className={styles.medInfo}>
                        <span className={styles.medName}>{med.name}</span>
                        <span className={styles.medMeta}>
                          {med.dosage} · {med.time}
                        </span>
                        {med.observation ? (
                          <span className={styles.medObs}>{med.observation}</span>
                        ) : null}
                      </div>
                      <span className={badgeClass}>
                        {med.active ? "Ativo" : "Inativo"}
                      </span>
                      {med.active ? (
                        <div className={styles.medActions}>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => openEdit(med)}
                            aria-label="Editar"
                          >
                            <Pencil size={14} />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => requestRemove(med)}
                            disabled={removingId === med.id}
                            aria-label="Desativar"
                          >
                            <Trash2 size={14} />
                          </Button>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ) : null}
      </div>

      {modalOpen ? (
        <div className={styles.modal} role="dialog" aria-modal="true">
          <div className={styles.modalBackdrop} onClick={closeModal} />
          <div className={styles.modalContent}>
            <h2 className={styles.modalTitle}>
              {editingId ? "Editar medicamento" : "Novo medicamento"}
            </h2>
            <form className={styles.form} onSubmit={handleSubmit}>
              <div className={styles.formRow}>
                <TextField
                  id="med-name"
                  label="Nome do medicamento"
                  value={form.name}
                  onChange={(e) => setField("name", e.target.value)}
                  error={formErrors.name}
                  required
                />
                <TextField
                  id="med-dosage"
                  label="Dosagem"
                  placeholder="ex: 20mg"
                  value={form.dosage}
                  onChange={(e) => setField("dosage", e.target.value)}
                  error={formErrors.dosage}
                  required
                />
              </div>
              <div className={styles.formRow}>
                <TextField
                  id="med-time"
                  label="Horário"
                  placeholder="ex: 08:00"
                  value={form.time}
                  onChange={(e) => setField("time", e.target.value)}
                  error={formErrors.time}
                  required
                />
                <TextField
                  id="med-obs"
                  label="Observação (opcional)"
                  value={form.observation}
                  onChange={(e) => setField("observation", e.target.value)}
                />
              </div>
              <div className={styles.modalActions}>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={closeModal}
                  disabled={submitting}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="sm" disabled={submitting}>
                  {submitting ? "Salvando..." : "Salvar"}
                </Button>
              </div>
            </form>
          </div>
        </div>
      ) : null}

      {medicationToRemove ? (
        <div
          className={styles.modal}
          role="dialog"
          aria-modal="true"
          aria-labelledby="remove-medication-title"
          aria-describedby="remove-medication-description"
        >
          <div className={styles.modalBackdrop} onClick={cancelRemove} />
          <div className={`${styles.modalContent} ${styles.confirmationContent}`}>
            <div className={styles.warningIcon} aria-hidden="true">
              <TriangleAlert size={24} />
            </div>
            <div className={styles.confirmationText}>
              <h2 id="remove-medication-title" className={styles.confirmationTitle}>
                Desativar medicamento?
              </h2>
              <p id="remove-medication-description" className={styles.confirmationDescription}>
                <strong>{medicationToRemove.name}</strong> deixará de aparecer entre os
                medicamentos ativos do paciente.
              </p>
            </div>
            <div className={styles.modalActions}>
              <Button
                variant="ghost"
                size="sm"
                onClick={cancelRemove}
                disabled={removingId === medicationToRemove.id}
              >
                Cancelar
              </Button>
              <Button
                variant="danger"
                size="sm"
                onClick={confirmRemove}
                disabled={removingId === medicationToRemove.id}
              >
                {removingId === medicationToRemove.id ? "Desativando..." : "Desativar"}
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

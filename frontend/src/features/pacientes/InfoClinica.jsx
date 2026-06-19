import { useEffect, useState } from "react";
import { Stethoscope, Plus, X, Save, Check } from "lucide-react";
import Button from "../../shared/atoms/button/Button";
import { Select } from "../../shared/atoms/select/Select";
import { toast } from "../../shared/atoms/toast/Toast";
import { useInfoClinica } from "./hooks/useInfoClinica";
import styles from "./InfoClinica.module.css";

const SEXO_OPTIONS = [
  { value: "", label: "Selecione..." },
  { value: "masculino", label: "Masculino" },
  { value: "feminino", label: "Feminino" },
  { value: "intersexo", label: "Intersexo" },
  { value: "nao_informado", label: "Prefiro não informar" },
];

const DIAGNOSTICOS_PRINCIPAIS = [
  "Depressão",
  "Transtorno de Ansiedade Generalizada",
  "Transtorno do Pânico",
  "Transtorno Bipolar",
  "Esquizofrenia",
  "Transtorno Obsessivo-Compulsivo (TOC)",
  "Transtorno de Estresse Pós-Traumático (TEPT)",
  "Transtorno de Déficit de Atenção e Hiperatividade (TDAH)",
  "Transtorno de Personalidade Borderline",
  "Transtorno Alimentar - Anorexia",
  "Transtorno Alimentar - Bulimia",
  "Fobia Social",
  "Insônia",
  "Dependência Química",
  "Burnout",
  "Depressão Pós-Parto",
];

export function InfoClinica({ pacienteId }) {
  const { info, loading, salvar } = useInfoClinica(pacienteId);
  const [sexo, setSexo] = useState("");
  const [selectedDiag, setSelectedDiag] = useState([]);
  const [customDiag, setCustomDiag] = useState([]);
  const [customInput, setCustomInput] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!info) return;
    setSexo(info.biologicalSex ?? "");
    setSelectedDiag(info.mainDiagnoses ?? []);
    setCustomDiag(info.customDiagnoses ?? []);
  }, [info]);

  function toggleDiag(diag) {
    setSelectedDiag((prev) =>
      prev.includes(diag) ? prev.filter((d) => d !== diag) : [...prev, diag]
    );
  }

  function addCustomDiag() {
    const trimmed = customInput.trim();
    if (!trimmed || customDiag.includes(trimmed)) return;
    setCustomDiag((prev) => [...prev, trimmed]);
    setCustomInput("");
  }

  function removeCustomDiag(diag) {
    setCustomDiag((prev) => prev.filter((d) => d !== diag));
  }

  function handleCustomKeyDown(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      addCustomDiag();
    }
  }

  async function handleSave(e) {
    e.preventDefault();
    setSaving(true);
    try {
      await salvar({
        biologicalSex: sexo || null,
        mainDiagnoses: selectedDiag,
        customDiagnoses: customDiag,
      });
      toast.success("Informações clínicas salvas.");
    } catch (err) {
      toast.error(err.message || "Não foi possível salvar as informações clínicas.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.card} onSubmit={handleSave}>
        <div className={styles.cardHeader}>
          <div className={styles.cardTitleRow}>
            <Stethoscope size={17} className={styles.cardTitleIcon} />
            <h2 className={styles.cardTitle}>Informações Clínicas</h2>
          </div>
          <span className={styles.visibilityBadge}>Visível apenas para profissionais</span>
        </div>

        <div className={styles.field}>
          <label className={styles.fieldLabel}>Sexo biológico</label>
          <Select
            value={sexo}
            onChange={setSexo}
            options={SEXO_OPTIONS}
          />
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabelAccent}>Diagnósticos principais</span>
          <div className={styles.chipGrid}>
            {DIAGNOSTICOS_PRINCIPAIS.map((diag) => (
              <button
                key={diag}
                type="button"
                className={`${styles.chip} ${selectedDiag.includes(diag) ? styles.chipSelected : ""}`}
                onClick={() => toggleDiag(diag)}
              >
                {selectedDiag.includes(diag) && <Check size={12} className={styles.chipCheck} />}
                {diag}
              </button>
            ))}
          </div>
        </div>

        <div className={styles.field}>
          <span className={styles.fieldLabelAccent}>Diagnósticos personalizados</span>

          {customDiag.length > 0 && (
            <div className={styles.customChips}>
              {customDiag.map((diag) => (
                <span key={diag} className={styles.customChip}>
                  {diag}
                  <button
                    type="button"
                    className={styles.customChipRemove}
                    onClick={() => removeCustomDiag(diag)}
                    aria-label={`Remover ${diag}`}
                  >
                    <X size={12} />
                  </button>
                </span>
              ))}
            </div>
          )}

          <div className={styles.customInputRow}>
            <input
              type="text"
              className={styles.customInput}
              placeholder="Adicionar diagnóstico..."
              value={customInput}
              onChange={(e) => setCustomInput(e.target.value)}
              onKeyDown={handleCustomKeyDown}
            />
            <button
              type="button"
              className={styles.addBtn}
              onClick={addCustomDiag}
              aria-label="Adicionar diagnóstico personalizado"
            >
              <Plus size={16} />
            </button>
          </div>
        </div>

        <Button type="submit" variant="primary" fullWidth disabled={saving || loading}>
          <Save size={15} />
          {saving ? "Salvando..." : "Salvar informações clínicas"}
        </Button>
      </form>
    </div>
  );
}

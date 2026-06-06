import { useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import {
  Smile,
  ArrowLeft,
  TriangleAlert,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { Select } from "../../shared/atoms/select/Select";
import Button from "../../shared/atoms/button/Button";
import { usePacientes } from "../pacientes/usePacientes";
import { useHumorPaciente } from "./hooks/useHumorPaciente";
import { getRotulo, getBadgeColor, formatDate } from "./humorFormat";
import styles from "./HumorPaciente.module.css";

const DIAS = 30;

function calcularResumo(entries) {
  if (!entries.length) return null;

  const media = entries.reduce((acc, e) => acc + e.score, 0) / entries.length;

  const cronologico = [...entries].sort((a, b) => a.date.localeCompare(b.date));
  const ultimo = cronologico[cronologico.length - 1].score;

  const meio = Math.floor(cronologico.length / 2);
  const primeiraMetade = cronologico.slice(0, meio);
  const segundaMetade = cronologico.slice(meio);
  const mediaDe = (lista) =>
    lista.length ? lista.reduce((acc, e) => acc + e.score, 0) / lista.length : 0;

  const delta = mediaDe(segundaMetade) - mediaDe(primeiraMetade);
  let tendencia = "estavel";
  if (delta >= 0.5) tendencia = "alta";
  else if (delta <= -0.5) tendencia = "baixa";

  return {
    media: media.toFixed(1),
    ultimo,
    tendencia,
  };
}

const TENDENCIA = {
  alta: { label: "Em alta", color: "#428A5A", Icon: TrendingUp },
  baixa: { label: "Em queda", color: "#e74c3c", Icon: TrendingDown },
  estavel: { label: "Estável", color: "#6b7280", Icon: Minus },
};

export function HumorPaciente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const { patients, loading: loadingPatients } = usePacientes();
  const { entries, loading, error, reload } = useHumorPaciente(pacienteId, DIAS);

  const safePatients = Array.isArray(patients) ? patients : [];
  const selectedPatient = safePatients.find((p) => p.id === pacienteId);
  const patientLabel = selectedPatient?.fullName || "Paciente";

  const patientOptions = safePatients.map((p) => ({
    value: p.id,
    label: p.fullName,
  }));

  const resumo = useMemo(() => calcularResumo(entries), [entries]);

  function handlePatientChange(id) {
    navigate(id ? `/profissional/humor/${id}` : "/profissional/humor");
  }

  const tendencia = resumo ? TENDENCIA[resumo.tendencia] : null;

  return (
    <div className="page-container">
      <PageHeader
        title="Humor"
        iconTitle={Smile}
        icon={Smile}
        subtitle={pacienteId ? patientLabel : "Selecione um paciente"}
        comment={pacienteId ? `${entries.length} registro(s)` : undefined}
      />

      <div className={styles.page}>
        {pacienteId ? (
          <Link to={`/profissional/pacientes/${pacienteId}`} className={styles.backLink}>
            <ArrowLeft size={14} />
            Voltar para visão geral
          </Link>
        ) : null}

        <div className={styles.patientSelector}>
          <span className={styles.selectorLabel}>Paciente</span>
          <Select
            value={pacienteId || ""}
            onChange={handlePatientChange}
            options={[
              { value: "", label: loadingPatients ? "Carregando..." : "Escolher paciente" },
              ...patientOptions,
            ]}
          />
        </div>

        {!pacienteId ? (
          <p className={styles.hint}>Selecione um paciente para ver o histórico de humor.</p>
        ) : loading ? (
          <div className={styles.skeletons}>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className={styles.skeleton} />
            ))}
          </div>
        ) : error ? (
          <div className={styles.errorBox}>
            <TriangleAlert size={16} />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        ) : entries.length === 0 ? (
          <div className={styles.card}>
            <div className={styles.empty}>
              <Smile size={40} color="#d1d5db" />
              <p>Este paciente ainda não registrou seu humor nos últimos {DIAS} dias.</p>
            </div>
          </div>
        ) : (
          <>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <TrendingUp size={16} />
                  Resumo (últimos {DIAS} dias)
                </h2>
              </div>

              <div className={styles.stats}>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Média do período</span>
                  <span className={styles.statValue}>{resumo.media}/10</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Último registro</span>
                  <span className={styles.statValue}>{resumo.ultimo}/10</span>
                </div>
                <div className={styles.stat}>
                  <span className={styles.statLabel}>Tendência</span>
                  <span className={styles.trend} style={{ color: tendencia.color }}>
                    <tendencia.Icon size={18} />
                    {tendencia.label}
                  </span>
                </div>
              </div>
            </div>

            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <Smile size={16} />
                  Registros individuais
                </h2>
              </div>

              <div className={styles.list}>
                {[...entries]
                  .sort((a, b) => b.date.localeCompare(a.date))
                  .map((entry) => (
                    <div key={entry.id} className={styles.entry}>
                      <div className={styles.entryHeader}>
                        <span
                          className={styles.badge}
                          style={{ background: getBadgeColor(entry.score) }}
                        >
                          {entry.score}
                        </span>
                        <div className={styles.entryInfo}>
                          <span className={styles.entryRotulo}>{getRotulo(entry.score)}</span>
                          <span className={styles.entryDate}>{formatDate(entry.date)}</span>
                        </div>
                      </div>

                      {entry.factors?.length > 0 && (
                        <div className={styles.fatores}>
                          {entry.factors.map((f) => (
                            <span key={f} className={styles.fator}>{f}</span>
                          ))}
                        </div>
                      )}

                      {entry.notes && <p className={styles.notes}>{entry.notes}</p>}
                    </div>
                  ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default HumorPaciente;

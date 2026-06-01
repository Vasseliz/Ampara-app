import { useParams, useNavigate, Link } from "react-router-dom";
import {
  User,
  Pill,
  Smile,
  Clover,
  FileText,
  ArrowLeft,
  TriangleAlert,
  Settings2,
} from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import Button from "../../shared/atoms/button/Button";
import { useVisaoGeralPaciente } from "./hooks/useVisaoGeralPaciente";
import styles from "./VisaoGeralPaciente.module.css";

function formatDate(iso) {
  if (!iso) return "";
  const [y, m, d] = iso.split("-");
  return `${d}/${m}/${y}`;
}

function MoodSection({ mood }) {
  if (!mood || mood.length === 0)
    return <p className={styles.emptyState}>Sem registros de humor nos últimos 7 dias.</p>;

  return (
    <div>
      {[...mood].reverse().map((h) => (
        <div key={h.date} className={styles.moodRow}>
          <span className={styles.moodDate}>{formatDate(h.date)}</span>
          <div className={styles.moodBar}>
            <div className={styles.moodBarFill} style={{ width: `${h.score * 10}%` }} />
          </div>
          <span className={styles.moodScore}>{h.score}/10</span>
        </div>
      ))}
    </div>
  );
}

function HabitsSection({ habits }) {
  if (!habits || habits.length === 0)
    return <p className={styles.emptyState}>Sem registros de hábitos nos últimos 7 dias.</p>;

  return (
    <div>
      <div className={styles.habitHeader}>
        <span className={styles.habitHeaderDate}>Data</span>
        <span>Exercício</span>
        <span>Sono (h)</span>
        <span>Qual. Sono</span>
        <span>Água</span>
      </div>
      {[...habits].reverse().map((h) => (
        <div key={h.date} className={styles.habitRow}>
          <span className={styles.habitDate}>{formatDate(h.date)}</span>
          <span className={styles.habitCell}>{h.exercised ? "✓" : "✗"}</span>
          <span className={styles.habitCell}>{h.sleepHours}h</span>
          <span className={styles.habitCell}>{h.sleepQuality}/5</span>
          <span className={styles.habitCell}>{h.water}ml</span>
        </div>
      ))}
    </div>
  );
}

function NotesSection({ notes }) {
  if (!notes || notes.length === 0)
    return <p className={styles.emptyState}>Sem anotações neste ano.</p>;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.625rem" }}>
      {notes.map((n) => (
        <div key={n.id} className={styles.noteItem}>
          <div className={styles.noteDate}>
            <span>{formatDate(n.sessionDate)}</span>
            <span className={styles.noteType}>{n.sessionType}</span>
          </div>
          <p className={styles.noteContent}>{n.content}</p>
        </div>
      ))}
    </div>
  );
}

function MedicationsSection({ medications, onManage }) {
  const all = medications ?? [];

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "0.375rem" }}>
      {all.length === 0 ? (
        <p className={styles.emptyState}>Nenhum medicamento registrado.</p>
      ) : (
        all.map((m) => (
          <div key={m.id} className={styles.medItem}>
            <div>
              <div className={styles.medName}>{m.name}</div>
              <div className={styles.medMeta}>{m.dosage} · {m.time}</div>
            </div>
            <span className={`${styles.badge} ${m.active ? styles.badgeActive : styles.badgeInactive}`}>
              {m.active ? "Ativo" : "Inativo"}
            </span>
          </div>
        ))
      )}
      <div style={{ marginTop: "0.5rem" }}>
        <Button variant="ghost" size="sm" onClick={onManage}>
          <Settings2 size={14} />
          Gerenciar medicamentos
        </Button>
      </div>
    </div>
  );
}

export function VisaoGeralPaciente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const { overview, loading, error, reload } = useVisaoGeralPaciente(pacienteId);

  const patientName = overview
    ? `${overview.patient.firstName} ${overview.patient.lastName}`.trim() || overview.patient.email
    : "Paciente";

  return (
    <div className="page-container">
      <PageHeader
        title="Visão Geral"
        iconTitle={User}
        icon={User}
        subtitle={loading ? "Carregando..." : patientName}
      />

      <div className={styles.page}>
        <div>
          <Link to="/profissional/pacientes" className={styles.backLink}>
            <ArrowLeft size={14} />
            Voltar para pacientes
          </Link>
        </div>

        {loading ? (
          <p style={{ color: "#6b7280", textAlign: "center", padding: "2rem" }}>Carregando...</p>
        ) : error ? (
          <div style={{ display: "flex", gap: "0.5rem", alignItems: "center", color: "#b91c1c", padding: "1rem" }}>
            <TriangleAlert size={16} />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={reload}>Tentar novamente</Button>
          </div>
        ) : overview ? (
          <>
            <div className={styles.card}>
              <div className={styles.cardHeader}>
                <h2 className={styles.cardTitle}>
                  <User size={16} />
                  Dados do paciente
                </h2>
                <Button variant="ghost" size="sm" onClick={() => navigate(`/profissional/prontuario/${pacienteId}`)}>
                  <FileText size={14} />
                  Ver prontuário
                </Button>
              </div>
              <div>
                <p className={styles.patientName}>{patientName}</p>
                <p className={styles.patientEmail}>{overview.patient.email}</p>
              </div>
            </div>

            <div className={styles.grid}>
              <div className={`${styles.card} ${styles.cardFull}`}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <Pill size={16} />
                    Medicamentos
                  </h2>
                </div>
                <MedicationsSection
                  medications={overview.medications}
                  onManage={() => navigate(`/profissional/medicamentos/${pacienteId}`)}
                />
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <Smile size={16} />
                    Humor (últimos 7 dias)
                  </h2>
                </div>
                <MoodSection mood={overview.mood} />
              </div>

              <div className={styles.card}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <Clover size={16} />
                    Hábitos (últimos 7 dias)
                  </h2>
                </div>
                <HabitsSection habits={overview.habits} />
              </div>

              <div className={`${styles.card} ${styles.cardFull}`}>
                <div className={styles.cardHeader}>
                  <h2 className={styles.cardTitle}>
                    <FileText size={16} />
                    Últimas anotações
                  </h2>
                  <Button variant="ghost" size="sm" onClick={() => navigate(`/profissional/prontuario/${pacienteId}`)}>
                    Ver todas
                  </Button>
                </div>
                <NotesSection notes={overview.lastNotes} />
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

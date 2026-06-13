import { useState, useMemo } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  Zap,
  CalendarClock,
  Plus,
  Smile,
  Paperclip,
  Droplets,
  Activity,
  FileText,
  FileStack,
  TriangleAlert,
} from "lucide-react";
import { useVisaoGeralPaciente } from "./hooks/useVisaoGeralPaciente";
import { InfoClinica } from "./InfoClinica";
import Button from "../../shared/atoms/button/Button";
import styles from "./VisaoGeralPaciente.module.css";

const MOCK_ADHERENCE = [
  { day: "sábado", value: 0 },
  { day: "domingo", value: 0 },
  { day: "segunda", value: 0 },
  { day: "terça", value: 0 },
  { day: "quarta", value: 0 },
  { day: "quinta", value: 0 },
  { day: "sexta", value: 0 },
];

const MOCK_OBSERVACOES = [];

function KpiCard({ icon: Icon, iconBg, label, value }) {
  return (
    <div className={styles.kpiCard}>
      <div className={styles.kpiIcon} style={{ background: iconBg }}>
        <Icon size={18} />
      </div>
      <div className={styles.kpiBody}>
        <span className={styles.kpiLabel}>{label}</span>
        <span className={styles.kpiValue}>{value}</span>
      </div>
    </div>
  );
}

function HumorSection({ mood }) {
  const hasData = mood && mood.length > 0;
  return (
    <div className={styles.card}>
      <div className={styles.cardTitleRow}>
        <Smile size={17} className={styles.cardTitleIcon} />
        <h2 className={styles.cardTitle}>Humor (30 dias)</h2>
      </div>
      {hasData ? (
        <div className={styles.humorList}>
          {mood.map((h) => (
            <div key={h.date} className={styles.humorRow}>
              <span className={styles.humorDate}>{h.date}</span>
              <div className={styles.humorBar}>
                <div className={styles.humorBarFill} style={{ width: `${h.score * 10}%` }} />
              </div>
              <span className={styles.humorScore}>{h.score}/10</span>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyCenter}>
          <span className={styles.emptyText}>Sem dados de humor ainda</span>
        </div>
      )}
    </div>
  );
}

function AdherenceChart({ data }) {
  return (
    <div className={styles.card}>
      <div className={styles.cardTitleRow}>
        <Paperclip size={17} className={styles.cardTitleIcon} />
        <h2 className={styles.cardTitle}>Adesão medicação (14 dias)</h2>
      </div>
      <div className={styles.adherenceHeader}>
        <span className={styles.adherenceLabel}>Adesão média</span>
        <span className={styles.adherencePercent}>0%</span>
      </div>
      <div className={styles.chartArea}>
        <div className={styles.chartYAxis}>
          {[100, 75, 50, 25, 0].map((v) => (
            <span key={v} className={styles.chartYLabel}>{v}%</span>
          ))}
        </div>
        <div className={styles.chartGrid}>
          {[100, 75, 50, 25, 0].map((v) => (
            <div key={v} className={styles.chartGridLine} />
          ))}
          <div className={styles.chartBars}>
            {data.map((d) => (
              <div key={d.day} className={styles.chartBarCol}>
                <div className={styles.chartBarTrack}>
                  <div
                    className={styles.chartBarFill}
                    style={{ height: `${d.value}%` }}
                  />
                </div>
                <span className={styles.chartBarLabel}>{d.day}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function ObservacoesSection({ observacoes }) {
  const hasData = observacoes && observacoes.length > 0;
  return (
    <div className={`${styles.card} ${styles.cardFull}`}>
      <div className={styles.cardTitleRow}>
        <FileStack size={17} className={styles.cardTitleIcon} />
        <h2 className={styles.cardTitle}>Últimas observações</h2>
      </div>
      {hasData ? (
        <div className={styles.obsList}>
          {observacoes.map((obs) => (
            <div key={obs.id} className={styles.obsItem}>
              <span className={styles.obsDate}>{obs.date}</span>
              <p className={styles.obsText}>{obs.content}</p>
            </div>
          ))}
        </div>
      ) : (
        <div className={styles.emptyCenter}>
          <FileText size={40} className={styles.emptyIcon} />
          <span className={styles.emptyText}>Nenhuma observação registrada</span>
        </div>
      )}
    </div>
  );
}

function HabitosTab({ habits }) {
  const hasData = habits && habits.length > 0;
  if (!hasData) {
    return (
      <div className={styles.card}>
        <div className={styles.cardTitleRow}>
          <Activity size={17} className={styles.cardTitleIcon} />
          <h2 className={styles.cardTitle}>Hábitos do paciente</h2>
        </div>
        <div className={styles.emptyCenter}>
          <Activity size={36} className={styles.emptyIcon} />
          <span className={styles.emptyText}>Sem registros de hábitos nos últimos 7 dias</span>
        </div>
      </div>
    );
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardTitleRow}>
        <Activity size={17} className={styles.cardTitleIcon} />
        <h2 className={styles.cardTitle}>Hábitos do paciente (últimos 7 dias)</h2>
      </div>
      <div className={styles.habitTable}>
        <div className={styles.habitHeader}>
          <span>Data</span>
          <span>Exercício</span>
          <span>Sono (h)</span>
          <span>Qual. Sono</span>
          <span>Água</span>
        </div>
        {[...habits].reverse().map((h) => (
          <div key={h.date} className={styles.habitRow}>
            <span className={styles.habitDate}>
              {h.date ? h.date.split("-").reverse().join("/") : "--"}
            </span>
            <span className={`${styles.habitCell} ${h.exercised ? styles.habitYes : styles.habitNo}`}>
              {h.exercised ? "✓" : "✗"}
            </span>
            <span className={styles.habitCell}>{h.sleepHours ?? "--"}h</span>
            <span className={styles.habitCell}>{h.sleepQuality ?? "--"}/5</span>
            <span className={styles.habitCell}>
              {h.water != null ? `${(h.water / 1000).toFixed(1)}L` : "--"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

export function VisaoGeralPaciente() {
  const { pacienteId } = useParams();
  const navigate = useNavigate();
  const { overview, loading, error, reload } = useVisaoGeralPaciente(pacienteId);
  const [activeTab, setActiveTab] = useState("visao");

  const patientName = useMemo(() => {
    if (!overview) return "Paciente";
    return `${overview.patient.firstName ?? ""} ${overview.patient.lastName ?? ""}`.trim() || overview.patient.email;
  }, [overview]);

  const birthDate = overview?.patient?.birthDate ?? null;

  function formatBirthDate(iso) {
    if (!iso) return "Data de nascimento não informada";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}/${y}`;
  }

  const humorMedia = useMemo(() => {
    const mood = overview?.mood;
    if (!mood || mood.length === 0) return "--";
    const avg = mood.reduce((acc, h) => acc + h.score, 0) / mood.length;
    return avg.toFixed(1);
  }, [overview]);

  const exerciseDays = useMemo(() => {
    const habits = overview?.habits;
    if (!habits || habits.length === 0) return "0/0";
    const exercised = habits.filter((h) => h.exercised).length;
    return `${exercised}/${habits.length}`;
  }, [overview]);

  const avgWater = useMemo(() => {
    const habits = overview?.habits;
    if (!habits || habits.length === 0) return "--L";
    const total = habits.reduce((acc, h) => acc + (h.water ?? 0), 0);
    const liters = total / habits.length / 1000;
    return `${liters.toFixed(1)}L`;
  }, [overview]);

  const initials = patientName
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  function handleTabClick(tabId) {
    switch (tabId) {
      case "medicamentos":
        navigate(`/profissional/medicamentos/${pacienteId}`);
        break;
      case "humor":
        navigate(`/profissional/humor/${pacienteId}`);
        break;
      case "observacoes":
        navigate(`/profissional/prontuario/${pacienteId}`);
        break;
      case "mensagens":
        navigate("/chat");
        break;
      default:
        setActiveTab(tabId);
        break;
    }
  }

  const TABS = [
    { id: "visao", label: "Visão Geral", internal: true },
    { id: "clinica", label: "Info Clínica", internal: true },
    { id: "habitos", label: "Hábitos", internal: true },
    { id: "humor", label: "Humor", internal: false },
    { id: "medicamentos", label: "Medicamentos", internal: false },
    { id: "mensagens", label: "Mensagens", internal: false },
    { id: "observacoes", label: "Observações", internal: false },
  ];

  return (
    <div className={styles.pageWrapper}>
      <div className={styles.topBar}>
        <div className={styles.topBarLeft}>
          <button
            className={styles.backBtn}
            onClick={() => navigate("/profissional/pacientes")}
            aria-label="Voltar"
          >
            <ArrowLeft size={16} />
          </button>
          <div className={styles.patientAvatar}>{initials || "?"}</div>
          <div className={styles.patientMeta}>
            <span className={styles.patientName}>
              {loading ? "Carregando..." : patientName}
            </span>
            <span className={styles.patientBirth}>
              {loading ? "" : formatBirthDate(birthDate)}
            </span>
          </div>
        </div>
        <div className={styles.topBarActions}>
          <button className={styles.actionBtn}>
            <Zap size={15} />
            <span>Enviar agora</span>
          </button>
          <button className={styles.actionBtn}>
            <CalendarClock size={15} />
            <span>Agendar Mensagem</span>
          </button>
          <button
            className={`${styles.actionBtn} ${styles.actionBtnPrimary}`}
            onClick={() => navigate(`/profissional/prontuario/${pacienteId}`)}
          >
            <Plus size={15} />
            <span>Nova Observação</span>
          </button>
        </div>
      </div>

      <div className={styles.tabsBar}>
        <nav className={styles.tabsNav} aria-label="Navegação do paciente">
          {TABS.map((tab) => (
            <button
              key={tab.id}
              className={`${styles.tabBtn} ${activeTab === tab.id && tab.internal ? styles.tabBtnActive : ""}`}
              onClick={() => handleTabClick(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      </div>

      <div className={styles.pageContent}>
        {error ? (
          <div className={styles.errorBox}>
            <TriangleAlert size={16} />
            <span>{error}</span>
            <Button variant="ghost" size="sm" onClick={reload}>
              Tentar novamente
            </Button>
          </div>
        ) : activeTab === "clinica" ? (
          <InfoClinica pacienteId={pacienteId} />
        ) : activeTab === "habitos" ? (
          <HabitosTab habits={overview?.habits} />
        ) : (
          <>
            <div className={styles.kpiGrid}>
              <KpiCard
                icon={Smile}
                iconBg="rgba(81,153,109,0.12)"
                label="Média humor"
                value={loading ? "--" : humorMedia}
              />
              <KpiCard
                icon={Paperclip}
                iconBg="rgba(81,153,109,0.12)"
                label="Adesão medicação"
                value="--%"
              />
              <KpiCard
                icon={Droplets}
                iconBg="rgba(56,139,209,0.12)"
                label="Média água"
                value={loading ? "--L" : avgWater}
              />
              <KpiCard
                icon={Activity}
                iconBg="rgba(81,153,109,0.12)"
                label="Dias c/ exercício"
                value={loading ? "0/0" : exerciseDays}
              />
            </div>

            <div className={styles.mainGrid}>
              <HumorSection mood={overview?.mood} />
              <AdherenceChart data={MOCK_ADHERENCE} />
            </div>

            <ObservacoesSection observacoes={MOCK_OBSERVACOES} />
          </>
        )}
      </div>
    </div>
  );
}

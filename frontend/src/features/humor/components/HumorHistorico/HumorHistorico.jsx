import { Smile } from "lucide-react";
import { Select } from "../../../../shared/atoms/select/Select";
import { Card } from "../../../../shared/atoms/Card/Card";
import styles from "./HumorHistorico.module.css";

const PERIODOS = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "14", label: "Últimos 14 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
];

const ROTULOS = [
  { min: 0, max: 1, rotulo: "Muito baixo" },
  { min: 2, max: 3, rotulo: "Baixo" },
  { min: 4, max: 5, rotulo: "Regular" },
  { min: 6, max: 7, rotulo: "Bom" },
  { min: 8, max: 9, rotulo: "Ótimo" },
  { min: 10, max: 10, rotulo: "Incrível" },
];

function getRotulo(score) {
  return ROTULOS.find((r) => score >= r.min && score <= r.max)?.rotulo ?? "Regular";
}

function getBadgeColor(score) {
  if (score <= 3) return "#e74c3c";
  if (score <= 6) return "#f39c12";
  return "#428A5A";
}

function formatDate(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });
}

export function HumorHistorico({ entries, loading, periodo, onPeriodoChange }) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.titulo}>Histórico</h2>
        <Select
          value={String(periodo)}
          onChange={(v) => onPeriodoChange(Number(v))}
          options={PERIODOS}
        />
      </div>

      {loading && (
        <div className={styles.skeletons}>
          {[1, 2, 3].map((i) => (
            <div key={i} className={styles.skeleton} />
          ))}
        </div>
      )}

      {!loading && entries.length === 0 && (
        <div className={styles.empty}>
          <Smile size={40} color="#d1d5db" />
          <p>Nenhum registro encontrado</p>
        </div>
      )}

      {!loading && entries.length > 0 && (
        <div className={styles.list}>
          {entries.map((entry) => (
            <Card key={entry.id} className={styles.entry}>
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

              {entry.notes && (
                <p className={styles.notes}>{entry.notes}</p>
              )}
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

import { Smile } from "lucide-react";
import { Select } from "../../../../shared/atoms/select/Select";
import { Card } from "../../../../shared/atoms/Card/Card";
import { getRotulo, getBadgeColor, formatDate } from "../../humorFormat";
import styles from "./HumorHistorico.module.css";

const PERIODOS = [
  { value: "7", label: "Últimos 7 dias" },
  { value: "14", label: "Últimos 14 dias" },
  { value: "30", label: "Últimos 30 dias" },
  { value: "90", label: "Últimos 90 dias" },
];

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
            <Card
              key={entry.id}
              className={styles.entry}
              data-cy="humor-history-entry"
            >
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

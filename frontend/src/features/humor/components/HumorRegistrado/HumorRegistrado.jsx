import { Info } from "lucide-react";
import { InfoBanner } from "../../../../shared/atoms/InfoBanner/InfoBanner";
import styles from "./HumorRegistrado.module.css";

const EMOJIS = [
  { min: 0, max: 1, emoji: "\u{1F622}", rotulo: "Muito baixo" },
  { min: 2, max: 3, emoji: "\u{1F61E}", rotulo: "Baixo" },
  { min: 4, max: 5, emoji: "\u{1F610}", rotulo: "Regular" },
  { min: 6, max: 7, emoji: "\u{1F642}", rotulo: "Bom" },
  { min: 8, max: 9, emoji: "\u{1F604}", rotulo: "Ótimo" },
  { min: 10, max: 10, emoji: "\u{1F929}", rotulo: "Incrível" },
];

function getInfo(score) {
  return EMOJIS.find((e) => score >= e.min && score <= e.max) ?? EMOJIS[2];
}

export function HumorRegistrado({ registro }) {
  const info = getInfo(registro.score);

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <span className={styles.emoji}>{info.emoji}</span>
        <span className={styles.score}>{registro.score}</span>
        <span className={styles.rotulo}>{info.rotulo}</span>

        {registro.factors?.length > 0 && (
          <div className={styles.fatores}>
            {registro.factors.map((f) => (
              <span key={f} className={styles.fator}>{f}</span>
            ))}
          </div>
        )}

        {registro.notes && (
          <p className={styles.anotacao}>{registro.notes}</p>
        )}
      </div>

      <InfoBanner icon={Info} text="Você já registrou seu humor hoje" iconColor="#428A5A" />
    </div>
  );
}

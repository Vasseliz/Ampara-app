import { useState } from "react";
import { Button } from "../../../../shared/atoms/button/Button";
import styles from "./HumorSlider.module.css";

const EMOJIS = [
  { min: 0, max: 1, emoji: "\u{1F622}" },
  { min: 2, max: 3, emoji: "\u{1F61E}" },
  { min: 4, max: 5, emoji: "\u{1F610}" },
  { min: 6, max: 7, emoji: "\u{1F642}" },
  { min: 8, max: 9, emoji: "\u{1F604}" },
  { min: 10, max: 10, emoji: "\u{1F929}" },
];

const FATORES = [
  "Sono", "Exercício", "Trabalho", "Relacionamentos",
  "Saúde", "Alimentação", "Lazer", "Ansiedade",
];

function getEmoji(score) {
  return EMOJIS.find((e) => score >= e.min && score <= e.max)?.emoji ?? "\u{1F610}";
}

function getScoreColor(score) {
  if (score <= 3) return "#e74c3c";
  if (score <= 6) return "#f39c12";
  return "#428A5A";
}

export function HumorSlider({ onSubmit, loading }) {
  const [score, setScore] = useState(5);
  const [fatores, setFatores] = useState([]);
  const [anotacao, setAnotacao] = useState("");

  function toggleFator(f) {
    setFatores((prev) =>
      prev.includes(f) ? prev.filter((x) => x !== f) : [...prev, f]
    );
  }

  function handleSubmit() {
    onSubmit({ score, factors: fatores, notes: anotacao || null });
  }

  return (
    <div className={styles.container}>
      <div className={styles.emojiWrap}>
        <span className={styles.emoji}>{getEmoji(score)}</span>
        <span className={styles.scoreValue} style={{ color: getScoreColor(score) }}>
          {score}
        </span>
      </div>

      <div className={styles.sliderWrap}>
        <span className={styles.label}>Muito mal</span>
        <input
          type="range"
          min={0}
          max={10}
          value={score}
          onChange={(e) => setScore(Number(e.target.value))}
          className={styles.slider}
          style={{ "--score-color": getScoreColor(score), "--score-pct": `${score * 10}%` }}
        />
        <span className={styles.label}>Incrível</span>
      </div>

      <div className={styles.fatores}>
        {FATORES.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.fator} ${fatores.includes(f) ? styles.fatorAtivo : ""}`}
            onClick={() => toggleFator(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <textarea
        className={styles.anotacao}
        placeholder="Como você está se sentindo? (opcional)"
        value={anotacao}
        onChange={(e) => setAnotacao(e.target.value)}
        rows={3}
      />

      <Button
        variant="primary"
        fullWidth
        onClick={handleSubmit}
        disabled={loading}
      >
        {loading ? "Registrando..." : "Registrar"}
      </Button>
    </div>
  );
}

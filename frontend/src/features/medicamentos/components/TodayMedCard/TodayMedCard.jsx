import React from 'react';
import { motion as Motion, useAnimation } from 'framer-motion';
import { Clock, Check, ChevronRight } from 'lucide-react';
import { useSwipeToComplete } from '../../hooks/useSwipeToComplete';
import styles from './TodayMedCard.module.css';
import { ProgressBar } from '../../../../shared/atoms/ProgressBar/ProgressBar';
import { Card } from '../../../../shared/atoms/Card/Card';

function TodayMedRow({ medication, onComplete, disabled = false }) {
  const { isTaken, handleDragEnd } = useSwipeToComplete(onComplete, 80);
  const controls = useAnimation();

  const completed = medication.taken || isTaken;

  const onDragEnd = async (event, info) => {
    handleDragEnd(event, info);
    if (!isTaken && info.offset.x <= 80) {
      controls.start({ x: 0, transition: { type: 'spring', stiffness: 300, damping: 20 } });
    } else {
      controls.start({ x: 0 });
    }
  };

  return (
    <div className={styles.swipeRow}>
      {!completed && (
        <div className={styles.swipeBackground}>
          <Check className={styles.swipeIcon} size={24} />
        </div>
      )}

      {/* Camada Deslizável */}
      <Motion.div
        className={`${styles.medCard} ${completed ? styles.medCardCompleted : ''}`}
        drag={completed || disabled ? false : "x"}
        dragConstraints={{ left: 0, right: 0 }}
        dragElastic={{ left: 0, right: 0.5 }}
        onDragEnd={onDragEnd}
        animate={controls}
        whileTap={!completed ? { cursor: 'grabbing' } : {}}
        style={!completed ? { cursor: 'grab' } : {}}
      >
        <div className={styles.medInfo}>
          <Clock className={styles.clockIcon} size={20} />
          <div className={styles.medDetails}>
            <p className={styles.medName}>{medication.name}</p>
            <p className={styles.medTime}>{medication.time} • {medication.dosage}</p>
          </div>
        </div>

        <div className={styles.actions}>
          {completed ? (
            <Motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className={styles.checkButton}
            >
              <Check size={16} strokeWidth={3} />
            </Motion.div>
          ) : (
            <div className={styles.dragHandle}>
              <ChevronRight size={16} color="#428A5A" />
            </div>
          )}
        </div>
      </Motion.div>
    </div>
  );
}

export function TodayMedsCard({
  medications = [],
  completedCount = 0,
  totalCount = medications.length,
  takingId = "",
  onComplete,
}) {
  return (
    <Card className={styles.todayCardWrapper}>
      <div className={styles.header}>
        <h3 className={styles.title}>Medicamentos de hoje</h3>
        <span className={styles.progressText}>
          Progresso de hoje{" "}
          <strong style={{ color: '#428A5A' }}>{completedCount}/{totalCount}</strong>
        </span>
      </div>

      <ProgressBar
        progress={totalCount ? (completedCount / totalCount) * 100 : 0}
        max={100}
        className={styles.progressBar}
      />

      <div className={styles.medList}>
        {medications.map((medication) => (
          <TodayMedRow
            key={medication.id}
            medication={medication}
            disabled={takingId === medication.id}
            onComplete={() => onComplete(medication.id)}
          />
        ))}
      </div>
    </Card>
  );
}

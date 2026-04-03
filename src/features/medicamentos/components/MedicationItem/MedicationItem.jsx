import React from 'react';
import { Pill, AlertCircle, Link } from 'lucide-react';
import { Card } from '../../../../shared/atoms/Card/Card';
import styles from './MedicationItem.module.css';

const MedicationItem = ({ name, dosage, time, observation }) => (
  <div className={styles.itemWrapper}>
    <div className={styles.iconContainer}>
      <Pill size={24} />
    </div>
    <div className={styles.info}>
      <p className={styles.name}>{name}</p>
      <p className={styles.dosage}>{dosage}</p>
      <p className={styles.details}>
        {time} {observation && `• ${observation}`}
      </p>
    </div>
  </div>
);

export function MyMedicationsList({ medications }) {
  return (
    <Card>
      <div className={styles.header}>
        <h3 className={styles.title}>
          <Link size={18} className={styles.titleIcon} />
          Meus medicamentos
        </h3>
      </div>
      <div className={styles.list}>
        {medications.map((med, index) => (
          <MedicationItem 
            key={index}
            name={med.name}
            dosage={med.dosage}
            time={med.time}
            observation={med.observation}
          />
        ))}
      </div>
    </Card>
  );
}

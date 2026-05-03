import React from 'react';
import styles from './ProgressBar.module.css';

export function ProgressBar({ progress = 0, max = 100, className = '' }) {
  const percentage = Math.min(Math.max((progress / max) * 100, 0), 100);

  return (
    <div className={`${styles.progressBarContainer} ${className}`} role="progressbar" aria-valuenow={percentage} aria-valuemin="0" aria-valuemax="100">
      <div 
        className={styles.progressBarFill} 
        style={{ width: `${percentage}%` }}
      />
    </div>
  );
}

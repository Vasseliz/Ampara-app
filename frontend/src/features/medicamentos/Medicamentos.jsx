import React, { useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Loader2, Pill } from 'lucide-react';
import styles from './Medicamentos.module.css';
import { PageHeader } from '../../shared/molecules/PageHeader/PageHeader';

import { TodayMedCard } from './components/TodayMedCard/TodayMedCard';
import { AdherenceChart } from './components/AdherenceChart/AdherenceChart';
import { MyMedicationsList } from './components/MedicationItem/MedicationItem';
import { usePullToRefreshSync } from './hooks/usePullToRefreshSync';

// Mock Data inicial
const initialDailyMeds = [
  { id: 1, name: 'Fluoxetina', dosage: '20mg', time: '08:00', taken: false, observation: 'Tomar em jejum' }
];

const mockChartData = [
  { day: 'sábado', value: 90 },
  { day: 'domingo', value: 85 },
  { day: 'segunda', value: 100 },
  { day: 'terça', value: 0 }, 
  { day: 'quarta', value: 100 },
  { day: 'quinta', value: 100 },
  { day: 'sexta', value: 100 },
];

export function MedicamentosScreen() {
  const [dailyMeds, setDailyMeds] = useState(initialDailyMeds);
  
  const handleSync = useCallback(async () => {
    await new Promise(resolve => setTimeout(resolve, 1500));
    setDailyMeds([{ ...initialDailyMeds[0], taken: false }]); 
  }, []);

  const { isRefreshing, handleRefresh } = usePullToRefreshSync(handleSync);


  const markAsTaken = useCallback((id) => {
    setDailyMeds(prev => prev.map(med => med.id === id ? { ...med, taken: true } : med));
    // fetch('/api/adesao', { method: 'POST', body: JSON.stringify({ id, taken: true }) })
  }, []);

  const calculateAverage = (data) => {
    const sum = data.reduce((acc, curr) => acc + curr.value, 0);
    return Math.round(sum / Math.max(data.length, 1));
  };

  const currentAverage = calculateAverage(mockChartData);
  const isTouchDevice = typeof window !== 'undefined' && window.matchMedia("(pointer: coarse)").matches;

  return (
    <div className="page-container">
      <div className={`${styles.pullToRefreshContainer} ${isRefreshing ? styles.refreshing : ''}`}>
        <Loader2 className={styles.spinner} size={24} />
      </div>

      <PageHeader
        title="Medicamentos"
        subtitle="Acompanhe seus medicamentos prescritos pelo seu médico"
        icon={Pill}
      />

      <section className={styles.section}>
        {dailyMeds.map(med => (
          <TodayMedCard 
            key={med.id} 
            medication={med} 
            onComplete={() => markAsTaken(med.id)} 
          />
        ))}
      </section>

      <section className={styles.section}>
        <AdherenceChart data={mockChartData} averageAdherence={currentAverage} />
      </section>

      <section className={styles.section}>
        <MyMedicationsList medications={initialDailyMeds} />
      </section>
    </div>
  );
}

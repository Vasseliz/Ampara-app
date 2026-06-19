import { useCallback } from "react";
import { Loader2, Pill, TriangleAlert } from "lucide-react";
import styles from "./Medicamentos.module.css";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import Button from "../../shared/atoms/button/Button";
import { TodayMedsCard } from "./components/TodayMedCard/TodayMedCard";
import { AdherenceChart } from "./components/AdherenceChart/AdherenceChart";
import { MyMedicationsList } from "./components/MedicationItem/MedicationItem";
import { usePullToRefreshSync } from "./hooks/usePullToRefreshSync";
import { useMedicamentosPaciente } from "./hooks/useMedicamentosPaciente";

export function MedicamentosScreen() {
  const {
    today,
    medications,
    adherence,
    averageAdherence,
    loading,
    takingId,
    error,
    reload,
    markAsTaken,
  } = useMedicamentosPaciente();

  const handleSync = useCallback(async () => {
    await reload({ silent: true });
  }, [reload]);

  const { isRefreshing } = usePullToRefreshSync(handleSync);
  const completedToday = today.filter((medication) => medication.taken).length;

  return (
    <div className="page-container">
      <div className={`${styles.pullToRefreshContainer} ${isRefreshing ? styles.refreshing : ""}`}>
        <Loader2 className={styles.spinner} size={24} />
      </div>

      <PageHeader
        title="Medicamentos"
        subtitle="Acompanhe seus medicamentos prescritos pelo seu médico"
        icon={Pill}
      />

      {loading ? (
        <div className={styles.status}>
          <Loader2 className={styles.spinner} size={24} />
          <span>Carregando medicamentos...</span>
        </div>
      ) : error ? (
        <div className={`${styles.status} ${styles.errorStatus}`}>
          <TriangleAlert size={22} />
          <span>{error}</span>
          <Button variant="ghost" size="sm" onClick={() => reload().catch(() => {})}>
            Tentar novamente
          </Button>
        </div>
      ) : (
        <>
          <section className={styles.section}>
            {today.length ? (
              <TodayMedsCard
                medications={today}
                completedCount={completedToday}
                totalCount={today.length}
                takingId={takingId}
                onComplete={markAsTaken}
              />
            ) : (
              <div className={styles.emptyState}>Nenhum medicamento ativo para hoje.</div>
            )}
          </section>

          <section className={styles.section}>
            <AdherenceChart data={adherence} averageAdherence={averageAdherence} />
          </section>

          <section className={styles.section}>
            <MyMedicationsList medications={medications} />
          </section>
        </>
      )}
    </div>
  );
}

import { useState } from "react";
import { Smile } from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { HumorSlider } from "./components/HumorSlider/HumorSlider";
import { HumorRegistrado } from "./components/HumorRegistrado/HumorRegistrado";
import { HumorHistorico } from "./components/HumorHistorico/HumorHistorico";
import { useHumorHoje, useHistoricoHumor, registrarHumor } from "./hooks/useHumor";
import { toast } from "../../shared/atoms/toast/Toast";
import styles from "./Humor.module.css";

export function Humor() {
  const { data: todayMood, loading: loadingHoje, refetch } = useHumorHoje();
  const [periodo, setPeriodo] = useState(14);
  const { data: entries, loading: loadingHistorico } = useHistoricoHumor(periodo);
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(payload) {
    setSubmitting(true);
    try {
      const res = await registrarHumor(payload);
      if (res.ok) {
        toast.success("Humor registrado com sucesso!");
        refetch();
      } else if (res.status === 409) {
        toast.error("Você já registrou seu humor hoje.");
        refetch();
      } else {
        const data = await res.json().catch(() => ({}));
        toast.error(data.message || "Erro ao registrar humor.");
      }
    } catch {
      toast.error("Erro ao registrar humor.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="page-container">
      <PageHeader
        title="Humor"
        subtitle="Acompanhe como você está se sentindo"
        icon={Smile}
      />

      <section className={styles.section}>
        {loadingHoje ? (
          <div className={styles.loading}>Carregando...</div>
        ) : todayMood ? (
          <HumorRegistrado registro={todayMood} />
        ) : (
          <HumorSlider onSubmit={handleSubmit} loading={submitting} />
        )}
      </section>

      <section className={styles.section}>
        <HumorHistorico
          entries={entries}
          loading={loadingHistorico}
          periodo={periodo}
          onPeriodoChange={setPeriodo}
        />
      </section>
    </div>
  );
}

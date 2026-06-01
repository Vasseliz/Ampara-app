import { useState } from "react";
import { Card } from "../../../shared/atoms/Card/Card";
import Button from "../../../shared/atoms/button/Button";
import { useHistoricoHabitos } from "../hooks/useHabitos";
import "./HabitosHistorico.css";

const HabitosHistorico = () => {
  const [dias, setDias] = useState(7);
  const { data, loading } = useHistoricoHabitos(dias);

  const calcularEstatisticas = () => {
    if (!data || data.length === 0) {
      return { mediaAgua: 0, mediaSono: 0, exercitou: "0/0" };
    }

    const totalAgua = data.reduce((sum, h) => sum + h.agua, 0);
    const mediaAgua = (totalAgua / data.length).toFixed(1);

    const totalSono = data.reduce((sum, h) => sum + h.horasSono, 0);
    const mediaSono = (totalSono / data.length).toFixed(1);

    const exercitouCount = data.filter((h) => h.exercitou).length;
    const exercitou = `${exercitouCount}/${data.length}`;

    return { mediaAgua, mediaSono, exercitou };
  };

  const stats = calcularEstatisticas();

  if (loading) return <p>Carregando histórico...</p>;

  return (
    <div className="habitos-historico">
      <h3 className="habitos-historico__title">Histórico</h3>

      <div className="habitos-historico__buttons">
        {[7, 14, 30, 90].map((d) => (
          <Button
            key={d}
            variant={dias === d ? "primary" : "ghost"}
            onClick={() => setDias(d)}
          >
            {d}d
          </Button>
        ))}
      </div>

      <div className="habitos-historico__cards">
        <Card className="habitos-historico__card">
          <div className="habitos-historico__icon">💧</div>
          <p className="habitos-historico__label">Média Água</p>
          <p className="habitos-historico__value">{stats.mediaAgua}L</p>
        </Card>

        <Card className="habitos-historico__card">
          <div className="habitos-historico__icon">😴</div>
          <p className="habitos-historico__label">Média Sono</p>
          <p className="habitos-historico__value">{stats.mediaSono}h</p>
        </Card>

        <Card className="habitos-historico__card">
          <div className="habitos-historico__icon">💪</div>
          <p className="habitos-historico__label">Exercitou</p>
          <p className="habitos-historico__value">{stats.exercitou}</p>
        </Card>
      </div>
    </div>
  );
};

export { HabitosHistorico };

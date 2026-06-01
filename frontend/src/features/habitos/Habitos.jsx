import { Clover, Smile, Dumbbell, Moon, Droplets } from "lucide-react";
import { PageHeader } from "../../shared/molecules/PageHeader/PageHeader";
import { useNavigate } from "react-router";
import "./Habitos.css";
import { RangeSlider } from "../../shared/atoms/RangeSlider/RangeSlider";
import { Card } from "../../shared/atoms/Card/Card";
import { InfoBanner } from "../../shared/atoms/InfoBanner/InfoBanner";
import { Toggle } from "../../shared/atoms/Toggle/Toggle";
import { useState } from "react";
import Button from "../../shared/atoms/button/Button";
import { useHabitosHoje, registrarHabito } from "./hooks/useHabitos";
import { toast } from "../../shared/atoms/toast/Toast";
import { HabitosHistorico } from "./components/HabitosHistorico";

const Habitos = () => {
  const [done, setDone] = useState(false);
  const [horas, setHoras] = useState(0);
  const [qualidade, setQualidade] = useState(1);
  const [agua, setAgua] = useState(0);
  const navigate = useNavigate();
  const { data, loading } = useHabitosHoje();
  const [submitting, setSubmitting] = useState(false);

  const handleSubmission = async ({ done, horas, qualidade, agua }) => {
    setSubmitting(true);
    try {
      const response = await registrarHabito({
        exercitou: done,
        horasSono: horas,
        qualidadeSono: qualidade,
        agua: agua,
      });
      console.log({data,loading})
      if (response.ok) return toast.success("Hábitos registrado com sucesso!");
      if (response.status === 409) {
        return toast.error("Você já registrou hábito hoje.");

      }
    } catch {
      toast.error("Erro ao registrar hábito Diário.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleIconClick = () => {
    navigate("/");
  };

  const handleToggleChange = () => {
    if (!done) {
      return setDone(true);
    }
    setDone(false);
  };

  const handleChangeHoras = (e) => {
    setHoras(Number(e.target.value));
  };

  return (
    <div className="habitos__container">
      <PageHeader
        title="Habitos"
        icon={Clover}
        subtitle="Registre seus Hábitos Diários"
        handleIcon={handleIconClick}
      />
      <section className="habitos__section-1">
        <h3 className="habitos__section-titulo-1">Registros de Hoje</h3>
        <Card className="habitos__card-1">
          <div className="habitos__div-1">
            <InfoBanner
              className="info-banner"
              text="Exercitou hoje? "
              icon={Dumbbell}
              iconColor="lightgreen"
            />
            {done ? (
              <span className="habitos__div-1-span"> Parabéns 🎉 </span>
            ) : (
              <span className="habitos__div-1-span">Ainda nao? 😒 </span>
            )}
          </div>
          <Toggle checked={done} onChange={handleToggleChange} />
        </Card>
        <Card className="habitos__card-2">
          <div className="habitos__div-2">
            <InfoBanner
              className="info-banner"
              text="Como foi seu Sono?"
              icon={Moon}
              iconColor="lightgreen"
            />
          </div>
          <div className="habitos__div-3">
            <div className="habitos__div-3-header">
              <p className="habitos__p">Horas dormidas</p>
              <span className="habitos__badge">{horas}h</span>
            </div>
            <RangeSlider
              min={0}
              max={12}
              value={horas}
              onChange={handleChangeHoras}
            />
            <div className="habitos__ticks">
              <span>0h</span>
              <span>3h</span>
              <span>6h</span>
              <span>9h</span>
              <span>12h</span>
            </div>
          </div>
          <div className="habitos__div-4">
            <div className="habitos__div-4-header">
              <p className="habitos__p">Qualidade do sono (1-5)</p>
              <span className="habitos__badge">{qualidade}/5</span>
            </div>
            <div className="habitos__quality-btns">
              {[1, 2, 3, 4, 5].map((n) => (
                <Button
                  key={n}
                  variant={qualidade === n ? "primary" : "ghost"}
                  onClick={() => setQualidade(n)}
                >
                  {n}
                </Button>
              ))}
            </div>
          </div>
        </Card>
        <Card className="habitos__card-3">
          <div className="habitos__div-5">
            <InfoBanner
              className="info-banner"
              text="Água"
              icon={Droplets}
              iconColor="lightblue"
            />
            <span className="habitos__badge">{agua}L</span>
          </div>
          <RangeSlider
            min={0}
            max={4}
            value={agua}
            onChange={(e) => setAgua(Number(e.target.value))}
          />
          <div className="habitos__ticks">
            <span>0L</span>
            <span>1L</span>
            <span>2L</span>
            <span>3L</span>
            <span>4L</span>
          </div>
        </Card>
        <Button
          variant="primary"
          fullWidth={true}
          children={"Registrar"}
          onClick={() => handleSubmission({ done, horas, qualidade, agua })}
        />
      </section>
    {data && <HabitosHistorico />}
    </div>
  );
};
export { Habitos };

import { Mail, CalendarDays } from "lucide-react";
import { Card } from "../../shared/atoms/Card/Card";

function formatarData(linkedAt) {
  if (!linkedAt) {
    return "Data não informada";
  }

  const data = new Date(linkedAt);
  if (Number.isNaN(data.getTime())) {
    return "Data não informada";
  }

  return new Intl.DateTimeFormat("pt-BR", {
    dateStyle: "medium",
  }).format(data);
}

export function PacienteCard({ patient }) {
  return (
    <Card className="pacientes-card">
      <div className="pacientes-card__header">
        <div>
          <p className="pacientes-card__eyebrow">Paciente vinculado</p>
          <h2 className="pacientes-card__title">{patient.fullName}</h2>
        </div>
      </div>

      <div className="pacientes-card__meta-list">
        <div className="pacientes-card__meta-item">
          <Mail size={16} />
          <div>
            <span className="pacientes-card__meta-label">E-mail</span>
            <p className="pacientes-card__meta-value">
              {patient.email || "Não informado"}
            </p>
          </div>
        </div>

        <div className="pacientes-card__meta-item">
          <CalendarDays size={16} />
          <div>
            <span className="pacientes-card__meta-label">Vinculado em</span>
            <p className="pacientes-card__meta-value">
              {formatarData(patient.linkedAt)}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

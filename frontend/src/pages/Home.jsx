import { Navigate } from "react-router-dom";
import { Lock, FileText, Mail, Pill, Smile, MessageCircle, Users } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PageHeader } from "../shared/molecules/PageHeader/PageHeader";
import { NavigationCard } from "../shared/molecules/navigationCard/NavigationCard";
import { InfoBanner } from "../shared/atoms/InfoBanner/InfoBanner";
import "./Home.css";

const cardsPaciente = [
  {
    to: "/convites",
    icon: Mail,
    tag: "Paciente",
    tagVariant: "paciente",
    title: "Convites",
    description:
      "Veja e aceite convites de profissionais vinculados ao seu cuidado.",
  },
  {
    to: "/cofre",
    icon: Lock,
    tag: "Paciente",
    tagVariant: "paciente",
    title: "Cofre",
    description: "Registe pensamentos e emoções de forma privada e segura.",
  },
  {
    to: "/medicamentos",
    icon: Pill,
    tag: "Paciente",
    tagVariant: "paciente",
    title: "Medicamentos",
    description: "Acompanhe os medicamentos prescritos pelo seu médico.",
  },
  {
    to: "/humor",
    icon: Smile,
    tag: "Paciente",
    tagVariant: "paciente",
    title: "Humor",
    description: "Registre como você está se sentindo e acompanhe sua evolução.",
  },
  {
    to: "/chat",
    icon: MessageCircle,
    tag: "Compartilhado",
    tagVariant: "paciente",
    title: "Chat",
    description: "Converse com seu profissional de saúde em um único canal.",
  },
];

const cardsProfissional = [
  {
    to: "/profissional/pacientes",
    icon: Users,
    tag: "Profissional",
    tagVariant: "profissional",
    title: "Pacientes",
    description: "Veja os pacientes vinculados ao seu perfil profissional.",
  },
  {
    to: "/profissional/prontuario",
    icon: FileText,
    tag: "Profissional",
    tagVariant: "profissional",
    title: "Prontuário",
    description: "Aceda e organize os prontuários dos seus pacientes.",
  },
  {
    to: "/chat",
    icon: MessageCircle,
    tag: "Compartilhado",
    tagVariant: "profissional",
    title: "Chat",
    description: "Converse com o paciente por um canal simples e centralizado.",
  },
];

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="home-loading">Carregando…</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isProfissional = user.role === "professional";
  const cards = isProfissional ? cardsProfissional : cardsPaciente;
  const subtitle = isProfissional
    ? "Área do profissional de saúde"
    : "Área do paciente";

  return (
    <div className="home-layout">
      <div className="home-container">
        <PageHeader title="Ampara" subtitle={subtitle} />

        <div className="home-section">
          <InfoBanner
            text={
              isProfissional
                ? "Escolha onde quer continuar."
                : "O seu acesso rápido às áreas do Ampara."
            }
          />
          <div className="home-section__label">
            <div className="home-section__border" />
            <h2 className="home-section__title">Acesso rápido</h2>
          </div>

          <div className="home-cards">
            {cards.map((card) => (
              <NavigationCard key={card.to} {...card} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

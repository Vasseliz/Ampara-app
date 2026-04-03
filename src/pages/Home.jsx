import { Lock, FileText } from "lucide-react";
import { PageHeader } from "../shared/molecules/PageHeader/PageHeader";
import { NavigationCard } from "../shared/molecules/navigationCard/NavigationCard";
import { InfoBanner } from "../shared/atoms/InfoBanner/InfoBanner";
import "./Home.css";

const cards = [
  {
    to: "/cofre",
    icon: Lock,
    tag: "Paciente",
    tagVariant: "paciente",
    title: "Cofre",
    description: "Registre pensamentos e emoções de forma privada e segura.",
  },
  {
    to: "/profissional/prontuario",
    icon: FileText,
    tag: "Profissional",
    tagVariant: "profissional",
    title: "Prontuário",
    description: "Acesse e gerencie prontuários clínicos com organização.",
  },

  
];

export default function Home() {
  return (
    <div className="home-layout">
      <div className="home-container">

        <PageHeader title="Ampara" subtitle="Saúde mental em um só lugar" />

        <InfoBanner text="Selecione sua área de acesso para continuar." />

        <div className="home-section">
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
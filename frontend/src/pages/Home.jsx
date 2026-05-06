import { Navigate } from "react-router-dom";
import { Lock, FileText, Pill } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PageHeader } from "../shared/molecules/PageHeader/PageHeader";
import { NavigationCard } from "../shared/molecules/navigationCard/NavigationCard";
import { InfoBanner } from "../shared/atoms/InfoBanner/InfoBanner";
import "./Home.css";

const cardsPaciente = [
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
];

const cardsProfissional = [
    {
        to: "/profissional/prontuario",
        icon: FileText,
        tag: "Profissional",
        tagVariant: "profissional",
        title: "Prontuário",
        description: "Aceda e organize os prontuários dos seus pacientes.",
    },
];

export default function Home() {
    const { user, loading } = useAuth();

    if (loading) {
        return (
            <div className="home-loading">
                Carregando…
            </div>
        );
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

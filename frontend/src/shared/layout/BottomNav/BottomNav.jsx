import { NavLink } from "react-router-dom";
import {
  Home,
  Pill,
  Smile,
  MessageCircle,
  Clover,
  Users,
  FileText,
} from "lucide-react";
import { useAuth } from "../../../contexts/AuthContext";
import styles from "./BottomNav.module.css";

const linksPaciente = [
  { to: "/", label: "Início", Icon: Home, end: true },
  { to: "/medicamentos", label: "Meds", Icon: Pill },
  { to: "/humor", label: "Humor", Icon: Smile },
  { to: "/habitos", label: "Hábitos", Icon: Clover },
  { to: "/chat", label: "Chat", Icon: MessageCircle },
];

const linksProfissional = [
  { to: "/", label: "Início", Icon: Home, end: true },
  { to: "/profissional/pacientes", label: "Pacientes", Icon: Users },
  { to: "/profissional/medicamentos", label: "Meds", Icon: Pill },
  { to: "/profissional/prontuario", label: "Notas", Icon: FileText },
  { to: "/chat", label: "Chat", Icon: MessageCircle },
];

export function BottomNav() {
  const { user } = useAuth();
  if (!user) return null;

  const links = user.role === "professional" ? linksProfissional : linksPaciente;

  return (
    <nav className={styles.bottomNav} aria-label="Navegação principal">
      {links.map(({ to, label, Icon, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          className={({ isActive }) =>
            `${styles.item} ${isActive ? styles.active : ""}`
          }
        >
          <Icon size={20} strokeWidth={1.8} />
          <span className={styles.label}>{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

import { NavLink } from 'react-router-dom';
import {
  Home,
  Lock,
  Pill,
  FileText,
  Settings,
  LogOut,
  HeartPulse,
  X,
} from 'lucide-react';
import styles from './Sidebar.module.css';

const mainLinks = [
  { to: '/',             label: 'Início',       Icon: Home     },
  { to: '/cofre',        label: 'Cofre',        Icon: Lock     },
  { to: '/medicamentos', label: 'Medicamentos', Icon: Pill     },
  { to: '/profissional/prontuario', label: 'Prontuário', Icon: FileText },
];

const footerLinks = [
  { to: '/configuracoes', label: 'Configurações', Icon: Settings },
  { to: '/sair',          label: 'Sair',           Icon: LogOut  },
];

function NavItem({ to, label, Icon, end = false, onClick }) {
  return (
    <NavLink
      to={to}
      end={end}
      onClick={onClick}
      className={({ isActive }) =>
        `${styles.navItem}${isActive ? ` ${styles.active}` : ''}`
      }
    >
      <Icon className={styles.navIcon} size={18} strokeWidth={1.8} />
      <span>{label}</span>
    </NavLink>
  );
}

export function Sidebar({ isOpen, onClose }) {
  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      {/* Botão fechar do mobile */}
      <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu">
        <X size={20} />
      </button>

      {/* Logo */}
      <NavLink to="/" className={styles.logo} onClick={onClose}>
        <div className={styles.logoIcon}>
          <HeartPulse size={18} strokeWidth={2} />
        </div>
        <p className={styles.logoText}>Ampara</p>
      </NavLink>

      {/* Links principais */}
      <nav className={styles.nav}>
        {mainLinks.map(({ to, label, Icon }) => (
          <NavItem
            key={to}
            to={to}
            label={label}
            Icon={Icon}
            end={to === '/'}
            onClick={onClose}
          />
        ))}
      </nav>

      {/* Rodapé */}
      <footer className={styles.footer}>
        {footerLinks.map(({ to, label, Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
        ))}
      </footer>
    </aside>
  );
}

import { NavLink, useNavigate } from 'react-router-dom';
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
import { useAuth } from '../../../contexts/AuthContext';
import styles from './Sidebar.module.css';

const linksPaciente = [
  { to: '/', label: 'Início', Icon: Home },
  { to: '/cofre', label: 'Cofre', Icon: Lock },
  { to: '/medicamentos', label: 'Medicamentos', Icon: Pill },
];

const linksProfissional = [
  { to: '/', label: 'Início', Icon: Home },
  { to: '/profissional/prontuario', label: 'Prontuário', Icon: FileText },
];

const footerLinks = [
  { to: '/configuracoes', label: 'Configurações', Icon: Settings },
];

const API = import.meta.env.VITE_API_URL;

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
  const navigate = useNavigate();
  const { user, refresh } = useAuth();

  const mainLinks =
    user?.role === 'professional' ? linksProfissional : linksPaciente;

  async function handleLogout() {
    try {
      await fetch(`${API}/auth/logout`, {
        method: 'POST',
        credentials: 'include',
      });
    } catch {
      /* segue */
    }
    try {
      await refresh();
    } catch {
      /* segue para login mesmo se a rede falhar */
    }
    navigate('/login', { replace: true });
    onClose?.();
  }

  return (
    <aside className={`${styles.sidebar} ${isOpen ? styles.open : ''}`}>
      <button className={styles.closeButton} onClick={onClose} aria-label="Fechar menu" type="button">
        <X size={20} />
      </button>

      <NavLink to="/" className={styles.logo} onClick={onClose}>
        <div className={styles.logoIcon}>
          <HeartPulse size={18} strokeWidth={2} />
        </div>
        <p className={styles.logoText}>Ampara</p>
      </NavLink>

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

      <footer className={styles.footer}>
        {footerLinks.map(({ to, label, Icon }) => (
          <NavItem key={to} to={to} label={label} Icon={Icon} onClick={onClose} />
        ))}
        <button
          type="button"
          className={`${styles.navItem} ${styles.logoutButton}`}
          onClick={handleLogout}
        >
          <LogOut className={styles.navIcon} size={18} strokeWidth={1.8} />
          <span>Sair</span>
        </button>
      </footer>
    </aside>
  );
}

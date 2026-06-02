import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { Sidebar } from '../Sidebar/Sidebar';

import styles from './DashboardLayout.module.css';

export function DashboardLayout() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={styles.layout}>
      <button
        className={`${styles.hamburger} ${isOpen ? styles.hamburgerHidden : ''}`}
        onClick={() => setIsOpen(true)}
        aria-label="Abrir menu"
      >
        <Menu size={22} />
      </button>

      {isOpen && (
        <>
          <div
            className={styles.backdrop}
            onClick={() => setIsOpen(false)}
            aria-hidden="true"
          />
          <button
            className={styles.closeButton}
            onClick={() => setIsOpen(false)}
            aria-label="Fechar menu"
          >
            <X size={20} />
          </button>
        </>
      )}

      <Sidebar isOpen={isOpen} onClose={() => setIsOpen(false)} />

      <main className={styles.content}>
        <Outlet />
      </main>


    </div>
  );
}

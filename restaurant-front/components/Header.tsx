import React from 'react';
import Link from 'next/link';
import UserMenu from './UserMenu';
import styles from '../styles/Header.module.css';

const Header: React.FC = () => {
  return (
    <header className={styles.header}>
      <div className={styles.headerContent}>
        <Link href="/">
          <h1 className={styles.navLink}>Restauran</h1>
        </Link>        <nav className={styles.navbar}>
          <Link href="/about">
            <span className={styles.navLink}>Sobre</span>
          </Link>
          <Link href="/menu">
            <span className={styles.navLink}>Menu</span>
          </Link>
          <Link href="/contact">
            <span className={styles.navLink}>Contato</span>
          </Link>
          {/* Adicione mais links conforme necessário */}
        </nav>
        <div className={styles.accountOptions}>
          <UserMenu />
        </div>
      </div>
    </header>
  );
};






export default Header;

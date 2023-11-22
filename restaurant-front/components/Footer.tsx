// components/Footer.tsx
import React from 'react';
import Image from 'next/image';
import styles from '../styles/Footer.module.css';

const Footer: React.FC = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.footerContent}>
        <div className={styles.infoSection}>
          <h3>Restauran</h3>
          <p>Endereço: Rua Exemplo, 123 - Cidade</p>
          <p>Telefone: (12) 9 1234-5678</p>
          <p>Email: contato@restauran.com</p>
        </div>
        <div className={styles.socialSection}>
          <p>Siga-nos:</p>
          <div className={styles.socialIcons}>
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
              <Image src="/facebook.png" alt="" width={24} height={24} />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
              <Image src="/instagram.png" alt="" width={24} height={24} />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer">
              <Image src="/twitter.png" alt="" width={24} height={24} />
            </a>
            {/* Adicione mais ícones conforme necessário */}
          </div>
        </div>
      </div>
      <div className={styles.copyRight}>
        <p>© {new Date().getFullYear()} Restauran. Todos os direitos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;

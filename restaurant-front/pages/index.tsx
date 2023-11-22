// pages/index.tsx
import Layout from '../components/Layout';
import Link from 'next/link';
import styles from '../styles/Index.module.css';
import { useEffect, useState } from 'react';
import { isAuth } from '@/util/AuthProvider';

export default function HomePage() {
  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      // interceptador de verificação se esta logado
      const autorizado = await isAuth();
      setIsLogged(autorizado);
    };

    checkAuthStatus();
  }, []);


  if (!isLogged) {
    return (
      <></>
    )
  } else {
    return (
      <Layout>
        <div className={styles.banner}> {/* Banner Principal */}
          <h1>Bem-vindo ao Restauran</h1>
          <p>Descubra sabores inesquecíveis!</p>
        </div>
        <div className={styles.menuSection}>
          <h2>Destaques do Nosso Menu</h2>
          <div className={styles.menuItems}>
            <div className={styles.menuItem}>
              <img src="/risotto-cogumelos.webp" alt="Pasta Primavera" />
              <h3>Mushroom Risotto</h3>
              <p>Fresca e colorida, com legumes da estação.</p>
              <span>R$ 9.50</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/macarrao-carbonara.webp" alt="Pasta Primavera" />
              <h3>Spaghetti Carbonara</h3>
              <p>Fresca e colorida, com legumes da estação.</p>
              <span>R$ 10.50</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/lasanha.webp" alt="Pasta Primavera" />
              <h3>Lasagna</h3>
              <p>Fresca e colorida, com legumes da estação.</p>
              <span>R$ 12.00</span>
            </div>
            <div className={styles.menuItem}>
              <img src="/pizza-margherita.webp  " alt="Pasta Primavera" />
              <h3>Pizza Margherita</h3>
              <p>Fresca e colorida, com legumes da estação.</p>
              <span>R$ 8.99</span>
            </div>
          </div>
        </div>
        <div className={styles.promotionsSection}> {/* Promoções */}
          <h2>Promoções Especiais</h2>
          <div className={styles.promotionItems}>
            <div className={styles.promotionItem}>
              <img src="/noite-italiana.jpg" alt="Noite Italiana" />
              <h3>Noite Italiana</h3>
              <p>20% de desconto em todos os pratos italianos toda quarta-feira.</p>
              <span>Válido até: 31/12/2023</span>
            </div>
            <div className={styles.promotionItem}>
              <img src="/almoco-exec.jpeg" alt="Noite Italiana" />
              <h3>Almoço Executivo</h3>
              <p>Menu especial de almoço com preço fixo. Entrada, prato principal e sobremesa.</p>
              <span>Válido até: 31/01/2024</span>
            </div>
            <div className={styles.promotionItem}>
              <img src="/happy-hour.jpg" alt="Noite Italiana" />
              <h3>Happy Hour</h3>
              <p>Bebidas pela metade do preço das 17h às 19h, de segunda a sexta.</p>
              <span>Válido até: 30/06/2023</span>
            </div>
          </div>
        </div>
        <div className={styles.reservationsSection}> {/* Reservas */}
          <h2>Faça seu Pedido</h2>

          <Link href="/menu" passHref>
            <button className={styles.reservationButton}>Ir para o Menu</button>
          </Link>
        </div>

        <div className={styles.reviewsSection}> {/* Avaliações de Clientes */}
          <h2>Avaliações</h2>
          <div className={styles.reviewItem}>
            <img src="/user.png" alt="João Silva" className={styles.userImage} />
            <div className={styles.starRating}>★★★★☆</div>
            <p className={styles.userName}>João Silva</p>
            <p>"A melhor experiência gastronômica da cidade. Atendimento excepcional!"</p>
          </div>
          <div className={styles.reviewItem}>
            <img src="/user.png" alt="Ana Martins" className={styles.userImage} />
            <div className={styles.starRating}>★★★★★</div>
            <p className={styles.userName}>Ana Martins</p>
            <p>"Ambiente aconchegante e comida deliciosa. Altamente recomendado!"</p>
          </div>
          <div className={styles.reviewItem}>
            <img src="/user.png" alt="Carlos Gomes" className={styles.userImage} />
            <div className={styles.starRating}>★★★★☆</div>
            <p className={styles.userName}>Carlos Gomes</p>
            <p>"Excelente serviço e pratos saborosos. Voltarei com certeza!"</p>
          </div>
          <div className={styles.reviewItem}>
            <img src="/user.png" alt="Fernanda Lima" className={styles.userImage} />
            <div className={styles.starRating}>★★★★★</div>
            <p className={styles.userName}>Fernanda Lima</p>
            <p>"Ótima experiência! A melhor pizza que já comi."</p>
          </div>
        </div>
      </Layout>
    );
  }
};

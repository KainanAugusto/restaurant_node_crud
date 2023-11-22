// pages/about.tsx
import Layout from '../components/Layout';
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/About.module.css'; // Crie este arquivo CSS para estilos específicos da página
import { isAuth } from '@/util/AuthProvider';


export default function About() {


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
        <div className={styles.container}>
          <h1 className={styles.abouth1}>Sobre o Restauran</h1>
          <p className={styles.aboutp}>
            No coração da cidade, o Restauran emerge como um oásis de sabores refinados e experiências culinárias memoráveis. Desde a nossa inauguração, temos sido um destino para os amantes da boa gastronomia, oferecendo pratos que são verdadeiras obras de arte.
          </p>
          <p className={styles.aboutp}>
            Nosso cardápio, uma celebração da inovação e da tradição, é meticulosamente elaborado por chefs renomados. Cada prato é uma viagem sensorial, combinando sabores ousados e ingredientes de proveniência cuidadosamente selecionada. Desde entradas delicadas a pratos principais robustos, cada criação é uma homenagem à alta culinária.
          </p>
          <p className={styles.aboutp}>
            O Restauran não é apenas um restaurante, é um destino para quem busca uma experiência gastronômica excepcional. Nosso ambiente é acolhedor e elegantemente decorado, criando o cenário perfeito para jantares românticos, reuniões de negócios e celebrações especiais.
          </p>
          <p className={styles.aboutp}>
            Convidamos você a desfrutar de uma jornada culinária inesquecível no Restauran. Seja para uma refeição especial ou um pedido online, estamos aqui para tornar cada momento uma celebração de sabor e sofisticação. Aguardamos sua visita!
          </p>

        <Link href="/">
          <span>Voltar para a página inicial</span>
        </Link>
      </div>
      </Layout >
    );
  };
};

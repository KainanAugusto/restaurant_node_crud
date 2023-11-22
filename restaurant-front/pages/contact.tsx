// pages/contact.tsx
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import styles from '../styles/Contact.module.css'; 
import { isAuth } from '@/util/AuthProvider';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');

  const [isLogged, setIsLogged] = useState(false)

  useEffect(() => {
    const checkAuthStatus = async () => {
      // interceptador de verificação se esta logado
      const autorizado = await isAuth();
      setIsLogged(autorizado);
    };

    checkAuthStatus();
  }, []);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    console.log('Enviando mensagem:', { name, email, message });

    setName('');
    setEmail('');
    setMessage('');
  };


  if (!isLogged) {
    return (
      <></>
    )
  } else {
    return (
      <div className={styles.container}>
        <h1>Contato</h1>
        <p>Tem alguma dúvida ou sugestão? Entre em contato conosco!</p>

        <form onSubmit={handleSubmit} className={styles.contactForm}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nome</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="message">Mensagem</label>
            <textarea
              id="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              required
            />
          </div>
          <button type="submit" className={styles.submitButton}>Enviar</button>
        </form>

        <div className={styles.contactInfo}>
          <p><strong>Endereço:</strong> Rua Exemplo, 123, Cidade, Estado</p>
          <p><strong>Telefone:</strong> (11) 1234-5678</p>
          <p><strong>E-mail:</strong> contato@restaurante.com</p>
        </div>

        <Link href="/">
          <span>Voltar para a página inicial</span>
        </Link>
      </div>
    );
  };
};
export default Contact;

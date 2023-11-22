// pages/register.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import styles from '../styles/Register.module.css';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError('');

    try {
      const response = await fetch('/api/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, phone, username, password }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Erro ao registrar');
      }

      // Após o registro bem-sucedido, redirecionar para a página de login
      router.push('/login');
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError('Ocorreu um erro durante o registro');
      }
    }
  }

  return (
    <div className={styles.registerContainer}>
      <h1>Criar uma nova conta</h1>
      {error && <div className={styles.error}>{error}</div>}
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <div className={styles.registerFormField}>
          <label htmlFor="name" className={styles.registerLabel}>Nome</label>
          <input
            type="text"
            id="name"
            name="name"
            className={styles.registerInput}
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div className={styles.registerFormField}>
          <label htmlFor="email" className={styles.registerLabel}>Email</label>
          <input
            type="email"
            id="email"
            name="email"
            className={styles.registerInput}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div className={styles.registerFormField}>
          <label htmlFor="phone" className={styles.registerLabel}>Telefone</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            className={styles.registerInput}
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
          />
        </div>
        <div className={styles.registerFormField}>
          <label htmlFor="username" className={styles.registerLabel}>Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.registerInput}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.registerFormField}>
          <label htmlFor="password" className={styles.registerLabel}>Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.registerInput}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div className={styles.registerFormField}>
          <button type="submit" className={styles.registerButton}>Registrar</button>
        </div>
      </form>
    </div>
  );
}

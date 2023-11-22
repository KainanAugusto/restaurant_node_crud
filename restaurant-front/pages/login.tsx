// pages/login.tsx
import { useState } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';
import styles from '../styles/Login.module.css';
import Cookies from "js-cookie";
import { api } from '@/service/api';
import { Alerts } from '@/util/AlertsContainers';

export default function Login() {
  const [username, setUsername] = useState('');
  const [pass, setPass] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await api.post('/auth/login', {
        username,
        pass
      })
      console.log('Resposta completa:', response.data);

      if (response.status === 200 && response.data.access_token) {

        const token = response.data.access_token;

        console.log('Este é o token recebido no front:', token);

        if (token) {
          const expirationHour = 5;
          const expirationDate = new Date();
          expirationDate.setDate(expirationDate.getDate() + 7);
          expirationDate.setHours(expirationHour, 0, 0, 0);
          Cookies.set("token", token, { expires: expirationDate });
          router.push('/');
        }

      }

    } catch (error: any) {
      setError(error.response?.data?.message || 'An error occurred');

      Alerts.errorDark(error.response.data.message);
      console.log(error)
    } finally {
      setIsLoading(false);
    }

  }

  return (
    <div className={styles.container}>
      <form className={styles.loginForm} onSubmit={handleSubmit}>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="username">Usuário</label>
          <input
            type="text"
            id="username"
            name="username"
            className={styles.input}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className={styles.formField}>
          <label className={styles.label} htmlFor="pass">Senha</label>
          <input
            type="password"
            id="password"
            name="password"
            className={styles.input}
            value={pass}
            onChange={(e) => setPass(e.target.value)}
            required
          />
        </div>
        {error && <p className={styles.error}>{error}</p>}
        <div className={styles.formField}>
          <button type="submit" className={styles.button} disabled={isLoading}>
            {isLoading ? 'Carregando...' : 'Entrar'}
          </button>
        </div>
        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.registerLink}>
          <p>Não tem uma conta?
            <Link href="/register">
              Registre-se
            </Link>
          </p>
        </div>

      </form>
    </div>
  );
}

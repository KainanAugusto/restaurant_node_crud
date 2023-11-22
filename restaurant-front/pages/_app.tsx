// pages/_app.tsx ou pages/_app.js
import { AuthProvider } from '../context/AuthContext';
import '@/styles/globals.css'
import { AlertsContainers } from '@/util/AlertsContainers';
import type { AppProps } from 'next/app'

function MyApp({ Component, pageProps }: AppProps) {
  return (
    
    <AuthProvider>
      <Component {...pageProps} />
      <AlertsContainers />
    </AuthProvider>
  );
}

export default MyApp;
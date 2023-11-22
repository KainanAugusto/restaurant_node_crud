// pages/api/login.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const backendUrl = process.env.BACKEND_URL;

    try {
      const response = await fetch(`${backendUrl}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao fazer login no back-end');
      }

      const data = await response.json();

      console.log('Resposta do servidor:', data); // Imprime a resposta do servidor no console

      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

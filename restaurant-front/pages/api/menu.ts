// pages/api/menu.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'GET') {
    const backendUrl = process.env.BACKEND_URL; // Substitua pelo URL do seu backend

    try {
      const response = await fetch(`${backendUrl}/menu`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          // Adicione quaisquer cabeçalhos de autenticação necessários aqui, se aplicável
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao buscar o menu no back-end');
      }

      const menuItems = await response.json();

      console.log('Itens do Menu:', menuItems); 

      res.status(200).json(menuItems);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['GET']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

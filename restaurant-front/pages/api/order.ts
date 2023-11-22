// pages/api/order.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    const backendUrl = process.env.BACKEND_URL; // Substitua pelo URL do seu backend

    try {
      const orderDetails = req.body; // Obtenha os detalhes do pedido do corpo da requisição

      const response = await fetch(`${backendUrl}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Adicione quaisquer cabeçalhos de autenticação necessários aqui, se aplicável
        },
        body: JSON.stringify(orderDetails),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Falha ao enviar o pedido para o back-end');
      }

      const orderResponse = await response.json();

      console.log('Resposta do Pedido:', orderResponse); 

      res.status(200).json(orderResponse);
    } catch (error) {
      res.status(500).json({ message: 'Erro interno do servidor' });
    }
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}

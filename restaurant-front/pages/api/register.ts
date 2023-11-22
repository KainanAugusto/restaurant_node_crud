// pages/api/register.ts
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    if (req.method === 'POST') {
        const backendUrl = process.env.BACKEND_URL;

        try {
            const response = await fetch(`${backendUrl}/customers`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(req.body),
            });

            if (!response.ok) {
                throw new Error('Falha ao criar usuário');
            }

            const data = await response.json();
            res.status(200).json(data);
        } catch (error) {
            res.status(500).json({ message: (error as Error).message });
        }
    } else {
        res.setHeader('Allow', ['POST']);
        res.status(405).end(`Method ${req.method} Not Allowed`);
    }
}

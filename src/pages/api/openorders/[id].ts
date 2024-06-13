import { db } from 'src/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponseType, OpenOrderType } from 'src/types/api/openOrders'

export default async function handler(req: NextApiRequest, res: NextApiResponse<OpenOrderType[] | ErrorResponseType>) {
  const { id } = req.query

  if (req.method === 'GET') {
    try {
      const openOrders = await db.openOrders.findMany({
        where: {
          order_id: id
        }
      })

      if (!openOrders) {
        return res.status(404).json({ error: 'Ordem não encontrada!' })
      }

      res.status(200).json(openOrders)
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar os dados' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}

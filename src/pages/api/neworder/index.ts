import { db } from 'src/lib/prisma'
import type { NextApiRequest, NextApiResponse } from 'next'
import { ErrorResponseType, OpenOrderType } from 'src/types/api/openOrders'

export default async function handler(req: NextApiRequest, res: NextApiResponse<OpenOrderType[] | ErrorResponseType>) {
  if (req.method === 'POST') {
    try {
      console.log('Create Post Request')
    } catch (error) {
      res.status(500).json({ error: 'Erro ao buscar os dados' })
    }
  } else {
    res.status(405).json({ error: 'Método não permitido' })
  }
}



// const currentDateISO = new Date().toISOString()
// const openOrders = await db.openOrders.create({
//   data: {
//     order_id: '12345678',
//     title: 'TESTE ORDEM ABERTA',
//     classification: 'ABERTA',
//     location: 'LOCAL 01',
//     type_order: 'MELHORIA',
//     equipament: 'EQUIPAMENTO 01',
//     creation: currentDateISO,
//     start_prog: '',
//     end_prog: '',
//     responsible: 'MATHEUS LIMA BATISTA DOS SANTOS',
//     conditions: 'ENERGIZADO',
//     priority: 'NORMAL',
//     status: 'ABERTA'
//   }
// })

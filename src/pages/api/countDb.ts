// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

// type Data = {
//     message: string;
// };

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    // const outgoingId = req.body.itemId;
    // const warehouseId = req.body.warehouseId;
    if (req.method === 'GET') {
        const data = await prisma.item_table.aggregate({
            _count: {
                _all: true,
            },
        });

        console.log(data);
        res.send({ message: data });
    }
}

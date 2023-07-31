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
        await prisma.warehouse_table.updateMany({
            where: {
                warehouse_quantity: {
                    lte: 5,
                },
            },
            data: {
                status: 'Need Restock',
            },
        });
        await prisma.warehouse_table.updateMany({
            where: {
                warehouse_quantity: {
                    equals: 0,
                },
            },
            data: {
                status: 'Empty',
            },
        });
        res.send({ message: 'done!' });
    }
}

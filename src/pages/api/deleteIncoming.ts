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
    const itemId = req.body.itemId;
    const warehouseId = req.body.warehouseId;
    if (req.method === 'POST') {
        await prisma.incoming_item_table.delete({
            where: {
                incoming_item_id: itemId,
            },
        });

        await prisma.warehouse_table.delete({
            where: {
                warehouse_id: warehouseId,
            },
        });

        await res.revalidate('/');
        return res.json({ revalidated: true });
    }
}

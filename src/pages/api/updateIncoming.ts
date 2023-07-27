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
    const quantity = req.body.quantity;
    const warehouseId = req.body.warehouseId;
    if (req.method === 'POST') {
        await prisma.incoming_item_table.update({
            where: {
                incoming_item_id: itemId,
            },
            data: {
                incoming_item_quantity: quantity,
            },
        });

        await prisma.warehouse_table.update({
            where: {
                warehouse_id: warehouseId,
            },
            data: {
                warehouse_quantity: quantity,
            },
        });

        await res.revalidate('/');
        return res.json({ revalidated: true });
    } else {
        const search = await prisma.item_table.findFirst({
            where: {
                item_id: 11,
            },
        });
        res.json({ search });
    }
}

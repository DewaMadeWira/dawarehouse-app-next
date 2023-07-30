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
    const outgoingId = req.body.itemId;
    const warehouseId = req.body.warehouseId;
    if (req.method === 'POST') {
        const outgoingItem = await prisma.outgoing_item_table.findUnique({
            where: {
                outgoing_item_id: outgoingId,
            },
        });

        await prisma.warehouse_table.update({
            where: {
                warehouse_id: +warehouseId,
            },
            data: {
                warehouse_quantity: {
                    increment: outgoingItem?.outgoing_item_quantity,
                },
            },
        });

        await prisma.outgoing_item_table.delete({
            where: {
                outgoing_item_id: outgoingId,
            },
        });

        await res.revalidate('/');
        return res.json({ revalidated: true });
    }
}

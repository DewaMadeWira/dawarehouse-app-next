// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

import { revalidatePath } from 'next/cache';

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

        const outgoingTable = await prisma.outgoing_item_table.findMany({
            where: {
                warehouse_id: warehouseId,
            },
        });

        if (outgoingTable != null) {
            await prisma.outgoing_item_table.deleteMany({
                where: {
                    warehouse_id: warehouseId,
                },
            });
        }
        await prisma.warehouse_table.delete({
            where: {
                warehouse_id: warehouseId,
            },
        });
        // res.revalidate('/incoming');
        // revalidatePath('/incoming');
        return res.json({ revalidated: true });
    }
}

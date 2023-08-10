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
    const quantity = parseInt(req.body.quantity);

    if (req.method === 'POST') {
        const data = await prisma.incoming_item_table.update({
            where: {
                incoming_item_id: itemId,
            },
            data: {
                incoming_item_quantity: quantity,
            },
        });

        await prisma.warehouse_table.update({
            where: {
                warehouse_id: data.warehouse_id,
            },
            data: {
                warehouse_quantity: quantity,
            },
        });

        await res.revalidate('/incoming');
        return res.json({ revalidated: true });
    }
}

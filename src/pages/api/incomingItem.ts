// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const quantity = req.body.quantity;
        const itemId = req.body.item;
        // res.redirect(302, `${quantity}`);

            await prisma.warehouse_table.create({
                data: {
                    warehouse_quantity: +quantity,
                    item_id: +itemId,
                },
            });
            const recentWarehouse = await prisma.warehouse_table.findFirstOrThrow({
                orderBy: {
                    item_id: 'desc',
                },
            });

            await prisma.incoming_item_table.create({
                data: {
                    warehouse_id: recentWarehouse?.warehouse_id,
                    incoming_item_quantity: +recentWarehouse?.warehouse_quantity,
                },
            });

            await res.revalidate('/');
            return res.json({ revalidated: true });
    }
}

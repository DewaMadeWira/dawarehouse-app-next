// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const quantity = parseInt(req.body.quantity);
        const itemId = parseInt(req.body.item);

        const warehouse = await prisma.warehouse_table.create({
            data: {
                warehouse_quantity: quantity,
                item_id: itemId,
            },
        });

        // const recentWarehouse = await prisma.warehouse_table.findFirst({
        //     orderBy: {
        //         item_id: 'desc',
        //     },
        // });

        await prisma.incoming_item_table.create({
            data: {
                warehouse_id: warehouse.warehouse_id,
                incoming_item_quantity: +warehouse.warehouse_quantity,
            },
        });

        // await res.revalidate('/incoming');
        // res.redirect("/")
        return res.json({ revalidated: true });
    }
}

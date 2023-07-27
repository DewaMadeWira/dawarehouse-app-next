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

        await prisma.warehouse_table.update({
            where: {
                // from select warehouse
                warehouse_id: +itemId,
            },
            data: {
                warehouse_quantity: {
                    decrement: +quantity,
                },
            },
        });
        // const recentItem = await prisma.warehouse_table.findUnique({
        //     where: {
        //         warehouse_id: +itemId,
        //     },
        // });

        await prisma.outgoing_item_table.create({
            data: {
                warehouse_id: +itemId,
                outgoing_item_quantity: +quantity,
            },
        });

        await res.revalidate('/');
        return res.json({ revalidated: true });
    }
}

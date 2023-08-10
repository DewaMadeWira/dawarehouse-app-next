// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '../../../db/client';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse
) {
    if (req.method === 'POST') {
        const quantity = parseInt(req.body.quantity);
        const itemId = parseInt(req.body.itemId);

        try {
            const warehouse = await prisma.warehouse_table.update({
                where: {
                    warehouse_id: itemId,
                    warehouse_quantity: {
                        gte: quantity,
                    },
                },
                data: {
                    warehouse_quantity: {
                        decrement: quantity,
                    },
                },
            });
        } catch {
            console.log('Quantity insufficient');
            return res.status(400).json({ message: 'Quantity insufficient' });
            // return res.json({ message: 'Quantity insufficient' });
        }

        // const recentItem = await prisma.warehouse_table.findUnique({
        //     where: {
        //         warehouse_id: +itemId,
        //     },
        // });

        await prisma.outgoing_item_table.create({
            data: {
                warehouse_id: itemId,
                outgoing_item_quantity: quantity,
            },
        });

        await res.revalidate('/outgoing');
        return res.status(200).json({ revalidated: true });
    }
}

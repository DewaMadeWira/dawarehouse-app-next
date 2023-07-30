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
    const quantityUpdate = req.body.quantityUpdate;
    if (req.method === 'POST') {
        const outgoingItem = await prisma.outgoing_item_table.findUnique({
            where: {
                outgoing_item_id: outgoingId,
            },
        });

        if (outgoingItem?.outgoing_item_quantity == undefined) {
            return;
        }

        if (quantityUpdate <= outgoingItem.outgoing_item_quantity) {
             let newQuantity = 0
            if (outgoingItem.outgoing_item_quantity >= quantityUpdate){
                   newQuantity =outgoingItem.outgoing_item_quantity - quantityUpdate;
            }
               

            await prisma.warehouse_table.update({
                where: {
                    warehouse_id: +warehouseId,
                },

                data: {
                    warehouse_quantity: +quantityUpdate,
                },
            });
            await prisma.outgoing_item_table.update({
                where: {
                    outgoing_item_id: outgoingId,
                },
                data: {
                    outgoing_item_quantity: +quantityUpdate,
                },
            });
        }

        await res.revalidate('/');
        return res.json({ revalidated: true });
    }
}

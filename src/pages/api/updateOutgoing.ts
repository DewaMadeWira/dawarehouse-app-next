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
    const outgoingId = parseInt(req.body.itemId);
    const quantityUpdate = parseInt(req.body.quantityUpdate);
    if (req.method === 'POST') {
        const outgoingItem = await prisma.outgoing_item_table.findFirst({
            where: {
                outgoing_item_id: outgoingId,
            },
            include: {
                warehouse_table: true,
            },
        });

        // const qty = outgoingItem?.warehouse_table.incoming_item_table.

        const incomingItem = await prisma.incoming_item_table.findFirst({
            where: {
                warehouse_id: outgoingItem?.warehouse_id,
            },
        });

        if (incomingItem?.incoming_item_quantity == null) {
            return res.status(400).json({ message: 'Item not Found' });
        }
        if (quantityUpdate <= incomingItem.incoming_item_quantity) {
            await prisma.outgoing_item_table.update({
                where: {
                    outgoing_item_id: outgoingId,
                },
                data: {
                    outgoing_item_quantity: quantityUpdate,
                },
            });

            let newQty = incomingItem.incoming_item_quantity - quantityUpdate;

            await prisma.warehouse_table.update({
                where: {
                    warehouse_id: outgoingItem?.warehouse_id,
                },
                data: {
                    warehouse_quantity: newQty,
                },
            });
        }
        else{
            return res.status(400).json({message:"Quantity Insufficient."})
        }

        // const qty = outgoingItem?.warehouse_table.incoming_item_table
        // if(outgoingItem?.outgoing_item_quantity<=outgoingItem?.warehouse_table.incoming_item_table.incoming_item_quantity)

        // const maxQty = outgoingItem.
        // if (outgoingItem?.outgoing_item_quantity == undefined) {
        //     return;
        // }

        // if (quantityUpdate <= outgoingItem.outgoing_item_quantity) {
        //      let newQuantity = 0
        //     if (outgoingItem.outgoing_item_quantity >= quantityUpdate){
        //            newQuantity =outgoingItem.outgoing_item_quantity - quantityUpdate;
        //     }

        //     await prisma.warehouse_table.update({
        //         where: {
        //             warehouse_id: +warehouseId,
        //         },

        //         data: {
        //             warehouse_quantity: +quantityUpdate,
        //         },
        //     });
        //     await prisma.outgoing_item_table.update({
        //         where: {
        //             outgoing_item_id: outgoingId,
        //         },
        //         data: {
        //             outgoing_item_quantity: +quantityUpdate,
        //         },
        //     });
        // }

        await res.revalidate('/outgoing');
        return res.json({ revalidated: true });
    }
}

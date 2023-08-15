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
    const id = parseInt(req.body.id);
    const name = req.body.name;
    const category = req.body.category;
    const price = parseFloat(req.body.price);
    if (req.method === 'POST') {
        try {
            const item = await prisma.item_table.update({
                where: {
                    item_id: id,
                },
                data: {
                    item_name: name,
                    item_category: category,
                    item_price: price,
                },
            });
        } catch (error) {
            console.log(error);
            res.status(400);
        }

        // console.log(data);
        // res.send({ message: data });
    }
    // await res.revalidate('/item');
    return res.json({ revalidated: true });
}

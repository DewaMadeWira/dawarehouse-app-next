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
    const id = req.body.id;
    // const category = req.body.category;
    // const price = parseFloat(req.body.price);
    if (req.method === 'POST') {
        try {
            //             SET foreign_key_checks = 0;
            // DELETE FROM item_table WHERE item_id=35;
            // SET foreign_key_checks = 1;
            await prisma.$queryRaw`SET foreign_key_checks = 0`;
            await prisma.$queryRaw`DELETE FROM item_table WHERE item_id=${id}`;
            await prisma.$queryRaw`SET foreign_key_checks = 1`;
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

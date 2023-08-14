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
    const token = req.body.token;

    if (req.method === 'POST') {
        if (token !== process.env.RESET_TOKEN) {
            return res.status(400).json({ message: 'wrong token' });
        }

        // Disable Foreign Key Check
        // await prisma.$queryRaw`set session_replication_role to replica;`;
        // await prisma.$queryRaw`ALTER TABLE warehouse_table DISABLE TRIGGER ALL;`;
        // await prisma.$queryRaw`ALTER TABLE outgoing_table DISABLE TRIGGER ALL;`;
        // await prisma.$queryRaw`ALTER TABLE incoming_table DISABLE TRIGGER ALL;`;
        // await prisma.$queryRaw`ALTER TABLE item_table DISABLE TRIGGER ALL;`;

        // Delete Table
        // await prisma.$queryRaw`TRUNCATE TABLE incoming_item_table CASCADE`;
        // await prisma.$queryRaw`TRUNCATE TABLE outgoing_item_table CASCADE`;

        // await prisma.$queryRaw`TRUNCATE TABLE warehouse_table CASCADE`;

        await prisma.$queryRaw`TRUNCATE TABLE item_table CASCADE`;

        await prisma.$queryRaw`ALTER SEQUENCE item_table_item_id_seq RESTART WITH 1`;
        await prisma.$queryRaw`ALTER SEQUENCE incoming_item_table_incoming_item_id_seq RESTART WITH 1`;
        await prisma.$queryRaw`ALTER SEQUENCE outgoing_item_table_outgoing_item_id_seq RESTART WITH 1`;
        await prisma.$queryRaw`ALTER SEQUENCE warehouse_table_warehouse_id_seq RESTART WITH 1`;

        await prisma.$queryRaw`INSERT INTO item_table ( item_name, item_category, item_price) VALUES
        ( 'NVIDIA GeForce RTX 3080', 'Graphics Card', 11200000),
        ( 'AMD Ryzen 9 5900X', 'CPU', 7686000),
        ( 'Corsair Vengeance LPX 16GB DDR4', 'RAM', 1819000),
        ( 'Samsung 970 EVO 1TB NVMe SSD', 'SSD', 2519000),
        ( 'Logitech G Pro Wireless', 'Gaming Gear', 2099000),
        ( 'SteelSeries Apex Pro', 'Mechanical Keyboard', 2799000),
        ( 'HyperX Cloud Alpha S', 'Gaming Gear', 1819000),
        ( 'ASUS ROG Swift PG279Q', 'Gaming Gear', 8399000),
        ( 'MSI GeForce RTX 3070', 'Graphics Card', 8399000),
        ( 'Intel Core i7-11700K', 'CPU', 4886000),
        ( 'G.Skill Trident Z RGB 32GB DDR4', 'RAM', 3499000),
        ( 'Western Digital WD Black 2TB NVMe SSD', 'SSD', 3499000),
        ( 'Razer DeathAdder V2', 'Gaming Gear', 979000),
        ( 'Ducky One 2 Mini', 'Mechanical Keyboard', 1679000),
        ( 'HyperX Cloud II', 'Gaming Gear', 1399000),
        ( 'Acer Predator XB273K', 'Gaming Gear', 9799000);`;

        // Add Operation

        await prisma.$queryRaw`INSERT INTO warehouse_table ( warehouse_quantity, item_id, status) VALUES
        ( 70, 1, 'In-stock'),
        ( 15, 3, 'In-stock'),
        ( 0, 4, 'Empty'),
        ( 5, 5, 'Need Restock'),
        ( 25, 4, 'In-stock');`;

        await prisma.$queryRaw`INSERT INTO incoming_item_table ( warehouse_id, incoming_item_quantity, incoming_item_date) VALUES
        ( 1, 90, '2023-08-13 02:01:04.583'),
        ( 2, 15, '2023-08-13 02:01:23.383'),
        ( 3, 4, '2023-08-13 02:01:42.871'),
        ( 4, 20, '2023-08-13 02:01:59.643'),
        ( 5, 25, '2023-08-13 02:03:31.833');`;

        await prisma.$queryRaw`INSERT INTO outgoing_item_table ( warehouse_id, outgoing_item_quantity, outgoing_item_date) VALUES
        ( 4, 15, '2023-08-13 02:02:24.112'),
        ( 3, 4, '2023-08-13 02:02:48.890'),
        ( 1, 20, '2023-08-13 02:03:12.469');`;
    }
    return res.json({ message: 'Reset success' });
    // await res.revalidate('/item');
    // return res.json({ revalidated: true });
}

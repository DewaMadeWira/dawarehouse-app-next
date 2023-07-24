import Image from 'next/image';
import { Inter } from 'next/font/google';
import { prisma } from '../../db/client';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Input } from '@/components/ui/input';

import { Button } from '@/components/ui/button';
import { useState } from 'react';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

type Item = {
    item_id: string;
    item: number;
};

async function getItem() {
    const items = await prisma.item_table.findMany();
    return items;
}
async function getIncoming() {
    const incomingItems = await prisma.incoming_item_table.findMany();
    return incomingItems;
}
async function getWarehouse() {
    const warehouseItems = await prisma.warehouse_table.findMany();
    return warehouseItems;
}

// async function incomingItem(itemId: string, quantity: string) {
//     await prisma.warehouse_table.create({
//         data: {
//             warehouse_quantity: +quantity,
//             item_id: +itemId,
//         },
//     });

//     const recentWarehouse = await prisma.warehouse_table.findFirstOrThrow({
//         orderBy: {
//             item_id: 'desc',
//         },
//     });

//     await prisma.incoming_item_table.create({
//         data: {
//             warehouse_id: recentWarehouse?.warehouse_id,
//             incoming_item_quantity: +recentWarehouse?.warehouse_quantity,
//             incoming_item_date: Date.now().toString(),
//         },
//     });
// }

export const getStaticProps: GetStaticProps<{
    items: Prisma.PromiseReturnType<typeof getItem>;
    incomingItems: Prisma.PromiseReturnType<typeof getIncoming>;
    warehouseItems: Prisma.PromiseReturnType<typeof getWarehouse>;
}> = async () => {



    
    const items = await getItem();
    const incomingItems = await getIncoming();
    const warehouseItems = await getWarehouse();
    return {
        props: {
            items,
            incomingItems,
            warehouseItems,
        },
    };
};

// const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
//     props: InferGetStaticPropsType<typeof getStaticProps>
// ) => {
//     return (
//         <div>
//             {props.items.map((prop) => (
//                 <p key={prop.item_id}>{prop.item_name}</p>
//             ))}
//         </div>
//     );
// };

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    // const [inputState, setInputState] = useState('');

    return (
        <main className='h-screen bg-bgBlack flex items-center flex-col justify-around'>
            <div className=' h-fit p-5 w-fit text-lg mt-5 bg-cardBlack border-bluePrimary border-2 rounded-lg'>
                <h3 className='text-center font-outfit font-bold text-white '>
                    Items Table
                </h3>
                <Table className='text-white font-outfit'>
                    <TableCaption>A list of all items.</TableCaption>
                    <TableHeader>
                        <TableRow className='text-gray hover:bg-cardBlack'>
                            <TableHead className=''>ID</TableHead>
                            <TableHead className=''>Item Name</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {props.items.map((prop) => (
                            <TableRow key={prop.item_id}>
                                <TableCell className=''>
                                    {prop.item_id}
                                </TableCell>
                                <TableCell key={prop.item_id} className=''>
                                    {prop.item_name}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            <div className='flex justify-around w-full'>
                {/* Incoming Item */}
                <div>
                    <div className=' h-fit p-5 w-fit text-lg mt-5 bg-cardBlack border-bluePrimary border-2 rounded-lg'>
                        <h3 className='text-center font-outfit font-bold text-white '>
                            Incoming Items
                        </h3>
                        <Table className='text-white font-outfit'>
                            <TableCaption>
                                A list of all{' '}
                                <span className='font-bold'>Incoming</span>{' '}
                                items.
                            </TableCaption>
                            <TableHeader>
                                <TableRow className='text-gray hover:bg-cardBlack'>
                                    <TableHead className=''>ID</TableHead>
                                    <TableHead className=''>
                                        Warehouse ID
                                    </TableHead>
                                    <TableHead className=''>Quantity</TableHead>
                                    <TableHead className=''>Date</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {props.incomingItems.map((prop) => (
                                    <TableRow key={prop.incoming_item_id}>
                                        <TableCell className=''>
                                            {prop.incoming_item_id}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.warehouse_id}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.incoming_item_quantity}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.incoming_item_date.toDateString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className='mt-12'>
                        <div className='flex justify-between'>
                            <Input
                                className='bg-cardBlack '
                                placeholder='Add incoming item'
                                // onChange={(e) => setInputState(e.target.value)}
                                type='number'
                            />
                            <Select>
                                <SelectTrigger className='w-[180px]'>
                                    <SelectValue placeholder='Theme' />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value='light'>Light</SelectItem>
                                    <SelectItem value='dark'>Dark</SelectItem>
                                    <SelectItem value='system'>
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <Button className='text-white bg-bluePrimary font-outfit mt-10 hover:-translate-y-2 shadow-lg transition-all'>
                            Add Item
                        </Button>
                    </div>
                </div>
                {/* Warehouse Item */}
                <div className=' h-fit p-5 w-fit text-lg mt-5 bg-cardBlack border-bluePrimary border-2 rounded-lg'>
                    <h3 className='text-center font-outfit font-bold text-white '>
                        Warehouse Items
                    </h3>
                    <Table className='text-white font-outfit'>
                        <TableCaption>
                            A list of all{' '}
                            <span className='font-bold'>Warehouse</span> items.
                        </TableCaption>
                        <TableHeader>
                            <TableRow className='text-gray hover:bg-cardBlack'>
                                <TableHead className=''>ID</TableHead>
                                <TableHead className=''>Quantity</TableHead>
                                <TableHead className=''>Item ID</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {props.warehouseItems.map((prop) => (
                                <TableRow key={prop.warehouse_id}>
                                    <TableCell className=''>
                                        {prop.warehouse_id}
                                    </TableCell>
                                    <TableCell className=''>
                                        {prop.warehouse_quantity}
                                    </TableCell>
                                    <TableCell className=''>
                                        {prop.item_id}
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </main>
    );
};

export default Home;

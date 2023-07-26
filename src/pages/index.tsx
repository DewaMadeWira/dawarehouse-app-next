import Image from 'next/image';
import { useRouter } from 'next/router';
import { Inter } from 'next/font/google';
import { prisma } from '../../db/client';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
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

import { useToast } from '@/components/ui/use-toast';

import { json } from 'stream/consumers';
import { revalidatePath } from 'next/cache';

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
            incomingItems: JSON.parse(JSON.stringify(incomingItems)),
            warehouseItems,
        },
        // revalidate: 1,
    };
};

import { Toaster } from '@/components/ui/toaster';

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const router = useRouter();

    const refreshData = () => {
        router.replace(router.asPath);
    };
    const [itemState, setItemState] = useState('');
    const [quantityState, setQuantityState] = useState('');
    const { toast } = useToast();
    function handleSubmit() {
        console.log('error!');
        toast({
            description: 'Quantity cannot be 0 or negative (-1) !',
            className: 'bg-yellow p-5 font-outfit border-none ',
        });
        if (quantityState == '') {
            console.log('quantitiy 0');
            // alert('clicked');
            // return;
        }
        // if (itemState == null) {
        //     // toast({
        //     //     description: 'Please select an item !',
        //     //     className: 'bg-yellow p-5 font-outfit border-none ',
        //     //     variant: 'destructive',
        //     // });
        //     return;
        // }

        // const res = await fetch('/api/incomingItem', {
        //     method: 'POST',
        //     headers: {
        //         'Content-Type': 'application/json',
        //     },
        //     body: JSON.stringify({
        //         item: itemState,
        //         quantity: quantityState,
        //     }),
        // });

        // if (res.json != null) {
        //     refreshData();
        // }
    }

    return (
        // <Toaster />
        <main className='min-h-screen bg-bgBlack flex items-center flex-col justify-around'>
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
                                            {prop.incoming_item_date?.toString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                    <div className='mt-12'>
                        <div className='flex justify-between w-full'>
                            <Input
                                name='quantity'
                                className='bg-cardBlack w-1/4'
                                placeholder='30'
                                onChange={(e) =>
                                    setQuantityState(e.target.value)
                                }
                                type='number'
                                required
                            />
                            <Select
                                name='item'
                                onValueChange={(e) => setItemState(e)}
                                required
                            >
                                <SelectTrigger className='w-[180px] text-white'>
                                    <SelectValue placeholder='Select Item' />
                                </SelectTrigger>
                                <SelectContent>
                                    {props.items.map((prop) => (
                                        <SelectItem
                                            key={prop.item_id.toString()}
                                            value={prop.item_id.toString()}
                                        >
                                            {prop.item_name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => handleSubmit()}
                            className='text-white bg-bluePrimary font-outfit mt-10 hover:-translate-y-2 shadow-lg transition-all'
                        >
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

import { useRouter } from 'next/router';
import { prisma } from '../../db/client';
import type { InferGetServerSidePropsType, GetServerSideProps } from 'next';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';

import { ScrollArea } from '@/components/ui/scroll-area';

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

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from '@/components/ui/dialog';

// import { json } from 'stream/consumers';
// import { revalidatePath } from 'next/cache';

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
async function getOutgoing() {
    const outgoingItems = await prisma.outgoing_item_table.findMany();
    return outgoingItems;
}

export const getStaticProps: GetStaticProps<{
    items: Prisma.PromiseReturnType<typeof getItem>;
    incomingItems: Prisma.PromiseReturnType<typeof getIncoming>;
    warehouseItems: Prisma.PromiseReturnType<typeof getWarehouse>;
    outgoingItems: Prisma.PromiseReturnType<typeof getOutgoing>;
}> = async () => {
    const items = await getItem();
    const incomingItems = await getIncoming();
    const warehouseItems = await getWarehouse();
    const outgoingItems = await getOutgoing();
    return {
        props: {
            items,
            incomingItems: JSON.parse(JSON.stringify(incomingItems)),
            warehouseItems: JSON.parse(JSON.stringify(warehouseItems)),
            outgoingItems: JSON.parse(JSON.stringify(outgoingItems)),
        },
        // revalidate: 1,
    };
};

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

    // Handle Add Data

    async function handleSubmit(isIncoming: boolean) {
        if (quantityState == '' || quantityState == '0') {
            console.log('quantity 0');
            //
            toast({
                description: 'Quantity cannot be 0 or negative (-1) !',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }
        if (itemState == '') {
            toast({
                description: 'Please select an item !',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }

        if (isIncoming) {
            const res = await fetch('/api/incomingItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: itemState,
                    quantity: quantityState,
                }),
            });

            if (res.json != null) {
                refreshData();
            }
        } else if (isIncoming == false) {
            const res = await fetch('/api/outgoingItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    item: itemState,
                    quantity: quantityState,
                }),
            });

            if (res.json != null) {
                refreshData();
            }
        }
    }

    // Handle Delete Data Incoming
    async function handleDeleteIncoming(itemId: number, warehouseId: number) {
        const res = await fetch('/api/deleteIncoming', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                warehouseId: warehouseId,
            }),
        });

        if (res.json != null) {
            refreshData();
        }
    }

    // Handle Update Data Incoming WIP
    async function handleUpdateIncoming(
        itemId: number,
        quantity: number,
        warehouseId: number
    ) {
        const res = await fetch('/api/deleteIncoming', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                warehouseId: warehouseId,
                quantity: quantity,
            }),
        });

        if (res.json != null) {
            refreshData();
        }
    }
    // Handle Update Data Outgoing
    async function handleUpdateOutgoing(itemId: number, warehouseId: number) {
        const res = await fetch('/api/updateOutgoing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                warehouseId: warehouseId,
                quantity: quantityState,
            }),
        });

        if (res.json != null) {
            refreshData();
        }
    }

    // Handle Delete Data Outgoing
    async function handleDeleteOutgoing(itemId: number, warehouseId: number) {
        const res = await fetch('/api/deleteOutgoing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                warehouseId: warehouseId,
            }),
        });

        if (res.json != null) {
            refreshData();
        }
    }

    return (
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
            <div className='flex justify-between w-full p-10'>
                {/* Incoming Item */}
                <div className='p-5'>
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
                                        <TableCell className=''>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <img
                                                        className='hover:-translate-y-1 transition-all '
                                                        width={20}
                                                        height={20}
                                                        src='edit_icon.png'
                                                        alt='edit icon'
                                                    />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit quantity
                                                            incoming item ID :{' '}
                                                            {
                                                                prop.incoming_item_id
                                                            }
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            This will also
                                                            effect the quantity
                                                            in{' '}
                                                            <span className='font-bold'>
                                                                Warehouse Table.
                                                            </span>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className='grid gap-4 py-4'>
                                                        <div className='grid grid-cols-4 items-center gap-4'>
                                                            <h5 className='text-right'>
                                                                Quantity :
                                                            </h5>
                                                            <Input
                                                                name='quantity'
                                                                className='bg-cardBlack '
                                                                placeholder='30'
                                                                onChange={(e) =>
                                                                    setQuantityState(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                type='number'
                                                                min={0}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button className='bg-bluePrimary'>
                                                            Save changes
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell className=''>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <img
                                                        className='hover:-translate-y-1 transition-all '
                                                        width={20}
                                                        height={20}
                                                        src='delete_icon.png'
                                                        alt='delete icon'
                                                    />
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className='font-outfit bg-cardBlack text-white'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className=''>
                                                            Are you sure to
                                                            delete an delete an{' '}
                                                            <span className='font-bold'>
                                                                Incoming Item
                                                            </span>{' '}
                                                            ?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will make the
                                                            item on the
                                                            warehouse{' '}
                                                            <span className='font-bold'>
                                                                deleted
                                                            </span>
                                                            . Action cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className='bg-bluePrimary'>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className='bg-red text-white'
                                                            onClick={() => {
                                                                handleDeleteIncoming(
                                                                    prop.incoming_item_id,
                                                                    prop.warehouse_id
                                                                );
                                                            }}
                                                        >
                                                            Delete Item
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                                min={0}
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
                                    <ScrollArea className='h-40'>
                                        {props.items.map((prop) => (
                                            <SelectItem
                                                key={prop.item_id.toString()}
                                                value={prop.item_id.toString()}
                                            >
                                                {prop.item_name}
                                            </SelectItem>
                                        ))}
                                    </ScrollArea>
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => handleSubmit(true)}
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
                {/* Outgoing Item */}
                <div className='p-5'>
                    <div className=' h-fit p-5 w-fit text-lg mt-5 bg-cardBlack border-bluePrimary border-2 rounded-lg'>
                        <h3 className='text-center font-outfit font-bold text-white '>
                            Outgoing Items
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
                                {props.outgoingItems.map((prop) => (
                                    <TableRow key={prop.outgoing_item_id}>
                                        <TableCell className=''>
                                            {prop.outgoing_item_id}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.warehouse_id}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.outgoing_item_quantity}
                                        </TableCell>
                                        <TableCell className=''>
                                            {prop.outgoing_item_date?.toString()}
                                        </TableCell>
                                        <TableCell className=''>
                                            <Dialog>
                                                <DialogTrigger>
                                                    <img
                                                        className='hover:-translate-y-1 transition-all '
                                                        width={20}
                                                        height={20}
                                                        src='edit_icon.png'
                                                        alt='edit icon'
                                                    />
                                                </DialogTrigger>
                                                <DialogContent>
                                                    <DialogHeader>
                                                        <DialogTitle>
                                                            Edit quantity
                                                            Outgoing item ID :{' '}
                                                            {
                                                                prop.outgoing_item_id
                                                            }
                                                        </DialogTitle>
                                                        <DialogDescription>
                                                            This will also
                                                            effect the quantity
                                                            in{' '}
                                                            <span className='font-bold'>
                                                                Warehouse Table.
                                                            </span>
                                                        </DialogDescription>
                                                    </DialogHeader>
                                                    <div className='grid gap-4 py-4'>
                                                        <div className='grid grid-cols-4 items-center gap-4'>
                                                            <h5 className='text-right'>
                                                                Quantity :
                                                            </h5>
                                                            <Input
                                                                name='quantity'
                                                                className='bg-cardBlack '
                                                                placeholder='30'
                                                                onChange={(e) =>
                                                                    setQuantityState(
                                                                        e.target
                                                                            .value
                                                                    )
                                                                }
                                                                type='number'
                                                                min={0}
                                                                required
                                                            />
                                                        </div>
                                                    </div>
                                                    <DialogFooter>
                                                        <Button
                                                            className='bg-bluePrimary'
                                                            onClick={() =>
                                                                handleUpdateOutgoing(
                                                                    prop.outgoing_item_id,
                                                                    prop.warehouse_id
                                                                )
                                                            }
                                                        >
                                                            Save changes
                                                        </Button>
                                                    </DialogFooter>
                                                </DialogContent>
                                            </Dialog>
                                        </TableCell>
                                        <TableCell className=''>
                                            <AlertDialog>
                                                <AlertDialogTrigger>
                                                    <img
                                                        className='hover:-translate-y-1 transition-all '
                                                        width={20}
                                                        height={20}
                                                        src='delete_icon.png'
                                                        alt='delete icon'
                                                    />
                                                </AlertDialogTrigger>
                                                <AlertDialogContent className='font-outfit bg-cardBlack text-white'>
                                                    <AlertDialogHeader>
                                                        <AlertDialogTitle className=''>
                                                            Are you sure to
                                                            delete an delete an{' '}
                                                            <span className='font-bold'>
                                                                Incoming Item
                                                            </span>{' '}
                                                            ?
                                                        </AlertDialogTitle>
                                                        <AlertDialogDescription>
                                                            This will make the
                                                            item on the
                                                            warehouse{' '}
                                                            <span className='font-bold'>
                                                                deleted
                                                            </span>
                                                            . Action cannot be
                                                            undone.
                                                        </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                        <AlertDialogCancel className='bg-bluePrimary'>
                                                            Cancel
                                                        </AlertDialogCancel>
                                                        <AlertDialogAction
                                                            className='bg-red text-white'
                                                            onClick={() => {
                                                                handleDeleteOutgoing(
                                                                    prop.outgoing_item_id,
                                                                    prop.warehouse_id
                                                                );
                                                            }}
                                                        >
                                                            Delete Item
                                                        </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
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
                                min={0}
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
                                    {props.warehouseItems.map((prop) => (
                                        <SelectItem
                                            key={prop.warehouse_id.toString()}
                                            value={prop.warehouse_id.toString()}
                                        >
                                            {prop.warehouse_id}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <Button
                            onClick={() => handleSubmit(false)}
                            className='text-white bg-bluePrimary font-outfit mt-10 hover:-translate-y-2 shadow-lg transition-all'
                        >
                            Add Item
                        </Button>
                    </div>
                </div>
            </div>
        </main>
    );
};

export default Home;

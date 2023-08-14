import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { useEffect, useState } from 'react';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '../../db/client';

import { motion } from 'framer-motion';

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

import { ScrollArea } from '@/components/ui/scroll-area';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SidebarDesktop from '@/components/SidebarDesktop';

import TotalBar from '@/components/TotalBar';
import SelectComponent from '@/components/SelectComponent';

import { useToast } from '@/components/ui/use-toast';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CardWarehouse from '@/components/CardWarehouse';
import Head from 'next/head';

async function getOutgoingItems() {
    const incomingItems = await prisma.outgoing_item_table.findMany({
        include: {
            warehouse_table: {
                include: {
                    item_table: true,
                },
            },
        },
    });
    return incomingItems;
}
async function getWarehouse() {
    const warehouse = await prisma.warehouse_table.findMany({
        include: {
            item_table: true,
        },
    });
    return warehouse;
}

async function getAllItem() {
    const items = await prisma.item_table.findMany();
    return items;
}

async function getWarehouseSum() {
    const data = await prisma.warehouse_table.aggregate({
        _sum: {
            warehouse_quantity: true,
        },
    });
    return data;
}
async function getIncomingSum() {
    const data = await prisma.incoming_item_table.aggregate({
        _sum: {
            incoming_item_quantity: true,
        },
    });
    return data;
}
async function getOutgoingSum() {
    const data = await prisma.outgoing_item_table.aggregate({
        _sum: {
            outgoing_item_quantity: true,
        },
    });
    return data;
}
async function getItem() {
    const data = await prisma.item_table.aggregate({
        _count: {
            _all: true,
        },
    });
    return data;
}

export const getStaticProps: GetStaticProps<{
    outgoingItems: Prisma.PromiseReturnType<typeof getOutgoingItems>;
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
    items: Prisma.PromiseReturnType<typeof getAllItem>;
    warehouse: Prisma.PromiseReturnType<typeof getWarehouse>;
}> = async () => {
    const outgoingItems = await getOutgoingItems();
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();
    const items = await getAllItem();
    const warehouse = await getWarehouse();

    return {
        props: {
            outgoingItems: JSON.parse(JSON.stringify(outgoingItems)),
            totalWarehouse,
            incomingSum,
            outgoingItem,
            allItem,
            items,
            warehouse,
        },
        // revalidate: 1,
    };
};

interface StatusType {
    inStock: boolean;
    needRestock: boolean;
    empty: boolean;
}

const Outgoing: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const router = useRouter();

    const { toast } = useToast();

    const refreshData = () => {
        router.replace(router.asPath);
    };

    const [windowWidth, setWindowWidth] = useState<number>(700);

    const [data, setData] =
        useState<Prisma.PromiseReturnType<typeof getOutgoingItems>>();

    const [itemState, setItemState] = useState('');
    const [quantityState, setQuantityState] = useState('');

    const [sortSelect, setSortSelect] = useState('ascending');

    const [statusCheckbox, setStatusCheckbox] = useState<StatusType>({
        empty: true,
        inStock: true,
        needRestock: true,
    });

    useEffect(() => {
        function handleResize() {
            // Set window width/height to state
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setData(props.outgoingItems);
    });

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
            // alert('refresh called');
            // setData((current) =>
            //     current?.filter((prop) => {
            //         return (
            //             prop.warehouse_id != warehouseId &&
            //             prop.incoming_item_id != itemId
            //         );
            //     })
            // );
            refreshData();
        }
    }

    async function handleSubmit() {
        if (quantityState == '' || quantityState == '0') {
            // console.log('quantity 0');
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
        // alert(quantityState + ' ' + itemState);

        const res = await fetch('/api/outgoingItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemState,
                quantity: quantityState,
            }),
        });

        if (res.status == 400) {
            toast({
                description: 'Quantity Insufficient !',
                className: 'bg-red p-5 font-outfit border-none ',
            });
            return;
        }

        if (res.status == 200) {
            setQuantityState('');
            refreshData();
            setData(props.outgoingItems);
        }
    }

    async function handleEdit(itemId: number) {
        if (quantityState == '' || quantityState == '0') {
            // console.log('quantity 0');
            //
            toast({
                description: 'Quantity cannot be 0 or negative (-1) !',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }

        const res = await fetch('/api/updateOutgoing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                quantityUpdate: quantityState,
            }),
        });
        if (res.status == 400) {
            toast({
                description: 'Quantity Insufficient !',
                className: 'bg-red p-5 font-outfit border-none ',
            });
            return;
        }

        if (res.json != null) {
            setQuantityState('');
            refreshData();
            setData(props.outgoingItems);
        }
    }

    return (
        <main className='min-h-screen bg-bgBlack text-white font-outfit'>
            <Head>
                <title>DaWarehouse | Outgoing</title>
                <link rel='icon' type='image/x-icon' href='/logo.png'></link>
            </Head>
            {windowWidth >= 700 ? (
                <div>
                    <Navbar isWarehouse={true}></Navbar>
                    <div className='flex justify-between pr-6'>
                        <SidebarDesktop></SidebarDesktop>
                        {/* Main Screen */}
                        <div className='w-4/5 flex flex-col px-10'>
                            {/* Total Container */}
                            <TotalBar
                                warehouseSum={
                                    props.totalWarehouse._sum.warehouse_quantity
                                }
                                incomingSum={
                                    props.incomingSum._sum
                                        .incoming_item_quantity
                                }
                                outgoingItem={
                                    props.outgoingItem._sum
                                        .outgoing_item_quantity
                                }
                                allItem={props.allItem._count._all}
                            ></TotalBar>
                            {/* Select Container */}
                            <div className='flex gap-5 mt-10 justify-end pr-10'>
                                <SelectComponent
                                    data={data}
                                    setData={setData}
                                    setSortSelect={setSortSelect}
                                    dataType='outgoing'
                                />
                                {/* <StatusCheckBox
                                    statusCheckbox={statusCheckbox}
                                    setStatusCheckbox={setStatusCheckbox}
                                /> */}
                            </div>
                            {/* Incoming Item */}
                            <Tabs defaultValue='account' className='w-full'>
                                <TabsList className='ml-6'>
                                    <TabsTrigger value='account' className=''>
                                        Outgoing Item
                                    </TabsTrigger>
                                    <TabsTrigger value='password' className=''>
                                        Add Outgoing Item
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='account'>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -100,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className='px-6'
                                    >
                                        <div className=' h-fit p-5 text-lg mt-5 bg-cardBlack w-full  rounded-lg'>
                                            <Table className='text-white font-outfit'>
                                                <TableCaption>
                                                    {/* A list of all{' '}
                                            <span className='font-bold'>
                                                Warehouse
                                            </span>{' '}
                                            items. */}
                                                </TableCaption>
                                                <TableHeader>
                                                    <TableRow className='text-gray hover:bg-cardBlack'>
                                                        <TableHead className=''>
                                                            Outgoing ID
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Item Name
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Warehouse ID
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Quantity
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Date
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data?.map((prop) => (
                                                        <TableRow
                                                            key={
                                                                prop.outgoing_item_id
                                                            }
                                                        >
                                                            <TableCell className=''>
                                                                {
                                                                    prop.outgoing_item_id
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop
                                                                        .warehouse_table
                                                                        .item_table
                                                                        .item_name
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop.warehouse_id
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop.outgoing_item_quantity
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {prop.outgoing_item_date?.toString()}
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                <Dialog>
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <img
                                                                            src='/edit_icon.png'
                                                                            alt=''
                                                                        />
                                                                    </DialogTrigger>
                                                                    <DialogContent className='sm:max-w-[425px]'>
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Edit
                                                                                Item
                                                                                '
                                                                                {
                                                                                    prop.outgoing_item_id
                                                                                }

                                                                                '
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                This
                                                                                will
                                                                                effect
                                                                                the{' '}
                                                                                <span className='font-bold'>
                                                                                    Warehouse
                                                                                </span>{' '}
                                                                                Table.
                                                                            </DialogDescription>
                                                                        </DialogHeader>

                                                                        <div className='flex flex-col gap-5'>
                                                                            <p>
                                                                                Warehouse
                                                                                quantity
                                                                                :{' '}
                                                                                {
                                                                                    prop
                                                                                        .warehouse_table
                                                                                        .warehouse_quantity
                                                                                }
                                                                            </p>
                                                                            <label
                                                                                htmlFor='quantity'
                                                                                className=''
                                                                            >
                                                                                Quantity
                                                                                :
                                                                            </label>
                                                                            <input
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setQuantityState(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                                id='quantity'
                                                                                className=' px-2 w-1/3 bg-cardBlack text-white border-2 border-white rounded-md outline-none'
                                                                                type='number'
                                                                                placeholder='20'
                                                                                min={
                                                                                    0
                                                                                }
                                                                            />
                                                                        </div>

                                                                        <DialogFooter>
                                                                            <Button
                                                                                onClick={() => {
                                                                                    handleEdit(
                                                                                        prop.outgoing_item_id
                                                                                    );
                                                                                }}
                                                                                type='submit'
                                                                                className='bg-bluePrimary hover:shadow-md hover:shadow-bluePrimary transition-all'
                                                                            >
                                                                                Save
                                                                                changes
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
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                            src='delete_icon.png'
                                                                            alt='delete icon'
                                                                        />
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className='font-outfit bg-cardBlack text-white'>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className=''>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                to
                                                                                delete
                                                                                an{' '}
                                                                                <span className='font-bold'>
                                                                                    Outgoing
                                                                                    Item
                                                                                </span>{' '}
                                                                                ?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This
                                                                                will{' '}
                                                                                <span className='font-bold'>
                                                                                    undo
                                                                                </span>
                                                                                the
                                                                                Outgoing
                                                                                item
                                                                                .{' '}
                                                                                Action
                                                                                cannot
                                                                                be
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
                                                                                Delete
                                                                                Item
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
                                    </motion.div>
                                </TabsContent>
                                <TabsContent value='password'>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -100,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className='px-9 flex flex-col gap-3'
                                    >
                                        <h2 className='text-lg'>
                                            Select an Item :
                                        </h2>
                                        <Select
                                            onValueChange={(e) => {
                                                setItemState(e);
                                            }}
                                        >
                                            <SelectTrigger className='w-[55%] h-fit'>
                                                <SelectValue placeholder='Select Item' />
                                            </SelectTrigger>

                                            <SelectContent className='bg-cardBlack text-white'>
                                                <ScrollArea className='h-40'>
                                                    {props.warehouse
                                                        .filter((e) => {
                                                            return (
                                                                e.warehouse_quantity >
                                                                0
                                                            );
                                                        })
                                                        .map((prop) => (
                                                            <SelectItem
                                                                key={prop.warehouse_id.toString()}
                                                                value={prop.warehouse_id.toString()}
                                                                className='hover:bg-cardGray transition-all'
                                                            >
                                                                <div className='flex flex-col gap-2 '>
                                                                    <h4 className='font-bold'>
                                                                        {
                                                                            prop
                                                                                .item_table
                                                                                .item_name
                                                                        }
                                                                    </h4>
                                                                    <p>
                                                                        Warehouse
                                                                        ID :{' '}
                                                                        {
                                                                            prop.warehouse_id
                                                                        }
                                                                    </p>
                                                                    <p>
                                                                        Quantity
                                                                        :{' '}
                                                                        {
                                                                            prop.warehouse_quantity
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </SelectItem>
                                                        ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select>
                                        <h2 className='text-lg'>
                                            Add Quantity :
                                        </h2>
                                        <Input
                                            onChange={(e) => {
                                                setQuantityState(
                                                    e.target.value
                                                );
                                            }}
                                            name='quantity'
                                            className='bg-cardBlack w-1/4'
                                            placeholder='30'
                                            // onChange={(e) =>
                                            //     setQuantityState(e.target.value)
                                            // }
                                            type='number'
                                            min={0}
                                            required
                                        />
                                        <div className='flex justify-end'>
                                            <Button
                                                className='bg-bluePrimary w-1/6 hover:scale-105 transition-all hover:shadow-bluePrimary hover:shadow-md '
                                                onClick={() => handleSubmit()}
                                            >
                                                Add Outgoing Item
                                            </Button>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <NavbarPhone isWarehouse={true}></NavbarPhone>
                    <div className='p-6 w-full'>
                        <h2 className='text-3xl font-bold'>Incoming Item</h2>
                        <div className='flex gap-5 mt-10 justify-end'>
                            <SelectComponent
                                data={data}
                                setData={setData}
                                setSortSelect={setSortSelect}
                                dataType='outgoing'
                            />
                        </div>
                        <div className='w-full mt-10 flex flex-col gap-7'>
                            {data?.map((prop) => (
                                <CardWarehouse
                                    name={
                                        prop.warehouse_table.item_table
                                            .item_name
                                    }
                                    quantity={prop.outgoing_item_quantity.toString()}
                                    // status={prop.status?.toString()}
                                ></CardWarehouse>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Outgoing;

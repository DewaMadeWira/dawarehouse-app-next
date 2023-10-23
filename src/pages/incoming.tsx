import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { useEffect, useState } from 'react';
import type {
    NextPage,
    InferGetServerSidePropsType,
    GetServerSideProps,
} from 'next';
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
import Image from 'next/image';

async function getIncomingItems() {
    const incomingItems = await prisma.incoming_item_table.findMany({
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

export const getServerSideProps: GetServerSideProps<{
    [x: string]: any;
    incomingItems: Prisma.PromiseReturnType<typeof getIncomingItems>;
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
    items: Prisma.PromiseReturnType<typeof getAllItem>;
}> = async () => {
    const incomingItems = await getIncomingItems();
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();
    const items = await getAllItem();

    return {
        props: {
            incomingItems: JSON.parse(JSON.stringify(incomingItems)),
            totalWarehouse,
            incomingSum,
            outgoingItem,
            allItem,
            items,
        },
        // revalidate: 1,
    };
};

interface StatusType {
    inStock: boolean;
    needRestock: boolean;
    empty: boolean;
}

const Incoming: NextPage<
    InferGetServerSidePropsType<typeof getServerSideProps>
> = (props: InferGetServerSidePropsType<typeof getServerSideProps>) => {
    const router = useRouter();

    const { toast } = useToast();

    const refreshData = () => {
        router.replace(router.asPath);
    };

    const [windowWidth, setWindowWidth] = useState<number>(700);

    const [data, setData] =
        useState<Prisma.PromiseReturnType<typeof getIncomingItems>>();

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
        const filteredData = props.incomingItems.filter(
            (item) => item !== null && item !== undefined
        );
        setData(filteredData);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    });

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
            setQuantityState('');
            refreshData();
            setData(props.incomingItems);
            toast({
                description: 'Data Created  !',
                className: 'bg-green p-5 font-outfit border-none ',
            });
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
        const res = await fetch('/api/updateIncoming', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                quantity: quantityState,
            }),
        });

        if (res.json != null) {
            setQuantityState('');
            refreshData();
            setData(props.incomingItems);
        }
    }

    return (
        <main className='min-h-screen bg-bgBlack text-white font-outfit'>
            <Head>
                <title>DaWarehouse | Incoming</title>
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
                                    dataType='incoming'
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
                                        Incoming Item
                                    </TabsTrigger>
                                    <TabsTrigger value='password' className=''>
                                        Add Incoming Item
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
                                                            Incoming ID
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
                                                    {data?.map((prop?) => (
                                                        <TableRow
                                                            key={
                                                                prop.incoming_item_id
                                                            }
                                                        >
                                                            <TableCell className=''>
                                                                {
                                                                    prop.incoming_item_id
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop
                                                                        ?.warehouse_table
                                                                        ?.item_table
                                                                        ?.item_name
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop.warehouse_id
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop.incoming_item_quantity
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {prop.incoming_item_date.toString()}
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                <Dialog>
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <Image
                                                                            src='/edit_icon.png'
                                                                            alt='edit_icon'
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                        />
                                                                    </DialogTrigger>
                                                                    <DialogContent className='sm:max-w-[425px]'>
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Edit
                                                                                Item
                                                                                {`'`}
                                                                                {
                                                                                    prop.incoming_item_id
                                                                                }
                                                                                {`'`}
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
                                                                                        prop.incoming_item_id
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
                                                                        <Image
                                                                            className='hover:-translate-y-1 transition-all '
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                            src='/delete_icon.png'
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
                                                                                    Incoming
                                                                                    Item
                                                                                </span>{' '}
                                                                                ?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This
                                                                                will
                                                                                make
                                                                                the
                                                                                item
                                                                                on
                                                                                the
                                                                                warehouse{' '}
                                                                                <span className='font-bold'>
                                                                                    deleted
                                                                                </span>

                                                                                .
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
                                                                                    handleDeleteIncoming(
                                                                                        prop.incoming_item_id,
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
                                            <SelectTrigger className='w-[35%]'>
                                                <SelectValue placeholder='Select Item' />
                                            </SelectTrigger>

                                            <SelectContent className='bg-cardBlack text-white'>
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
                                                Add Incoming Item
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
                                dataType='incoming'
                            />
                        </div>
                        <div className='w-full mt-10 flex flex-col gap-7'>
                            {data?.map((prop) =>
                                prop.warehouse_table != null ? (
                                    <CardWarehouse
                                        key={
                                            prop.warehouse_table.item_table
                                                ?.item_name
                                        }
                                        name={
                                            prop.warehouse_table?.item_table !=
                                            null
                                                ? prop.warehouse_table
                                                      ?.item_table.item_name
                                                : ''
                                        }
                                        quantity={prop.incoming_item_quantity.toString()}
                                        // status={prop.status?.toString()}
                                    ></CardWarehouse>
                                ) : (
                                    ''
                                )
                            )}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Incoming;

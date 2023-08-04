import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { useEffect, useState } from 'react';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '../../db/client';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

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
import StatusCheckBox from '@/components/StatusCheckbox';

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
    incomingItems: Prisma.PromiseReturnType<typeof getIncomingItems>;
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
}> = async () => {
    const incomingItems = await getIncomingItems();
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();

    return {
        props: {
            incomingItems: JSON.parse(JSON.stringify(incomingItems)),
            totalWarehouse,
            incomingSum,
            outgoingItem,
            allItem,
        },
        // revalidate: 1,
    };
};

interface StatusType {
    inStock: boolean;
    needRestock: boolean;
    empty: boolean;
}

const Incoming: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const [windowWidth, setWindowWidth] = useState<number>(700);

    const [data, setData] =
        useState<Prisma.PromiseReturnType<typeof getIncomingItems>>();

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
        setData(props.incomingItems);
    }, []);

    return (
        <main className='min-h-screen bg-bgBlack text-white font-outfit'>
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
                                />
                                <StatusCheckBox
                                    statusCheckbox={statusCheckbox}
                                    setStatusCheckbox={setStatusCheckbox}
                                />
                                <Select
                                    onValueChange={(e) => {
                                        setSortSelect(e);
                                        if (e == 'descending') {
                                            setData(
                                                data?.sort((a, b) => {
                                                    return (
                                                        b.warehouse_id -
                                                        a.warehouse_id
                                                    );
                                                })
                                            );
                                        } else {
                                            setData(
                                                data?.sort((a, b) => {
                                                    return (
                                                        a.warehouse_id -
                                                        b.warehouse_id
                                                    );
                                                })
                                            );
                                        }
                                    }}
                                >
                                    <SelectTrigger className='w-fit border-bluePrimary'>
                                        <SelectValue placeholder='Sort' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-cardBlack text-white font-outfit'>
                                        <SelectItem value='ascending'>
                                            Ascending
                                        </SelectItem>
                                        <SelectItem value='descending'>
                                            Descending
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Incoming Item */}
                            <Tabs defaultValue='account' className='w-[400px]'>
                                <TabsList>
                                    <TabsTrigger value='account'>
                                        Account
                                    </TabsTrigger>
                                    <TabsTrigger value='password'>
                                        Password
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='account'>
                                    <div className='px-6'>
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
                                                    {data?.map((prop) => (
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
                                                                    prop.incoming_item_quantity
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {prop.incoming_item_date.toString()}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </div>
                                </TabsContent>
                                <TabsContent value='password'>
                                    Change your password here.
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <NavbarPhone isWarehouse={true}></NavbarPhone>
                    <div className='p-6 w-full'>
                        <h2 className='text-3xl font-bold'>Warehouse</h2>
                        <div className='flex gap-5 mt-10 justify-end'>
                            <Select>
                                <SelectTrigger className='w-fit border-bluePrimary'>
                                    <SelectValue placeholder='Status' />
                                </SelectTrigger>
                                <SelectContent className='bg-cardBlack text-white font-outfit'>
                                    <SelectItem value='light'>Light</SelectItem>
                                    <SelectItem value='dark'>Dark</SelectItem>
                                    <SelectItem value='system'>
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className='w-fit border-bluePrimary'>
                                    <SelectValue placeholder='Item' />
                                </SelectTrigger>
                                <SelectContent className='bg-cardBlack text-white font-outfit'>
                                    <SelectItem value='light'>Light</SelectItem>
                                    <SelectItem value='dark'>Dark</SelectItem>
                                    <SelectItem value='system'>
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                            <Select>
                                <SelectTrigger className='w-fit border-bluePrimary'>
                                    <SelectValue placeholder='Sort' />
                                </SelectTrigger>
                                <SelectContent className='bg-cardBlack text-white font-outfit'>
                                    <SelectItem value='light'>Light</SelectItem>
                                    <SelectItem value='dark'>Dark</SelectItem>
                                    <SelectItem value='system'>
                                        System
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className='w-full mt-10 flex flex-col gap-7'>
                            {/* {props.incomingItems.map((prop) => (
                                <CardWarehouse
                                    name={prop.item_table.item_name}
                                    quantity={prop.warehouse_quantity.toString()}
                                    status={prop.status?.toString()}
                                ></CardWarehouse>
                            ))} */}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Incoming;

import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import CardWarehouse from '@/components/CardWarehouse';
import { useContext, useEffect, useState } from 'react';
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

import { Badge } from '@/components/ui/badge';

import SidebarDesktop from '@/components/SidebarDesktop';

async function getWarehouse() {
    const warehouseItems = await prisma.warehouse_table.findMany({
        include: {
            item_table: true,
        },
    });
    return warehouseItems;
}

export const getStaticProps: GetStaticProps<{
    warehouseItems: Prisma.PromiseReturnType<typeof getWarehouse>;
}> = async () => {
    const warehouseItems = await getWarehouse();

    return {
        props: {
            warehouseItems,
        },
        // revalidate: 1,
    };
};

const Warehouse: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const [windowWidth, setWindowWidth] = useState<number>(0);

    useEffect(() => {
        function handleResize() {
            // Set window width/height to state
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    function statusBadge(status: string | null) {
        if (status == 'In-stock') {
            return (
                <Badge className='bg-green text-white border-none font-medium outline-none text-sm'>
                    In-Stock
                </Badge>
            );
        } else if (status == 'Need Restock') {
            return (
                <Badge className='bg-yellow  outline-none border-none font-medium text-sm'>
                    Need Restock
                </Badge>
            );
        } else {
            return (
                <Badge className='bg-red border-none outline-none font-medium text-sm'>
                    Empty
                </Badge>
            );
        }
    }

    return (
        <main className='min-h-screen bg-bgBlack text-white font-outfit'>

            {windowWidth >= 700 ? (
                <div>
                
                    <Navbar isWarehouse={true}></Navbar>
                    <div className='flex justify-between pr-6'>
                        <SidebarDesktop></SidebarDesktop>
                        {/* Main Screen */}
                        <div className='w-4/5 flex flex-col px-10'>
                            {/* Button Container */}
                            <div className='flex justify-around'>
                                <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                                    <img
                                        src='/warehouse.png'
                                        className='w-8 h-8'
                                        alt=''
                                    />
                                    <div>
                                        <h5 className='text-gray'>Warehouse</h5>
                                        <h4 className=''>14</h4>
                                    </div>
                                </div>
                                <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                                    <img
                                        src='/incoming.png'
                                        className='w-8 h-8'
                                        alt=''
                                    />
                                    <div>
                                        <h5 className='text-gray'>
                                            Incoming Item
                                        </h5>
                                        <h4 className=''>14</h4>
                                    </div>
                                </div>
                                <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                                    <img
                                        src='/outgoing.png'
                                        className='w-8 h-8'
                                        alt=''
                                    />
                                    <div>
                                        <h5 className='text-gray'>
                                            Outgoing item
                                        </h5>
                                        <h4 className=''>14</h4>
                                    </div>
                                </div>
                                <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                                    <img
                                        src='/item.png'
                                        className='w-8 h-8'
                                        alt=''
                                    />
                                    <div>
                                        <h5 className='text-gray'>
                                            Total Item
                                        </h5>
                                        <h4 className=''>14</h4>
                                    </div>
                                </div>
                            </div>
                            <div className='flex gap-5 mt-10 justify-end pr-10'>
                                <Select>
                                    <SelectTrigger className='w-fit border-bluePrimary'>
                                        <SelectValue placeholder='Status' />
                                    </SelectTrigger>
                                    <SelectContent className='bg-cardBlack text-white font-outfit'>
                                        <SelectItem value='light'>
                                            Light
                                        </SelectItem>
                                        <SelectItem value='dark'>
                                            Dark
                                        </SelectItem>
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
                                        <SelectItem value='light'>
                                            Light
                                        </SelectItem>
                                        <SelectItem value='dark'>
                                            Dark
                                        </SelectItem>
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
                                        <SelectItem value='light'>
                                            Light
                                        </SelectItem>
                                        <SelectItem value='dark'>
                                            Dark
                                        </SelectItem>
                                        <SelectItem value='system'>
                                            System
                                        </SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            {/* Warehouse */}
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
                                                    ID
                                                </TableHead>
                                                <TableHead className=''>
                                                    Item Name
                                                </TableHead>
                                                <TableHead className=''>
                                                    Quantity
                                                </TableHead>
                                                <TableHead className=''>
                                                    Category
                                                </TableHead>
                                                <TableHead className=''>
                                                    Status
                                                </TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {props.warehouseItems.map(
                                                (prop) => (
                                                    <TableRow
                                                        key={prop.warehouse_id}
                                                    >
                                                        <TableCell className=''>
                                                            {prop.warehouse_id}
                                                        </TableCell>
                                                        <TableCell className=''>
                                                            {
                                                                prop.item_table
                                                                    .item_name
                                                            }
                                                        </TableCell>
                                                        <TableCell className=''>
                                                            {
                                                                prop.warehouse_quantity
                                                            }
                                                        </TableCell>
                                                        <TableCell className=''>
                                                            {
                                                                prop.item_table
                                                                    .item_category
                                                            }
                                                        </TableCell>
                                                        <TableCell className=''>
                                                            {statusBadge(
                                                                prop.status
                                                            )}
                                                        </TableCell>
                                                    </TableRow>
                                                )
                                            )}
                                        </TableBody>
                                    </Table>
                                </div>
                            </div>
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
                            {props.warehouseItems.map((prop) => (
                                <CardWarehouse
                                    name={prop.item_table.item_name}
                                    quantity={prop.warehouse_quantity.toString()}
                                    status={prop.status?.toString()}
                                ></CardWarehouse>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Warehouse;

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

import SidebarDesktop from '@/components/SidebarDesktop';

async function getWarehouse() {
    const warehouseItems = await prisma.warehouse_table.findMany();
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
                            {/* Warehouse */}
                            <div className=' h-fit p-5 w-fit text-lg mt-5 bg-cardBlack border-bluePrimary border-2 rounded-lg'>
                                <h3 className='text-center font-outfit font-bold text-white '>
                                    Warehouse Items
                                </h3>
                                <Table className='text-white font-outfit'>
                                    <TableCaption>
                                        A list of all{' '}
                                        <span className='font-bold'>
                                            Warehouse
                                        </span>{' '}
                                        items.
                                    </TableCaption>
                                    <TableHeader>
                                        <TableRow className='text-gray hover:bg-cardBlack'>
                                            <TableHead className=''>
                                                ID
                                            </TableHead>
                                            <TableHead className=''>
                                                Quantity
                                            </TableHead>
                                            <TableHead className=''>
                                                Item ID
                                            </TableHead>
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
                        <div className='w-full mt-10'>
                            <CardWarehouse
                                name={'GTX 950'}
                                quantity={'2'}
                                status={'In Stock'}
                            ></CardWarehouse>
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Warehouse;

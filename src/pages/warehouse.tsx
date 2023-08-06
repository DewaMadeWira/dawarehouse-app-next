import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import CardWarehouse from '@/components/CardWarehouse';
import { useEffect, useState } from 'react';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '../../db/client';
import { useRouter } from 'next/router';

import { motion } from 'framer-motion';
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
import TotalBar from '@/components/TotalBar';
import StatusCheckBox from '@/components/StatusCheckbox';
import SelectComponent from '@/components/SelectComponent';

async function getWarehouse() {
    const warehouseItems = await prisma.warehouse_table.findMany({
        include: {
            item_table: true,
        },
    });
    return warehouseItems;
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
    warehouseItems: Prisma.PromiseReturnType<typeof getWarehouse>;
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
}> = async () => {
    const warehouseItems = await getWarehouse();
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();

    return {
        props: {
            path: [],
            warehouseItems,
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

const Warehouse: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const router = useRouter();

    const [windowWidth, setWindowWidth] = useState<number>(700);

    const [data, setData] =
        useState<Prisma.PromiseReturnType<typeof getWarehouse>>();

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
        setData(props.warehouseItems);
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

    if (router.isFallback) {
        return <div>Loading...</div>;
    }

    return (
        <div className='min-h-screen bg-bgBlack text-white font-outfit'>
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
                                    dataType='warehouse'
                                />
                                <StatusCheckBox
                                    statusCheckbox={statusCheckbox}
                                    setStatusCheckbox={setStatusCheckbox}
                                />
                            </div>
                            {/* Warehouse */}
                            <div className='px-6'>
                                <div className=' h-fit p-5 text-lg mt-5 bg-cardBlack w-full  rounded-lg'>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            y: 100,
                                        }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ duration: 1 }}
                                    >
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
                                                {data
                                                    ?.filter((e) => {
                                                        if (
                                                            statusCheckbox.empty ==
                                                                true &&
                                                            statusCheckbox.inStock ==
                                                                true &&
                                                            statusCheckbox.needRestock ==
                                                                true
                                                        ) {
                                                            return e;
                                                        }

                                                        if (
                                                            statusCheckbox.empty &&
                                                            statusCheckbox.inStock
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                    'Empty' ||
                                                                e.status ==
                                                                    'In-stock'
                                                            );
                                                        }
                                                        if (
                                                            statusCheckbox.empty &&
                                                            statusCheckbox.needRestock
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                    'Empty' ||
                                                                e.status ==
                                                                    'Need Restock'
                                                            );
                                                        }
                                                        if (
                                                            statusCheckbox.inStock &&
                                                            statusCheckbox.needRestock
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                    'In-stock' ||
                                                                e.status ==
                                                                    'Need Restock'
                                                            );
                                                        }

                                                        if (
                                                            statusCheckbox.inStock
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                'In-stock'
                                                            );
                                                        }
                                                        if (
                                                            statusCheckbox.needRestock
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                'Need Restock'
                                                            );
                                                        }
                                                        if (
                                                            statusCheckbox.empty
                                                        ) {
                                                            return (
                                                                e.status ==
                                                                'Empty'
                                                            );
                                                        }

                                                        return;
                                                    })

                                                    .map((prop: any) => (
                                                        <TableRow
                                                            key={
                                                                prop.warehouse_id
                                                            }
                                                        >
                                                            <TableCell className=''>
                                                                {
                                                                    prop.warehouse_id
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop
                                                                        .item_table
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
                                                                    prop
                                                                        .item_table
                                                                        .item_category
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {statusBadge(
                                                                    prop.status
                                                                )}
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}

                                                {/* {sortSelect == 'descending'
                                                ? props.warehouseItems
                                                      .sort((a, b) => {
                                                          return (
                                                              b.warehouse_id -
                                                              a.warehouse_id
                                                          );
                                                      })
                                                      .map((prop) => (
                                                          <TableRow
                                                              key={
                                                                  prop.warehouse_id
                                                              }
                                                          >
                                                              <TableCell className=''>
                                                                  {
                                                                      prop.warehouse_id
                                                                  }
                                                              </TableCell>
                                                              <TableCell className=''>
                                                                  {
                                                                      prop
                                                                          .item_table
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
                                                                      prop
                                                                          .item_table
                                                                          .item_category
                                                                  }
                                                              </TableCell>
                                                              <TableCell className=''>
                                                                  {statusBadge(
                                                                      prop.status
                                                                  )}
                                                              </TableCell>
                                                          </TableRow>
                                                      ))
                                                : props.warehouseItems
                                                      .sort((a, b) => {
                                                          return (
                                                              a.warehouse_id -
                                                              b.warehouse_id
                                                          );
                                                      })
                                                      .map((prop) => (
                                                          <TableRow
                                                              key={
                                                                  prop.warehouse_id
                                                              }
                                                          >
                                                              <TableCell className=''>
                                                                  {
                                                                      prop.warehouse_id
                                                                  }
                                                              </TableCell>
                                                              <TableCell className=''>
                                                                  {
                                                                      prop
                                                                          .item_table
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
                                                                      prop
                                                                          .item_table
                                                                          .item_category
                                                                  }
                                                              </TableCell>
                                                              <TableCell className=''>
                                                                  {statusBadge(
                                                                      prop.status
                                                                  )}
                                                              </TableCell>
                                                          </TableRow>
                                                      ))} */}
                                            </TableBody>
                                        </Table>
                                    </motion.div>
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
        </div>
    );
};

export default Warehouse;

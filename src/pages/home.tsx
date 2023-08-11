import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';
import ChartHome from '@/components/ChartHome';
import { prisma } from '../../db/client';
import { GetStaticProps, InferGetStaticPropsType, NextPage } from 'next';
import { Prisma } from '@prisma/client';

const DynamicHeader = dynamic(() => import('@/components/Navbar'), {
    loading: () => <p>Loading...</p>,
});

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
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
}> = async () => {
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();

    return {
        props: {
            totalWarehouse,
            incomingSum,
            outgoingItem,
            allItem,
        },
        // revalidate: 1,
    };
};

const Home: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const router = useRouter();
    const [windowWidth, setWindowWidth] = useState<number>(0);

    // labels: [
    //         'Warehouse Item',
    //         'Incoming Item',
    //         'Outgoing Item',
    //         'Total Item',
    //     ],
    // const [data, setData] = useState([
    //     {
    //         name: 'Warehouse Item',
    //         quantity: props.totalWarehouse._sum.warehouse_quantity,
    //     },
    //     {
    //         name: 'Incoming Item',
    //         quantity: props.incomingSum._sum.incoming_item_quantity,
    //     },
    //     {
    //         name: 'Outgoing Item',
    //         quantity: props.outgoingItem._sum.outgoing_item_quantity,
    //     },
    //     {
    //         name: 'Total Item',
    //         quantity: props.allItem._count._all,
    //     },
    // ]);

    const data = [
        {
            name: 'Warehouse Item',
            quantity: props.totalWarehouse._sum.warehouse_quantity,
        },
        {
            name: 'Incoming Item',
            quantity: props.incomingSum._sum.incoming_item_quantity,
        },
        {
            name: 'Outgoing Item',
            quantity: props.outgoingItem._sum.outgoing_item_quantity,
        },
        {
            name: 'Total Item',
            quantity: props.allItem._count._all,
        },
    ];

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
        <div className={`min-h-screen bg-bgBlack text-white font-outfit`}>
            {windowWidth >= 700 ? (
                // <h1>testing</h1>
                <Navbar isWarehouse={false}></Navbar>
            ) : (
                <NavbarPhone isWarehouse={false}></NavbarPhone>
            )}

            <div
                className={`sm:flex sm:justify-between w-full items-center mt-16`}
            >
                <div className='p-16 '>
                    <motion.h1
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className='text-5xl sm:text-7xl font-bold '
                    >
                        DaWarehouse
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65 }}
                        className='text-4xl sm:text-5xl font-light'
                    >
                        Inventory
                    </motion.h2>
                    <motion.h2
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className='text-4xl sm:text-5xl font-light'
                    >
                        Management System
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className='w-1/2 mt-7 text-gray text-xl text 2xl sm:w-full'
                    >
                        <p>built using Next JS and Prisma ORM.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45 }}
                    >
                        <Button
                            className='bg-bluePrimary mt-10 text-xl p-6 hover:-translate-y-2 transition-all active:scale-50'
                            onClick={() => router.push('/warehouse')}
                        >
                            Go to Warehouse
                        </Button>
                    </motion.div>
                </div>
                <div className='py-16 px-10'>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.45 }}
                        className='bg-cardBlack rounded-xl h-80 w-[20rem] sm:w-[37rem] py-6'
                    >
                        <ChartHome data={data}></ChartHome>
                    </motion.div>
                </div>
            </div>
            <div className='h-screen bg-bgBlack' id='about'>
                <div className='p-16 '>
                    <motion.h1
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className='text-5xl sm:text-7xl font-bold '
                    >
                        About
                    </motion.h1>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className='w-1/2 mt-7 text-gray text-xl text 2xl sm:w-full'
                    >
                        <motion.p
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            className='sm:w-1/2'
                        >
                            This website are an{' '}
                            <span className='text-white'>
                                Inventory Management System
                            </span>{' '}
                            build using{' '}
                            <span className='text-white'>
                                Next JS, Prisma, and ShadcnUI.
                            </span>{' '}
                            It has{' '}
                            <span className='text-white'>
                                Create, Read, Update, Delete
                            </span>{' '}
                            capabilty. The database used are{' '}
                            <span className='text-white'>PostgreSQL</span> using{' '}
                            <span className='text-white'>Supabase.</span>
                        </motion.p>
                    </motion.div>
                </div>
            </div>
        </div>
    );
};

export default Home;

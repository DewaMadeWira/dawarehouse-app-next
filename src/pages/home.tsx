import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { Button } from '@/components/ui/button';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/router';

import { motion } from 'framer-motion';

import { useState, useEffect } from 'react';

const DynamicHeader = dynamic(() => import('@/components/Navbar'), {
    loading: () => <p>Loading...</p>,
});

const Home = () => {
    const router = useRouter();
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
        <main className={`min-h-screen bg-bgBlack text-white font-outfit`}>
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
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.7 }}
                        className='text-5xl sm:text-7xl font-bold '
                    >
                        DaWarehouse
                    </motion.h1>
                    <motion.h2
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.65 }}
                        className='text-4xl sm:text-5xl font-light'
                    >
                        Inventory
                    </motion.h2>
                    <motion.h2
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.6 }}
                        className='text-4xl sm:text-5xl font-light'
                    >
                        Management System
                    </motion.h2>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                        className='w-1/2 mt-7 text-gray text-xl text 2xl sm:w-full'
                    >
                        <p>built using Next JS and Prisma ORM.</p>
                    </motion.div>
                    <motion.div
                        initial={{ opacity: 0, x: -100 }}
                        animate={{ opacity: 1, x: 0 }}
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
                <div className='p-16'>
                    <div className='bg-cardBlack rounded-xl h-72 w-20'>.</div>
                </div>
            </div>
        </main>
    );
};

export default Home;

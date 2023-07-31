import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { Button } from '@/components/ui/button';

import { useState, useEffect } from 'react';

const Home = () => {
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
        <main
            className={`min-h-screen bg-bgBlack text-white font-outfit`}
        >
            {windowWidth >= 700 ? (
                // <h1>testing</h1>
                <Navbar isWarehouse={false}></Navbar>
            ) : (
                <NavbarPhone isWarehouse={false}></NavbarPhone>
            )}

            <div className={`sm:flex sm:justify-between w-full items-center mt-16`}>
                <div className='p-6 '>
                    <h1 className='text-5xl sm:text-7xl font-bold '>
                        DaWarehouse
                    </h1>
                    <h2 className='text-4xl sm:text-5xl font-light'>
                        Inventory
                    </h2>
                    <h2 className='text-4xl sm:text-5xl font-light'>
                        Management System
                    </h2>
                    <div className='w-1/2 mt-7 text-gray text-xl text 2xl sm:w-full'>
                        <p>built using Next JS and Prisma ORM.</p>
                    </div>
                    <Button className='bg-bluePrimary mt-10 text-xl p-6'>
                        Go to Warehouse
                    </Button>
                </div>
                <div className='p-6'>
                    <div className='bg-cardBlack rounded-xl h-72 w-20'>.</div>
                </div>
            </div>
        </main>
    );
};

export default Home;

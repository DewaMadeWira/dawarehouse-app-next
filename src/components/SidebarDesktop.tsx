import { useContext } from 'react';
import { NavbarContext } from '@/context/NavbarContext';
import { useRouter } from 'next/router';
import { motion } from 'framer-motion';

const SidebarDesktop = () => {
    const { navbarValue, setNavbarValue } = useContext(NavbarContext);
    const router = useRouter();

    function changeSide(value: string) {
        setNavbarValue(value);
    }

    return (
        <motion.div
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 1 }}
            className='bg-cardBlack w-1/5 pt-8 h-screen flex flex-col gap-4 px-3'
        >
            {/* Warehouse */}
            <button
                onClick={() => {
                    changeSide('warehouse');
                    router.push('/warehouse');
                }}
                className={`flex transition-all w-full justify-start gap-10 items-center rounded-lg px-5 py-3 hover:bg-cardGray hover:-translate-y-1 ${
                    navbarValue == 'warehouse' ? 'bg-cardGray font-bold' : ''
                }`}
            >
                <img src='/warehouse.png' width={35} alt='' />
                <h4 className='text-lg'>Warehouse</h4>
            </button>
            {/* Incoming */}
            <button
                onClick={() => {
                    changeSide('incoming');
                    router.push('/incoming');
                }}
                className={`flex transition-all w-full justify-start gap-10 items-center rounded-lg px-5 py-3 hover:bg-cardGray hover:-translate-y-1 ${
                    navbarValue == 'incoming' ? 'bg-cardGray font-bold ' : ''
                } `}
            >
                <img src='/incoming.png' width={35} alt='' />
                <h4 className='text-lg'>Incoming</h4>
            </button>
            {/* Outgoing */}
            <button
                onClick={() => {
                    changeSide('outgoing');
                    router.push('/outgoing');
                }}
                className={`flex transition-all w-full justify-start gap-10 items-center rounded-lg px-5 py-3 hover:bg-cardGray hover:-translate-y-1 ${
                    navbarValue == 'outgoing' ? 'bg-cardGray font-bold' : ''
                } `}
            >
                <img src='/warehouse.png' width={35} alt='' />
                <h4 className='text-lg'>Outgoing</h4>
            </button>
            <button
                onClick={() => {
                    changeSide('outgoing');
                    router.push('/item');
                }}
                className={`flex transition-all w-full justify-start gap-10 items-center rounded-lg px-5 py-3 hover:bg-cardGray hover:-translate-y-1 ${
                    navbarValue == 'item' ? 'bg-cardGray font-bold' : ''
                } `}
            >
                <img src='/item.png' width={35} alt='' />
                <h4 className='text-lg'>Item</h4>
            </button>
        </motion.div>
    );
};

export default SidebarDesktop;

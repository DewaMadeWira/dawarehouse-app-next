import { useContext } from 'react';
import { NavbarContext } from '@/context/NavbarContext';
import { useRouter } from 'next/router';

const SidebarDesktop = () => {
    const { navbarValue, setNavbarValue } = useContext(NavbarContext);
    const router = useRouter();

    function changeSide(value: string) {
        setNavbarValue(value);
    }

    return (
        <div className='flex justify-between pr-6'>
            <div className='bg-cardBlack w-1/5 pt-8 h-screen px-3'>
                {/* Warehouse */}
                <button
                    onClick={() => {
                        changeSide('warehouse');
                        router.push('/warehouse');
                    }}
                    className={`flex transition-all w-full justify-start gap-10 items-center rounded-lg px-5 py-3 hover:bg-cardGray hover:-translate-y-1 ${
                        navbarValue == 'warehouse' ? 'bg-cardGray' : ''
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
                        navbarValue == 'incoming' ? 'bg-cardGray ' : ''
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
                        navbarValue == 'outgoing' ? 'bg-cardGray' : ''
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
                        navbarValue == 'item' ? 'bg-cardGray' : ''
                    } `}
                >
                    <img src='/item.png' width={35} alt='' />
                    <h4 className='text-lg'>Item</h4>
                </button>
            </div>
            <div className=''>
                <h2>Testing</h2>
            </div>
        </div>
    );
};

export default SidebarDesktop;

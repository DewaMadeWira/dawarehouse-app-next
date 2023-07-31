import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import Link from 'next/link';

interface NavbarType {
    isWarehouse: boolean;
}

const Navbar = ({ isWarehouse }: NavbarType) => {
    return (
        <nav className='flex justify-between pr-6'>
            {isWarehouse ? (
                <div className='flex items-center bg-cardBlack h-full w-1/5 pl-6 py-4 pr-10'>
                    <img src='/logo.png' alt='' />
                    <h4 className='font-bold text-xl ml-2'>DaWarehouse</h4>
                </div>
            ) : (
                <div className='flex items-center pl-6'>
                    <img src='/logo.png' alt='' />
                    <h4 className='font-bold text-xl ml-2'>DaWarehouse</h4>
                </div>
            )}

            <div className='w-1/2 lg:w-1/3 justify-between flex pr-8 py-5'>
                <Link href={'/'}>
                    <h5 className='text-lg'>Home</h5>
                </Link>

                <hr className=' border-gray' />
                <Link href={'/warehouse'}>
                    <h5 className='text-lg'>Warehouse</h5>
                </Link>

                <hr className=' border-gray' />
                <Link href={'/about'}>
                    <h5 className='text-lg'>About</h5>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;

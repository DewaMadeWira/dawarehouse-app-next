import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

const Navbar = () => {
    return (
        <nav className='flex items-center justify-between p-6 pt-1'>
            <div className='flex items-center'>
                <img src='/logo.png' alt='' />
                <h4 className='font-bold text-xl ml-2'>DaWarehouse</h4>
            </div>
            <div className='w-1/2 lg:w-1/3 justify-between flex pr-8'>
                <a href='/'>
                    <h5 className='text-lg'>Home</h5>
                </a>
                <hr className=' border-gray' />
                <a href='/warehouse'>
                    <h5 className='text-lg'>Warehouse</h5>
                </a>
                <hr className=' border-gray' />
                <a href='/about'>
                    <h5 className='text-lg'>About</h5>
                </a>
            </div>
        </nav>
    );
};

export default Navbar;

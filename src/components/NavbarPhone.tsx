import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';

import {
    Sheet,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';

const NavbarPhone = () => {
    return (
        <nav className='flex items-center justify-between p-6'>
            <Sheet>
                <SheetTrigger>
                    <div className='flex items-center'>
                        <img src='/logo.png' alt='' />
                        <h4 className='font-bold text-xl'>DaWarehouse</h4>
                    </div>
                </SheetTrigger>
                <SheetContent
                    side={'left'}
                    className='bg-cardBlack text-white w-fit'
                >
                    <SheetHeader>
                        <SheetDescription>
                            <div className='flex flex-col gap-10'>
                                <img src='/logo.png' alt='' />
                                <img src='/warehouse.png' alt='' />
                            </div>
                        </SheetDescription>
                    </SheetHeader>
                </SheetContent>
            </Sheet>

            <Popover>
                <PopoverTrigger>
                    <img src='/hamburger.png' width={40} alt='' />
                </PopoverTrigger>
                <PopoverContent className='bg-cardBlack text-white font-outfit w-32 mr-5 flex flex-col gap-2'>
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
                </PopoverContent>
            </Popover>
        </nav>
    );
};

export default NavbarPhone;

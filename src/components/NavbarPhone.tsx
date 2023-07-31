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
import Link from 'next/link';

interface NavbarType {
    isWarehouse: boolean;
}

const NavbarPhone = ({ isWarehouse }: NavbarType) => {
    return (
        <nav className='flex items-center justify-between p-6'>
            {isWarehouse ? (
                <Sheet>
                    <SheetTrigger>
                        <div className='flex items-center'>
                            <img src='/logo.png' alt='' />
                            {isWarehouse ? (
                                <span></span>
                            ) : (
                                <h4 className='font-bold text-xl'>
                                    DaWarehouse
                                </h4>
                            )}
                        </div>
                    </SheetTrigger>
                    <SheetContent
                        side={'left'}
                        className='bg-cardBlack text-white w-fit pr-10'
                    >
                        <SheetHeader>
                            <SheetDescription>
                                <div className='flex flex-col gap-10'>
                                    <img src='/logo.png' alt='' />
                                    <img src='/warehouse.png' alt='' />
                                    <img src='/incoming.png' alt='' />
                                    <img src='/outgoing.png' alt='' />
                                    <img src='/item.png' alt='' />
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            ) : (
                <div className='flex items-center'>
                    <img src='/logo.png' alt='' />
                    {isWarehouse ? (
                        <span></span>
                    ) : (
                        <h4 className='font-bold text-xl'>DaWarehouse</h4>
                    )}
                </div>
            )}

            <Popover>
                <PopoverTrigger>
                    <img src='/hamburger.png' width={40} alt='' />
                </PopoverTrigger>
                <PopoverContent className='bg-cardBlack text-white font-outfit w-32 mr-5 flex flex-col gap-2'>
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
                </PopoverContent>
            </Popover>
        </nav>
    );
};

export default NavbarPhone;

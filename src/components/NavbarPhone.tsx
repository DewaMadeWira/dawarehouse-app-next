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
    SheetTrigger,
} from '@/components/ui/sheet';
import Link from 'next/link';

import Image from 'next/image';

interface NavbarType {
    isWarehouse: boolean;
}

const NavbarPhone = ({ isWarehouse }: NavbarType) => {
    return (
        <nav className='flex items-center justify-between p-6 sticky top-0 bg-bgBlack'>
            {isWarehouse ? (
                <Sheet>
                    <SheetTrigger>
                        <div className='flex items-center'>
                            <Image
                                src='/logo.png'
                                alt=''
                                width={50}
                                height={50}
                            />
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
                                    <Link href={'/'}>
                                        <Image
                                            src='/logo.png'
                                            width={55}
                                            height={55}
                                            alt='logo'
                                        />
                                    </Link>
                                    <Link href={'/warehouse'}>
                                        <Image
                                            src='/warehouse.png'
                                            width={55}
                                            height={55}
                                            alt='warehouse'
                                        />
                                    </Link>
                                    <Link href={'/incoming'}>
                                        <Image
                                            src='/incoming.png'
                                            width={55}
                                            height={55}
                                            alt='incoming'
                                        />
                                    </Link>
                                    <Link href={'/outgoing'}>
                                        <Image
                                            src='/outgoing.png'
                                            width={55}
                                            height={55}
                                            alt='outgoing'
                                        />
                                    </Link>
                                    <Link href={'/item'}>
                                        <Image
                                            src='/item.png'
                                            width={55}
                                            height={55}
                                            alt='item'
                                        />
                                    </Link>
                                </div>
                            </SheetDescription>
                        </SheetHeader>
                    </SheetContent>
                </Sheet>
            ) : (
                <div className='flex items-center'>
                    <Image src='/logo.png' alt='' width={50} height={50} />
                    {isWarehouse ? (
                        <span></span>
                    ) : (
                        <h4 className='font-bold text-xl'>DaWarehouse</h4>
                    )}
                </div>
            )}

            <Popover>
                <PopoverTrigger>
                    <Image
                        src='/hamburger.png'
                        alt='logo'
                        width={40}
                        height={40}
                    ></Image>
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
                    <Link href={'/home/#about'}>
                        <h5 className='text-lg'>About</h5>
                    </Link>
                </PopoverContent>
            </Popover>
        </nav>
    );
};

export default NavbarPhone;

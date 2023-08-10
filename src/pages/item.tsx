import { useRouter } from 'next/router';
import Navbar from '@/components/Navbar';
import NavbarPhone from '@/components/NavbarPhone';
import { useEffect, useState } from 'react';
import type { InferGetStaticPropsType, GetStaticProps, NextPage } from 'next';
import { Prisma } from '@prisma/client';
import { prisma } from '../../db/client';

import { motion } from 'framer-motion';

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';

import { ScrollArea } from '@/components/ui/scroll-area';

import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { Input } from '@/components/ui/input';

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import SidebarDesktop from '@/components/SidebarDesktop';

import TotalBar from '@/components/TotalBar';
import SelectComponent from '@/components/SelectComponent';

import { useToast } from '@/components/ui/use-toast';

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
    DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import CardWarehouse from '@/components/CardWarehouse';

// async function getOutgoingItems() {
//     const incomingItems = await prisma.outgoing_item_table.findMany({
//         include: {
//             warehouse_table: {
//                 include: {
//                     item_table: true,
//                 },
//             },
//         },
//     });
//     return incomingItems;
// }
// async function getWarehouse() {
//     const warehouse = await prisma.warehouse_table.findMany({
//         include: {
//             item_table: true,
//         },
//     });
//     return warehouse;
// }

async function getAllItem() {
    const items = await prisma.item_table.findMany();
    return items;
}

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
    // outgoingItems: Prisma.PromiseReturnType<typeof getOutgoingItems>;
    totalWarehouse: Prisma.PromiseReturnType<typeof getWarehouseSum>;
    incomingSum: Prisma.PromiseReturnType<typeof getIncomingSum>;
    outgoingItem: Prisma.PromiseReturnType<typeof getOutgoingSum>;
    allItem: Prisma.PromiseReturnType<typeof getItem>;
    items: Prisma.PromiseReturnType<typeof getAllItem>;
    // warehouse: Prisma.PromiseReturnType<typeof getWarehouse>;
}> = async () => {
    // const outgoingItems = await getOutgoingItems();
    const totalWarehouse = await getWarehouseSum();
    const incomingSum = await getIncomingSum();
    const outgoingItem = await getOutgoingSum();
    const allItem = await getItem();
    const items = await getAllItem();
    // const warehouse = await getWarehouse();

    return {
        props: {
            // outgoingItems: JSON.parse(JSON.stringify(outgoingItems)),
            totalWarehouse,
            incomingSum,
            outgoingItem,
            allItem,
            items,
            // warehouse,
        },
        // revalidate: 1,
    };
};

interface StatusType {
    inStock: boolean;
    needRestock: boolean;
    empty: boolean;
}

const Item: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
    props: InferGetStaticPropsType<typeof getStaticProps>
) => {
    const router = useRouter();

    const { toast } = useToast();

    const refreshData = () => {
        router.replace(router.asPath);
    };

    const [windowWidth, setWindowWidth] = useState<number>(700);

    const [data, setData] =
        useState<Prisma.PromiseReturnType<typeof getAllItem>>();

    const [itemState, setItemState] = useState('');
    const [name, setName] = useState('');
    const [category, setCategory] = useState('');
    const [price, setPrice] = useState('');

    const [sortSelect, setSortSelect] = useState('ascending');

    useEffect(() => {
        function handleResize() {
            // Set window width/height to state
            setWindowWidth(window.innerWidth);
        }
        window.addEventListener('resize', handleResize);

        handleResize();

        return () => window.removeEventListener('resize', handleResize);
    }, []);

    useEffect(() => {
        setData(props.items);
    });

    async function handleDeleteOutgoing(itemId: number, warehouseId: number) {
        const res = await fetch('/api/deleteOutgoing', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                itemId: itemId,
                warehouseId: warehouseId,
            }),
        });

        if (res.json != null) {
            // alert('refresh called');
            // setData((current) =>
            //     current?.filter((prop) => {
            //         return (
            //             prop.warehouse_id != warehouseId &&
            //             prop.incoming_item_id != itemId
            //         );
            //     })
            // );
            refreshData();
        }
    }

    // async function handleSubmit() {
    //     if (quantityState == '' || quantityState == '0') {
    //         // console.log('quantity 0');
    //         //
    //         toast({
    //             description: 'Quantity cannot be 0 or negative (-1) !',
    //             className: 'bg-yellow p-5 font-outfit border-none ',
    //         });
    //         return;
    //     }
    //     if (itemState == '') {
    //         toast({
    //             description: 'Please select an item !',
    //             className: 'bg-yellow p-5 font-outfit border-none ',
    //         });
    //         return;
    //     }
    //     // alert(quantityState + ' ' + itemState);

    //     const res = await fetch('/api/outgoingItem', {
    //         method: 'POST',
    //         headers: {
    //             'Content-Type': 'application/json',
    //         },
    //         body: JSON.stringify({
    //             itemId: itemState,
    //             quantity: quantityState,
    //         }),
    //     });

    //     if (res.status == 400) {
    //         toast({
    //             description: 'Quantity Insufficient !',
    //             className: 'bg-red p-5 font-outfit border-none ',
    //         });
    //         return;
    //     }

    //     if (res.status == 200) {
    //         setQuantityState('');
    //         refreshData();
    //         setData(props.items);
    //     }
    // }

    async function handleEdit(itemId: number) {
        if (name == '') {
            // console.log('quantity 0');
            //
            toast({
                description: 'Item name cannot be empty  !',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }
        if (category == '') {
            // console.log('quantity 0');
            //
            toast({
                description: 'Item category cannot be empty  !',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }
        if (price == '' || price == '0') {
            // console.log('quantity 0');
            //
            toast({
                description: 'Item price cannot be empty  or negative (-)!',
                className: 'bg-yellow p-5 font-outfit border-none ',
            });
            return;
        }
        // alert(price);

        const res = await fetch('/api/updateItem', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: itemId,
                name: name,
                category: category,
                price: price,
            }),
        });
        if (res.status == 400) {
            toast({
                description: 'Update Fails  !',
                className: 'bg-red p-5 font-outfit border-none ',
            });
            return;
        }

        if (res.json != null) {
            setName('');
            setItemState('');
            setCategory('');
            setPrice('');
            refreshData();
            setData(props.items);
        }
    }

    return (
        <main className='min-h-screen bg-bgBlack text-white font-outfit'>
            {windowWidth >= 700 ? (
                <div>
                    <Navbar isWarehouse={true}></Navbar>
                    <div className='flex justify-between pr-6'>
                        <SidebarDesktop></SidebarDesktop>
                        {/* Main Screen */}
                        <div className='w-4/5 flex flex-col px-10'>
                            {/* Total Container */}
                            <TotalBar
                                warehouseSum={
                                    props.totalWarehouse._sum.warehouse_quantity
                                }
                                incomingSum={
                                    props.incomingSum._sum
                                        .incoming_item_quantity
                                }
                                outgoingItem={
                                    props.outgoingItem._sum
                                        .outgoing_item_quantity
                                }
                                allItem={props.allItem._count._all}
                            ></TotalBar>
                            {/* Select Container */}
                            <div className='flex gap-5 mt-10 justify-end pr-10'>
                                <SelectComponent
                                    data={data}
                                    setData={setData}
                                    setSortSelect={setSortSelect}
                                    dataType='item'
                                />
                                {/* <StatusCheckBox
                                    statusCheckbox={statusCheckbox}
                                    setStatusCheckbox={setStatusCheckbox}
                                /> */}
                            </div>
                            {/* Incoming Item */}
                            <Tabs defaultValue='account' className='w-full'>
                                <TabsList className='ml-6'>
                                    <TabsTrigger value='account' className=''>
                                        Item
                                    </TabsTrigger>
                                    <TabsTrigger value='password' className=''>
                                        Add Item
                                    </TabsTrigger>
                                </TabsList>
                                <TabsContent value='account'>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -100,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className='px-6'
                                    >
                                        <div className=' h-fit p-5 text-lg mt-5 bg-cardBlack w-full  rounded-lg'>
                                            <Table className='text-white font-outfit'>
                                                <TableCaption>
                                                    {/* A list of all{' '}
                                            <span className='font-bold'>
                                                Warehouse
                                            </span>{' '}
                                            items. */}
                                                </TableCaption>
                                                <TableHeader>
                                                    <TableRow className='text-gray hover:bg-cardBlack'>
                                                        <TableHead className=''>
                                                            Item ID
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Item Name
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Category
                                                        </TableHead>
                                                        <TableHead className=''>
                                                            Price
                                                        </TableHead>
                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data?.map((prop) => (
                                                        <TableRow
                                                            key={prop.item_id}
                                                        >
                                                            <TableCell className=''>
                                                                {prop.item_id}
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {prop.item_name}
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {
                                                                    prop.item_category
                                                                }
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                {'Rp ' +
                                                                    prop.item_price}
                                                            </TableCell>

                                                            <TableCell className=''>
                                                                <Dialog>
                                                                    <DialogTrigger
                                                                        asChild
                                                                    >
                                                                        <img
                                                                            src='/edit_icon.png'
                                                                            alt=''
                                                                        />
                                                                    </DialogTrigger>
                                                                    <DialogContent className='sm:max-w-[425px]'>
                                                                        <DialogHeader>
                                                                            <DialogTitle>
                                                                                Edit
                                                                                Item
                                                                                '
                                                                                {
                                                                                    prop.item_name
                                                                                }

                                                                                '
                                                                            </DialogTitle>
                                                                            <DialogDescription>
                                                                                This
                                                                                will
                                                                                effect{' '}
                                                                                <span className='font-bold'>
                                                                                    All
                                                                                </span>{' '}
                                                                                item
                                                                                across
                                                                                the
                                                                                Table.
                                                                            </DialogDescription>
                                                                        </DialogHeader>

                                                                        <div className='flex flex-col gap-5'>
                                                                            <label
                                                                                htmlFor='name'
                                                                                className=''
                                                                            >
                                                                                Name
                                                                                :
                                                                            </label>
                                                                            <input
                                                                                onChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setName(
                                                                                        e
                                                                                            .target
                                                                                            .value
                                                                                    );
                                                                                }}
                                                                                id='name'
                                                                                className=' px-2 bg-cardBlack text-white border-2 border-white rounded-md outline-none'
                                                                                type='text'
                                                                                placeholder='GTX 950'
                                                                                min={
                                                                                    0
                                                                                }
                                                                            />
                                                                            <label
                                                                                htmlFor='category'
                                                                                className=''
                                                                            >
                                                                                Category
                                                                                :
                                                                            </label>
                                                                            <Select
                                                                                onValueChange={(
                                                                                    e
                                                                                ) => {
                                                                                    setCategory(
                                                                                        e
                                                                                    );
                                                                                }}
                                                                            >
                                                                                <SelectTrigger className='w-[180px]'>
                                                                                    <SelectValue placeholder='Category' />
                                                                                </SelectTrigger>
                                                                                <SelectContent className='h-40 bg-cardBlack text-white'>
                                                                                    <SelectItem value='Graphic Card'>
                                                                                        Graphic
                                                                                        Card
                                                                                    </SelectItem>
                                                                                    <SelectItem value='CPU'>
                                                                                        CPU
                                                                                    </SelectItem>
                                                                                    <SelectItem value='RAM'>
                                                                                        RAM
                                                                                    </SelectItem>
                                                                                    <SelectItem value='SSD'>
                                                                                        SSD
                                                                                    </SelectItem>
                                                                                    <SelectItem value='Mechanical Keyboard'>
                                                                                        Mechanical
                                                                                        Keyboard
                                                                                    </SelectItem>
                                                                                </SelectContent>
                                                                            </Select>

                                                                            <label
                                                                                htmlFor='price'
                                                                                className=''
                                                                            >
                                                                                Price
                                                                                :
                                                                            </label>
                                                                            <div className='flex'>
                                                                                <p className='mr-4'>
                                                                                    Rp:{' '}
                                                                                </p>
                                                                                <input
                                                                                    onChange={(
                                                                                        e
                                                                                    ) => {
                                                                                        setPrice(
                                                                                            e
                                                                                                .target
                                                                                                .value
                                                                                        );
                                                                                    }}
                                                                                    id='price'
                                                                                    className=' px-2 w-1/3 bg-cardBlack text-white border-2 border-white rounded-md outline-none'
                                                                                    type='text'
                                                                                    placeholder='2000'
                                                                                    min={
                                                                                        0
                                                                                    }
                                                                                />
                                                                            </div>
                                                                        </div>

                                                                        <DialogFooter>
                                                                            <Button
                                                                                onClick={() => {
                                                                                    handleEdit(
                                                                                        prop.item_id
                                                                                    );
                                                                                }}
                                                                                type='submit'
                                                                                className='bg-bluePrimary hover:shadow-md hover:shadow-bluePrimary transition-all'
                                                                            >
                                                                                Save
                                                                                changes
                                                                            </Button>
                                                                        </DialogFooter>
                                                                    </DialogContent>
                                                                </Dialog>
                                                            </TableCell>
                                                            <TableCell className=''>
                                                                <AlertDialog>
                                                                    <AlertDialogTrigger>
                                                                        <img
                                                                            className='hover:-translate-y-1 transition-all '
                                                                            width={
                                                                                20
                                                                            }
                                                                            height={
                                                                                20
                                                                            }
                                                                            src='delete_icon.png'
                                                                            alt='delete icon'
                                                                        />
                                                                    </AlertDialogTrigger>
                                                                    <AlertDialogContent className='font-outfit bg-cardBlack text-white'>
                                                                        <AlertDialogHeader>
                                                                            <AlertDialogTitle className=''>
                                                                                Are
                                                                                you
                                                                                sure
                                                                                to
                                                                                delete
                                                                                an
                                                                                delete
                                                                                an{' '}
                                                                                <span className='font-bold'>
                                                                                    Incoming
                                                                                    Item
                                                                                </span>{' '}
                                                                                ?
                                                                            </AlertDialogTitle>
                                                                            <AlertDialogDescription>
                                                                                This
                                                                                will
                                                                                make
                                                                                the
                                                                                item
                                                                                on
                                                                                the
                                                                                warehouse{' '}
                                                                                <span className='font-bold'>
                                                                                    deleted
                                                                                </span>

                                                                                .
                                                                                Action
                                                                                cannot
                                                                                be
                                                                                undone.
                                                                            </AlertDialogDescription>
                                                                        </AlertDialogHeader>
                                                                        <AlertDialogFooter>
                                                                            <AlertDialogCancel className='bg-bluePrimary'>
                                                                                Cancel
                                                                            </AlertDialogCancel>
                                                                            <AlertDialogAction
                                                                                className='bg-red text-white'
                                                                                onClick={() => {
                                                                                    handleDeleteOutgoing(
                                                                                        prop.item_id,
                                                                                        prop.item_id
                                                                                    );
                                                                                }}
                                                                            >
                                                                                Delete
                                                                                Item
                                                                            </AlertDialogAction>
                                                                        </AlertDialogFooter>
                                                                    </AlertDialogContent>
                                                                </AlertDialog>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))}
                                                </TableBody>
                                            </Table>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                                <TabsContent value='password'>
                                    <motion.div
                                        initial={{
                                            opacity: 0,
                                            x: -100,
                                        }}
                                        animate={{ opacity: 1, x: 0 }}
                                        transition={{ duration: 0.4 }}
                                        className='px-9 flex flex-col gap-3'
                                    >
                                        <h2 className='text-lg'>
                                            Select an Item :
                                        </h2>
                                        {/* <Select
                                            onValueChange={(e) => {
                                                setItemState(e);
                                            }}
                                        >
                                            <SelectTrigger className='w-[55%] h-fit'>
                                                <SelectValue placeholder='Select Item' />
                                            </SelectTrigger>

                                            <SelectContent className='bg-cardBlack text-white'>
                                                <ScrollArea className='h-40'>
                                                    {props.items.map((prop) => (
                                                        <SelectItem
                                                            key={prop.item_id.toString()}
                                                            value={prop.item_id.toString()}
                                                            className='hover:bg-cardGray transition-all'
                                                        >
                                                            <div className='flex flex-col gap-2 '>
                                                                <h4 className='font-bold'>
                                                                    {
                                                                        prop
                                                                    }
                                                                </h4>
                                                                <p>
                                                                    Warehouse ID
                                                                    :{' '}
                                                                    {
                                                                        prop.warehouse_id
                                                                    }
                                                                </p>
                                                                <p>
                                                                    Quantity :{' '}
                                                                    {
                                                                        prop.warehouse_quantity
                                                                    }
                                                                </p>
                                                            </div>
                                                        </SelectItem>
                                                    ))}
                                                </ScrollArea>
                                            </SelectContent>
                                        </Select> */}
                                        <h2 className='text-lg'>
                                            Add Quantity :
                                        </h2>
                                        <Input
                                            onChange={(e) => {
                                                // setQuantityState(
                                                //     e.target.value
                                                // );
                                            }}
                                            name='quantity'
                                            className='bg-cardBlack w-1/4'
                                            placeholder='30'
                                            // onChange={(e) =>
                                            //     setQuantityState(e.target.value)
                                            // }
                                            type='number'
                                            min={0}
                                            required
                                        />
                                        <div className='flex justify-end'>
                                            <Button
                                                className='bg-bluePrimary w-1/6 hover:scale-105 transition-all hover:shadow-bluePrimary hover:shadow-md '
                                                onClick={() => {}}
                                            >
                                                Add Outgoing Item
                                            </Button>
                                        </div>
                                    </motion.div>
                                </TabsContent>
                            </Tabs>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    <NavbarPhone isWarehouse={true}></NavbarPhone>
                    <div className='p-6 w-full'>
                        <h2 className='text-3xl font-bold'>Incoming Item</h2>
                        <div className='flex gap-5 mt-10 justify-end'>
                            <SelectComponent
                                data={data}
                                setData={setData}
                                setSortSelect={setSortSelect}
                                dataType='item'
                            />
                        </div>
                        <div className='w-full mt-10 flex flex-col gap-7'>
                            {data?.map((prop) => (
                                <CardWarehouse
                                    name={prop.item_name}
                                    quantity={
                                        'Rp ' + prop.item_price.toString()
                                    }
                                    // status={prop.status?.toString()}
                                ></CardWarehouse>
                            ))}
                        </div>
                    </div>
                </>
            )}
        </main>
    );
};

export default Item;

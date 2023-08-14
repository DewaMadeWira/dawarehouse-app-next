import { motion } from 'framer-motion';
import Image from 'next/image';

interface TotalBarType {
    warehouseSum: number | null;
    incomingSum: number | null;
    outgoingItem: number | null;
    allItem: number | null;
}

const TotalBar = ({
    warehouseSum,
    incomingSum,
    outgoingItem,
    allItem,
}: TotalBarType) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            className='flex justify-around '
        >
            <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                <Image
                    src='/warehouse.png'
                    className='w-8 h-8'
                    alt='warehouse'
                    width={50}
                    height={50}
                />
                <div>
                    <h5 className='text-gray'>Warehouse</h5>
                    <h4 className=''>{warehouseSum}</h4>
                </div>
            </div>
            <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                <Image
                    src='/incoming.png'
                    className='w-8 h-8'
                    alt='incoming'
                    width={50}
                    height={50}
                />
                <div>
                    <h5 className='text-gray'>Incoming Item</h5>
                    <h4 className=''>{incomingSum}</h4>
                </div>
            </div>
            <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                <Image
                    src='/outgoing.png'
                    className='w-8 h-8'
                    alt='outgoing'
                    width={50}
                    height={50}
                />
                <div>
                    <h5 className='text-gray'>Outgoing item</h5>
                    <h4 className=''>{outgoingItem}</h4>
                </div>
            </div>
            <div className='bg-cardGray w-1/5 rounded-lg flex justify-between items-center p-3'>
                <Image
                    src='/item.png'
                    className='w-8 h-8'
                    alt='item'
                    width={50}
                    height={50}
                />
                <div>
                    <h5 className='text-gray'>Total Item</h5>
                    <h4 className=''>{allItem}</h4>
                </div>
            </div>
        </motion.div>
    );
};

export default TotalBar;

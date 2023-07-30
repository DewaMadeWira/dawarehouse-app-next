import { Button } from './ui/button';

interface CardType {
    name: string;
    quantity: string;
    status: string;
}

const CardWarehouse = ({ name, quantity, status }: CardType) => {
    return (
        <div className='bg-cardGray text-white p-5 items-center rounded-lg font-outfit w-full flex justify-between'>
            <div>
                <p className='text-lg'>{name}</p>
                <p className='mt-2 text-sm'>Quantity : {quantity}</p>
            </div>

            <div className=''>
                <Button className={`bg-green`}>{status}</Button>
            </div>
        </div>
    );
};

export default CardWarehouse;

import { Button } from './ui/button';

interface CardType {
    name: string;
    quantity: string;
    status?: string;
}

const CardWarehouse = ({ name, quantity, status }: CardType) => {
    function statusBadge() {
        if (status == 'In-stock') {
            return <Button className={`bg-green`}>{status}</Button>;
        } else if (status == 'Need Restock') {
            return <Button className={`bg-yellow`}>{status}</Button>;
        } else if (status == 'Empty') {
            return <Button className={`bg-red`}>{status}</Button>;
        } else {
            return;
        }
    }
    return (
        <div className='bg-cardGray text-white p-5 items-center rounded-lg font-outfit w-full flex justify-between'>
            <div>
                <p className='text-lg'>{name}</p>
                <p className='mt-2 text-sm'>Quantity : {quantity}</p>
            </div>

            <div className=''>{statusBadge()}</div>
        </div>
    );
};

export default CardWarehouse;

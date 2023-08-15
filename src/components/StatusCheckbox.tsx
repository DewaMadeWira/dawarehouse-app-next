import { motion } from 'framer-motion';

import { Select, SelectContent, SelectTrigger } from '@/components/ui/select';

interface StatusType {
    inStock: boolean;
    needRestock: boolean;
    empty: boolean;
}

interface StatusCheckBoxType {
    statusCheckbox: StatusType;
    setStatusCheckbox: Function;
}

const StatusCheckBox = ({
    statusCheckbox,
    setStatusCheckbox,
}: StatusCheckBoxType) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
        >
            <Select>
                <SelectTrigger className='w-fit border-bluePrimary'>
                    <h4 className='mr-2'>Status</h4>
                </SelectTrigger>
                <SelectContent className='bg-cardBlack text-white font-outfit '>
                    <div className='flex flex-col items-start pl-2'>
                        <div className='flex justify-between items-start my-3 gap-2'>
                            <input
                                onChange={(e) => {
                                    const obj = {
                                        ...statusCheckbox,
                                        inStock: e.target.checked,
                                    };
                                    setStatusCheckbox(obj);
                                    // alert(e.target.checked);
                                }}
                                type='checkbox'
                                id='instock'
                                checked={statusCheckbox.inStock}
                            />
                            <label
                                htmlFor='instock'
                                className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                In-Stock
                            </label>
                        </div>
                        <div className='flex justify-between my-3 gap-2'>
                            <input
                                onChange={(e) => {
                                    const obj = {
                                        ...statusCheckbox,
                                        needRestock: e.target.checked,
                                    };
                                    setStatusCheckbox(obj);
                                    // alert(e.target.checked);
                                }}
                                type='checkbox'
                                id='restock'
                                checked={statusCheckbox.needRestock}
                            />
                            <label
                                htmlFor='restock'
                                className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                Need Restock
                            </label>
                        </div>
                        <div className='flex justify-between my-3 gap-2'>
                            <input
                                onChange={(e) => {
                                    const obj = {
                                        ...statusCheckbox,
                                        empty: e.target.checked,
                                    };
                                    setStatusCheckbox(obj);
                                    // alert(e.target.checked);
                                }}
                                type='checkbox'
                                id='empty'
                                checked={statusCheckbox.empty}
                            />
                            <label
                                htmlFor='empty'
                                className='text-sm font-normal leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                                Empty
                            </label>
                        </div>
                    </div>
                </SelectContent>
            </Select>
        </motion.div>
    );
};

export default StatusCheckBox;

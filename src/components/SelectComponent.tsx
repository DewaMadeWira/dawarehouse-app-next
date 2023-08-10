import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

import { motion } from 'framer-motion';

interface SelectComponentType {
    data: any;
    setData: Function;
    setSortSelect: Function;
    dataType: string;
}

const SelectComponent = ({
    data,
    setData,
    setSortSelect,
    dataType,
}: SelectComponentType) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: -100 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1 }}
        >
            <Select
                onValueChange={(e) => {
                    setSortSelect(e);
                    if (dataType == 'warehouse') {
                        if (e == 'descending') {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return b.warehouse_id - a.warehouse_id;
                                })
                            );
                        } else {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return a.warehouse_id - b.warehouse_id;
                                })
                            );
                        }
                    } else if (dataType == 'incoming') {
                        if (e == 'descending') {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return (
                                        b.incoming_item_id - a.incoming_item_id
                                    );
                                })
                            );
                        } else {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return (
                                        a.incoming_item_id - b.incoming_item_id
                                    );
                                })
                            );
                        }
                    } else if (dataType == 'outgoing') {
                        if (e == 'descending') {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return (
                                        b.outgoing_item_id - a.outgoing_item_id
                                    );
                                })
                            );
                        } else {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return (
                                        a.outgoing_item_id - b.outgoing_item_id
                                    );
                                })
                            );
                        }
                    } else if (dataType == 'item') {
                        if (e == 'descending') {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return b.item_id - a.item_id;
                                })
                            );
                        } else {
                            setData(
                                data?.sort((a: any, b: any) => {
                                    return a.item_id - b.item_id;
                                })
                            );
                        }
                    }
                }}
            >
                <SelectTrigger className='w-fit border-bluePrimary'>
                    <SelectValue placeholder='Sort' />
                </SelectTrigger>
                <SelectContent className='bg-cardBlack text-white font-outfit'>
                    <SelectItem value='ascending'>Ascending</SelectItem>
                    <SelectItem value='descending'>Descending</SelectItem>
                </SelectContent>
            </Select>
        </motion.div>
    );
};

export default SelectComponent;

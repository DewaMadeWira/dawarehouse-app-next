import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';

interface SelectComponentType {
    data: any;
    setData: Function;
    setSortSelect: Function;
}

const SelectComponent = ({
    data,
    setData,
    setSortSelect,
}: SelectComponentType) => {
    return (
        <Select
            onValueChange={(e) => {
                setSortSelect(e);
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
    );
};

export default SelectComponent;

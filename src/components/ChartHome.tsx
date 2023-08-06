import {
    BarChart,
    Bar,
    Cell,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts';

interface ChartType {
    name: string;
    quantity: number | null;
}

const ChartHome = ({ data }: any) => {
    // const data = [
    //     {
    //         name: 'Page A',
    //         uv: 4000,
    //     },
    //     {
    //         name: 'Page B',
    //         uv: 3000,
    //     },
    // ];

    return (
        <ResponsiveContainer width='100%' height='100%'>
            <BarChart
                width={100}
                height={300}
                data={data}
                margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                }}
            >
                {/* <CartesianGrid strokeDasharray='3 3' /> */}
                <XAxis dataKey='name' />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey='quantity' fill='#1B57E6' />
                {/* <Bar dataKey='uv' fill='#82ca9d' /> */}
            </BarChart>
        </ResponsiveContainer>
    );
};

export default ChartHome;

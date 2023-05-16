
import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';


const { Title, Text, Link } = Typography;

export default () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch('https://gw.alipayobjects.com/os/bmw-prod/1d565782-dde4-4bb6-8946-ea6a38ccf184.json')
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        xField: 'Date',
        yField: 'scales',
        xAxis: {
            // type: 'timeCat',
            tickCount: 5,
        },
        smooth: true,
    };

    return (
        <>
            <Text strong type='secondary'>SAFE MASTERNODES HISTORY LAST 30 DAYS</Text>
            <Line style={{height:"140px",marginTop:"10px"}} {...config} />
        </>
    )
}

import { useState, useEffect } from 'react';
import { Line } from '@ant-design/plots';
import { Button, Col, Row, Card, Space, Typography, Statistic, Divider } from 'antd';
import config from '../../config';


const { Title, Text, Link } = Typography;
const API_HOST = config.api_host;

export default () => {

    const [data, setData] = useState([]);

    useEffect(() => {
        asyncFetch();
    }, []);

    const asyncFetch = () => {
        fetch(`${API_HOST}/charts/masterNodesHistory`)
            .then((response) => response.json())
            .then((json) => setData(json))
            .catch((error) => {
                console.log('fetch data failed', error);
            });
    };
    const config = {
        data,
        xField: 'date',
        yField: 'count',
        xAxis: {
            tickCount: 4,
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
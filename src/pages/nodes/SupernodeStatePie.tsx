import { Pie } from '@ant-design/plots';
import { useEffect, useState } from 'react';
import { fetchSupernodesState } from '../../services/chart';
import { Col, Row, Typography } from 'antd';

export interface MasternodeStatePieData {
    total: number,
    enabled: number,
    init: number,
    error: number
}

const { Text } = Typography;

export default () => {
    const [loading, setLoading] = useState<boolean>(false);
    const [data, setData] = useState<any[]>([]);
    const [total ,setTotal] = useState<number>();
    useEffect(() => {
        setLoading(true);
        fetchSupernodesState().then(data => {
            const { total, init, error, enabled } = data;
            setLoading(false);
            setData([
                { type: 'ENABLED', value: enabled },
                { type: 'INITIALIZE', value: init },
                { type: 'ERROR', value: error },
            ]);
            setTotal(total)
        })
    }, []);

    const config = {
        data,
        angleField: 'value',
        colorField: 'type',
        radius: 0.8,
        label: {
            type: 'spider',
            labelHeight: 28,
            content: '{name}\n{value}',
        },
        legend: {
            color: {
                title: false,
                position: 'right',
                rowPadding: 5,
            },
        },
        color: ['#3D76DD', '#8f7a7a', 'red', '#faad14']
    };

    return <>
        <Row>
            <Col style={{ height: "300px" , textAlign:"center"}} span={24}>
                {
                    total &&  <Text strong>Total Number of Supernodes:{total}</Text>
                }
                <Pie loading={loading} {...config} />
            </Col>
        </Row>
    </>
}

import { Card, Typography, Input, Button, Tooltip, Row, Col, Divider } from 'antd';
import {
    ArrowLeftOutlined,
    HighlightOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router';
import { useEffect, useState } from 'react';
import { fetchAll } from '../../services/chart';
import ChartTxns, { TxnsChartType } from './Chart-Txns';
import ChartAddresses, { AddressesChartType } from './Chart-Addresses';
const { Title, Text, Paragraph, Link } = Typography;

export default () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [addressesChartData, setAddressesChartData] = useState<AddressesChartType[]>([]);

    useEffect(() => {
        doFetchCharts();
    }, []);

    function doFetchCharts() {
        setLoading(true);
        fetchAll().then(data => {
            setLoading(false);
            const _addressesChartData: AddressesChartType[] = [];
            data.forEach(timestampStatistic => {
                const { date, totalAddress } = timestampStatistic;
                _addressesChartData.push({ date, count: totalAddress });
            });
            setAddressesChartData(_addressesChartData);
        });
    }

    return <>
        <Row>
            <Text style={{
                cursor: "pointer"
            }} onClick={() => {
                navigate("/charts")
            }}><ArrowLeftOutlined /> Charts & Statistics</Text>
        </Row>
        <br />
        <Row>
            <Title level={3}>Blockchain Unique Addresses Chart</Title>
        </Row>
        <Divider style={{ marginTop: "15px" }} />
        <Row>
            <Col span={16}>
                <Card loading={loading} title="Blockchain Unique Addresses Chart">
                    <ChartAddresses data={addressesChartData} config={{
                        xAxis: {
                            range: [0, 1],
                        },
                        animation: false,
                        slider: {
                            start: 0,
                            end: 1,
                            trendCfg: {
                                isArea: true,
                            },
                        },
                    }}></ChartAddresses>
                </Card>
            </Col>
            <Col span={8} style={{ paddingLeft: "20px" }}>
                <Title level={5}>About</Title>
                <Text>
                    The chart highlights the total number of transactions on the Safe4 Blockchain blockchain with daily individual breakdown for average difficulty,
                    estimated hash rate, average block time and size, total block and uncle block count and total new address seen.
                </Text>
                <Divider style={{ marginTop: "15px" }} />
                <Text type='secondary'><HighlightOutlined /> Highlight</Text>
                <br />
                <Text>Highest number of <Text strong>16,262,505</Text> transactions on Thursday, November 25, 2021</Text>
                <Divider style={{ marginTop: "15px" }} />
                <Text type='secondary'><HighlightOutlined /> Highlight</Text>
                <br />
                <Text>Highest number of <Text strong>16,262,505</Text> transactions on Thursday, November 25, 2021</Text>
            </Col>
        </Row>
    </>
}